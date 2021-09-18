import { parsePageId } from 'notion-utils'
import { ExtendedRecordMap } from 'notion-types'

import * as acl from './acl'
import * as types from './types'
import { pageUrlOverrides, pageUrlAdditions } from './config'
import { notion } from './notion'
import { getSiteMaps } from './get-site-maps'
import { getSite } from './get-site'

export const resolveNotionPage = async (
  rawPageId?: string
): Promise<types.PageProps> => {
  let site: types.Site
  let pageId: string
  let recordMap: ExtendedRecordMap

  if (rawPageId && rawPageId !== 'index') {
    pageId = parsePageId(rawPageId)

    if (!pageId) {
      // check if the site configuration provides an override of a fallback for
      // the page's URI
      const override =
        pageUrlOverrides[rawPageId] || pageUrlAdditions[rawPageId]

      if (override) {
        pageId = parsePageId(override)
      }
    }

    if (pageId) {
      ;[site, recordMap] = await Promise.all([
        getSite(),
        notion.getPage(pageId)
      ])
    } else {
      // handle mapping of user-friendly canonical page paths to Notion page IDs
      // e.g., /developer-x-entrepreneur versus /71201624b204481f862630ea25ce62fe
      const siteMap = (await getSiteMaps())[0]
      pageId = siteMap?.canonicalPageMap[rawPageId]

      if (pageId) {
        // TODO: we're not re-using the site from siteMaps because it is
        // cached aggressively
        // site = await getSiteForDomain(domain)
        // recordMap = siteMap.pageMap[pageId]

        ;[site, recordMap] = await Promise.all([
          getSite(),
          notion.getPage(pageId)
        ])
      } else {
        return {
          error: {
            message: `Not found "${rawPageId}"`,
            statusCode: 404
          }
        }
      }
    }
  } else {
    site = await getSite()
    pageId = site.rootNotionPageId
    recordMap = await notion.getPage(pageId)
  }

  const props = { site, recordMap, pageId }
  return { ...props, ...acl.pageAcl(props) }
}
