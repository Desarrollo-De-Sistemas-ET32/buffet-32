export default {
  experimental: {
    // PPR requires Next.js canary; disable on stable
    ppr: false,
    inlineCss: true,
    useCache: true
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**'
      }
    ]
  images: {
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    // Allow dev assets to be requested from your ngrok tunnel origin
    allowedDevOrigins: ['https://9008f9422ac9.ngrok-free.app']
  }
};
