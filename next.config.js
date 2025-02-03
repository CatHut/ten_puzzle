/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/games/ten_puzzle',  // この行を追加
  assetPrefix: '/games/ten_puzzle/',  // この行を追加
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig