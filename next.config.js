const withTM = require('next-transpile-modules')(['p-map'])

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withTM(
  withBundleAnalyzer({
    images: {
      domains: ['pbs.twimg.com']
    }
  })
)
