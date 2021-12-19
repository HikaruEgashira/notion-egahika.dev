import React from 'react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { NotionPage } from 'components'

import { isDev } from 'config'
import { PageProps } from 'types'
import { getSiteMaps } from 'lib/front/get-site-maps'
import { resolveNotionPage, getSite } from 'lib/front/resolve-notion-page'

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const rawPageId = context.params.pageId as string

  try {
    const props = await resolveNotionPage(rawPageId)
    return { props }
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
      fallback: true
    }
  }

  const site = getSite()
  const siteMaps = await getSiteMaps([site])

  const ret = {
    paths: siteMaps.flatMap((siteMap) =>
      Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
        params: {
          pageId
        }
      }))
    ),
    fallback: true
  }

  return ret
}

const Page: NextPage<PageProps> = (props) => {
  return <NotionPage {...props} />
}

export default Page
