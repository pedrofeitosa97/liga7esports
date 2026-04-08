/** @type {import('next').NextConfig} */
const backendOrigin =
  process.env.BACKEND_ORIGIN?.replace(/\/$/, '') || 'http://localhost:3001';

const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  /** Browser → mesmo host (/liga7-api) → servidor Next encaminha para Railway (sem CORS no browser). */
  async rewrites() {
    return [
      {
        source: '/liga7-api/:path*',
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
