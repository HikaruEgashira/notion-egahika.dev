import * as React from 'react'
import dynamic from 'next/dynamic'
import cs from 'classnames'
import { useRouter } from 'next/router'
import { useLocation } from 'react-use'
import useDarkMode from 'use-dark-mode'
import { NextSeo } from 'next-seo'

// core notion renderer
import { NotionRenderer, Code, Collection, CollectionRow } from 'react-notion-x'

// utils
import { getBlockTitle } from 'notion-utils'
import { mapPageUrl } from 'lib/renderer/map-page-url'
import { mapNotionImageUrl } from 'lib/renderer/map-image-url'
import {
  getPageDescription,
  getPageTweet
} from 'lib/renderer/get-page-property'
import { searchNotion } from 'lib/server/search-notion'
import * as types from 'types'

// components
import styles from './styles.module.css'
import { CustomFont } from './CustomFont'
import { Footer } from './Footer'
import { Loading } from './Loading'
import { Page404 } from './Page404'
import { PageActions } from './PageActions'
import { PageLink } from './PageLink'
import { PageSocial } from './PageSocial'

// dynamic components
const notionX = (component: keyof typeof import('react-notion-x')) =>
  import('react-notion-x').then((notion) => notion[component])
const Pdf = dynamic(() => notionX('Pdf'))
const Equation = dynamic(() => notionX('Equation'))
const Modal = dynamic(() => notionX('Modal'), { ssr: false })
const Tweet = dynamic(() => import('react-tweet-embed'))

export const NotionPage: React.FC<types.PageProps> = ({
  site,
  recordMap,
  error,
  pageId
}) => {
  const router = useRouter()
  const location = useLocation()

  const darkMode = useDarkMode(true, { classNameDark: 'dark-mode' })

  if (router.isFallback) {
    return <Loading />
  }

  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value
  if (error || !site || !keys.length || !block) {
    return <Page404 pageId={pageId} error={error} />
  }

  const title = getBlockTitle(block, recordMap) || site.name

  const siteMapPageUrl = mapPageUrl(site, recordMap, new URLSearchParams())

  // const isRootPage =
  //   parsePageId(block.id) === parsePageId(site.rootNotionPageId)
  const isBlogPost =
    block.type === 'page' && block.parent_table === 'collection'
  const minTableOfContentsItems = 3

  const socialDescription = getPageDescription(block, recordMap)

  let pageAside: React.ReactChild = null

  const isValidDomain = location.hostname !== site.domain

  // only display comments and page actions on blog post pages
  if (isBlogPost) {
    const tweet = getPageTweet(block, recordMap)
    if (tweet) {
      pageAside = <PageActions tweet={tweet} />
    }
  } else {
    pageAside = <PageSocial />
  }

  return (
    <>
      <NextSeo
        title={title}
        description={socialDescription}
        noindex={isValidDomain}
        nofollow={isValidDomain}
      />
      <CustomFont site={site} />

      <NotionRenderer
        bodyClassName={cs(
          styles.notion,
          pageId === site.rootNotionPageId && 'index-page'
        )}
        components={{
          // eslint-disable-next-line react/display-name
          pageLink: PageLink,
          code: Code,
          collection: Collection,
          collectionRow: CollectionRow,
          tweet: Tweet,
          modal: Modal,
          pdf: Pdf,
          equation: Equation
        }}
        recordMap={recordMap}
        rootPageId={site.rootNotionPageId}
        fullPage={true}
        darkMode={darkMode.value}
        previewImages={site.previewImages !== false}
        showCollectionViewDropdown={false}
        showTableOfContents={isBlogPost}
        minTableOfContentsItems={minTableOfContentsItems}
        defaultPageIcon={null}
        defaultPageCover={null}
        defaultPageCoverPosition={null}
        mapPageUrl={siteMapPageUrl}
        mapImageUrl={mapNotionImageUrl}
        searchNotion={searchNotion}
        pageFooter={null}
        pageAside={pageAside}
        footer={
          <Footer
            isDarkMode={darkMode.value}
            toggleDarkMode={darkMode.toggle}
          />
        }
      />
    </>
  )
}
