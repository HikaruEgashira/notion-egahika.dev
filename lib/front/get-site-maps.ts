import pMap from 'p-map'

import { getAllPages } from './get-all-pages'
import * as types from 'types'

export const getSiteMaps = async (
  sites: types.Site[]
): Promise<types.SiteMap[]> => {
  const siteMaps = await pMap(
    sites,
    async (site, index) => {
      try {
        return {
          site,
          ...(await getAllPages(site.rootNotionPageId, site.rootNotionSpaceId))
        } as types.SiteMap
      } catch (err) {
        console.warn('site build error', index, site, err)
      }
    },
    {
      concurrency: 4
    }
  )

  return siteMaps.filter(Boolean)
}
