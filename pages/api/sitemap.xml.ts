import { NextApiRequest, NextApiResponse } from 'next'

import { SiteMap } from 'types'
import { host } from 'config'
import { getSiteMaps } from 'lib/front/get-site-maps'
import { getSite } from 'lib/front/resolve-notion-page'

const siteMap = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const site = getSite()
  const siteMaps = await getSiteMaps([site])

  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
  res.setHeader('Content-Type', 'text/xml')
  res.write(createSitemap(siteMaps[0]))
  res.end()
}

export default siteMap

const createSitemap = (
  siteMap: SiteMap
) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${host}</loc>
      </url>

      ${Object.keys(siteMap.canonicalPageMap)
        .map((canonicalPagePath) =>
          `
            <url>
              <loc>${host}/${canonicalPagePath}</loc>
            </url>
          `.trim()
        )
        .join('')}
    </urlset>
    `
