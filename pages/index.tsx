import React from 'react'
import { GetStaticProps, NextPage } from 'next'
import { NotionPage } from 'components'

import { domain } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import * as types from 'lib/types'

export const getStaticProps: GetStaticProps<types.PageProps> = async () => {
  try {
    const props = await resolveNotionPage(domain)

    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export const NotionDomainPage: NextPage<types.PageProps> = (props) => {
  return <NotionPage {...props} />
}
export default NotionDomainPage
