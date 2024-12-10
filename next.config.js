/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.ngrok-free.app',
        port: '',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'wasteless.intechsosmed.my.id',
        port: '',
        pathname: '/api/uploads/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : 'http://localhost:5000/:path*', // Fallback URL
      },
    ];
  },
}

module.exports = nextConfig;