import { parsePageId } from 'notion-utils'

import * as acl from './acl'
import * as types from 'types'
import * as config from 'config'
import { notion } from './notion'
import { getSiteMaps } from './get-site-maps'

export const getSite = (): types.Site => {
  return {
    domain: config.domain,
    name: config.name,
    description: config.description,
    rootNotionPageId: config.rootNotionPageId,
    rootNotionSpaceId: config.rootNotionSpaceId
  } as types.Site
}

export const resolveNotionPage = async (
  rawPageId?: string
): Promise<types.PageProps> => {
  const site = await getSite()

  let pageId: string
  if (rawPageId && rawPageId !== 'index') {
    pageId = parsePageId(rawPageId)

    // override
    if (!pageId) {
      // check if the site configuration provides an override of a fallback for
      // the page's URI
      const override =
        config.pageUrlOverrides[rawPageId] || config.pageUrlAdditions[rawPageId]
      if (override) {
        pageId = parsePageId(override)
      }
    }

    // get from sitemap
    if (!pageId) {
      // handle mapping of user-friendly canonical page paths to Notion page IDs
      // e.g., /developer-x-entrepreneur versus /71201624b204481f862630ea25ce62fe
      const siteMap = (await getSiteMaps([site]))[0]
      pageId = siteMap?.canonicalPageMap[rawPageId]

      if (!pageId) {
        return {
          error: {
            message: `Not found "${rawPageId}"`,
            statusCode: 404
          }
        }
      }
    }
  } else {
    // rawPageId === 'index'
    pageId = site.rootNotionPageId
  }

  const recordMap = await notion.getPage(pageId)
  const props = { site, recordMap, pageId }
  return { ...props, ...acl.pageAcl(props) }
}
