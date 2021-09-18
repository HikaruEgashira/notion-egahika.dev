import { DefaultSeoProps } from 'next-seo'

const config: DefaultSeoProps = {
  canonical: 'https://egahika.dev',
  description: 'egahikaの制作した作品群を紹介しています',
  titleTemplate: '%s | egahika.dev',
  twitter: {
    cardType: 'summary_large_image',
    site: '@ITF_hikary',
    handle: 'hikary'
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://egahika.dev',
    title: 'egahika.dev',
    description: 'egahikaのつくったもの'
  }
}

export default config
