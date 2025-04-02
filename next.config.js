/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.coworking.wibes.co.in' }],
        destination: 'https://coworking.wibes.co.in/:path*',
        permanent: true
      }
    ]
  },
}

module.exports = nextConfig
