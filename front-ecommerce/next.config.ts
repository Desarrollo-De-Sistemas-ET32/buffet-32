export default {
  experimental: {
    // PPR requires Next.js canary; disable on stable
    ppr: false,
    inlineCss: true,
    useCache: true,
    // Allow dev assets to be requested from your ngrok tunnel origin
    allowedDevOrigins: ['https://9008f9422ac9.ngrok-free.app']
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**'
      }
    ]
  }
};
