import React from 'react'
import { GetStaticProps, NextPage } from 'next'
import { NotionPage } from 'components'

import { resolveNotionPage } from 'lib/front/resolve-notion-page'
import * as types from 'types'

export const getStaticProps: GetStaticProps<types.PageProps> = async () => {
  const props = await resolveNotionPage()

  return { props, revalidate: 10 }
}

const Page: NextPage<types.PageProps> = (props) => {
  return <NotionPage {...props} />
}
export default Page
