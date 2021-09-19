import Link from 'next/link'
import React from 'react'
import type { PX } from 'react-props-x'

export const PageLink: React.FC<PX<typeof Link> & PX<'a'>> = ({
  href,
  as,
  passHref,
  prefetch,
  replace,
  scroll,
  shallow,
  locale,
  ...props
}) => (
  <Link
    href={href}
    as={as}
    passHref={passHref}
    prefetch={prefetch}
    replace={replace}
    scroll={scroll}
    shallow={shallow}
    locale={locale}
  >
    <a {...props} />
  </Link>
)
