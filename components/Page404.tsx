import * as React from 'react'
import * as types from 'lib/types'
import { NextSeo } from 'next-seo'

import styles from './styles.module.css'

export const Page404: React.FC<types.PageProps> = ({ pageId, error }) => (
  <>
    <NextSeo title='404 Page Not Found' />

    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Notion Page Not Found</h1>

        {error ? (
          <p>{error.message}</p>
        ) : (
          pageId && (
            <p>
              Make sure that Notion page &quot;{pageId}&quot; is publicly
              accessible.
            </p>
          )
        )}
      </main>
    </div>
  </>
)
