import React from 'react'
import Script from 'next/script'
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='ja'>
        <Head>
          <link
            rel='icon'
            href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>🤔</text></svg>'
          />
        </Head>

        <body>
          <Script src='noflash.js' />

          <Main />

          <NextScript />
        </body>
      </Html>
    )
  }
}
