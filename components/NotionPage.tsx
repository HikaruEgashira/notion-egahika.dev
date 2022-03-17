import * as React from 'react'
import dynamic from 'next/dynamic'
import cs from 'classnames'
import { useRouter } from 'next/router'
import { useLocation } from 'react-use'
import useDarkMode from 'use-dark-mode'
import { NextSeo, NextSeoProps } from 'next-seo'

// core notion renderer
import {
  NotionRenderer,
  Code,
  Collection,
  CollectionRow,
  NotionRendererProps
} from 'react-notion-x'

// utils
import { getBlockTitle } from 'notion-utils'
import { mapPageUrl } from 'lib/renderer/map-page-url'
import { mapNotionImageUrl } from 'lib/renderer/map-image-url'
import { getPageDescription } from 'lib/renderer/get-page-property'
import { searchNotion } from 'lib/server/search-notion'
import * as types from 'types'

// components
import styles from './styles.module.css'
import { CustomFont } from './CustomFont'
import { Footer } from './Footer'
import { Loading } from './Loading'
import { Page404 } from './Page404'
import { PageLink } from './PageLink'
import { PageSocial } from './PageSocial'

// dynamic components
const notionX = (component: keyof typeof import('react-notion-x')) =>
  import('react-notion-x').then((notion) => notion[component])
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

  // seo
  const title = getBlockTitle(block, recordMap) || site.name
  const description = getPageDescription(block, recordMap)
  const isValidDomain = location.hostname !== site.domain
  const seoProps: NextSeoProps = {
    title,
    description,
    nofollow: isValidDomain,
    noindex: isValidDomain
  }

  const siteMapPageUrl = mapPageUrl(site, recordMap, new URLSearchParams())
  const isBlogPost =
    block.type === 'page' && block.parent_table === 'collection'

  const notionProps: NotionRendererProps = {
    recordMap,
    bodyClassName: cs(
      styles.notion,
      pageId === site.rootNotionPageId && 'index-page'
    ),
    rootPageId: site.rootNotionPageId,
    fullPage: true,
    darkMode: darkMode.value,
    previewImages: site.previewImages !== false,
    showCollectionViewDropdown: false,
    showTableOfContents: isBlogPost,
    minTableOfContentsItems: 3,
    mapPageUrl: siteMapPageUrl,
    mapImageUrl: mapNotionImageUrl,
    searchNotion
  }

  return (
    <>
      <NextSeo {...seoProps} />
      <CustomFont site={site} />

      <NotionRenderer
        {...notionProps}
        components={{
          pageLink: PageLink,
          code: Code,
          collection: Collection,
          collectionRow: CollectionRow,
          tweet: Tweet,
          modal: Modal,
          equation: Equation
        }}
        footer={
          <Footer
            isDarkMode={darkMode.value}
            toggleDarkMode={darkMode.toggle}
          />
        }
        pageAside={<PageSocial />}
      />
    </>
  )
}
