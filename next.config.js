/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['pbs.twimg.com', 'images.unsplash.com', 'www.notion.so']
  }
}

module.exports = nextConfig
