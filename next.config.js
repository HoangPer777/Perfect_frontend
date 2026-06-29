/** @type {import('next').NextConfig} */
const backendOrigin = (
  process.env.API_INTERNAL_URL ||
  'http://host.docker.internal:8080/api/v1'
).replace(/\/api\/v1\/?$/, '');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendOrigin}/api/v1/:path*`,
      },
      {
        source: '/oauth2/:path*',
        destination: `${backendOrigin}/oauth2/:path*`,
      },
      {
        source: '/login/oauth2/:path*',
        destination: `${backendOrigin}/login/oauth2/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
