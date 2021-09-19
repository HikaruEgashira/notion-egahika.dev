import { NextApiRequest, NextApiResponse } from 'next'

import { host } from 'config'

const robots = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
  res.setHeader('Content-Type', 'text/plain')
  res.write(`User-agent: *
Sitemap: ${host}/api/sitemap.xml
`)
  res.end()
}

export default robots
