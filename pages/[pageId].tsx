import React from 'react'
import { GetStaticPaths, NextPage } from 'next'
import { NotionPage } from 'components'

import { isDev } from 'config'
import { PageProps } from 'types'
import { getSiteMaps } from 'lib/front/get-site-maps'
import { resolveNotionPage, getSite } from 'lib/front/resolve-notion-page'

export const getStaticProps = async (context) => {
  const rawPageId = context.params.pageId as string

  try {
    if (rawPageId === 'sitemap.xml' || rawPageId === 'robots.txt') {
      return {
        redirect: {
          destination: `/api/${rawPageId}`
        }
      }
    }

    const props = await resolveNotionPage(rawPageId)

    return { props, revalidate: 10 }
  } catch (err) {
    return {
      notFound: true
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  if (isDev) {
    return {
      paths: [],
      fallback: false
    }
  }

  const site = await getSite()
  const siteMaps = await getSiteMaps([site])

  const ret = {
    paths: siteMaps.flatMap((siteMap) =>
      Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
        params: {
          pageId
        }
      }))
    ),
    fallback: false
  }

  return ret
}

const DynamicPage: NextPage<PageProps> = (props) => {
  return <NotionPage {...props} />
}

export default DynamicPage
