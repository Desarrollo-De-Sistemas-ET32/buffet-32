<<<<<<< Updated upstream
export default {
  experimental: {
    ppr: true,
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
      }
    ]
=======
import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [];
const hosts = new Set<string>();

const addHost = (hostname: string) => {
  if (!hostname || hosts.has(hostname)) {
    return;
>>>>>>> Stashed changes
  }

  hosts.add(hostname);
  remotePatterns.push({
    protocol: 'https',
    hostname,
    port: '',
    pathname: '/**',
  });
};

['s2.abcstatics.com', 'placehold.co', 'marketplace.canva.com', '*.r2.cloudflarestorage.com'].forEach(addHost);

['pub-0dcf2ff1ea3a497e9e859c63307e1b1b.r2.dev', 'pub-9851b7b8b08de28d2473d28dc093b105.r2.dev'].forEach(addHost);

if (process.env.R2_PUBLIC_URL) {
  const candidates = process.env.R2_PUBLIC_URL.split(',').map((value) => value.trim());
  candidates.forEach((candidate) => {
    if (!candidate) return;
    try {
      const parsed = new URL(candidate);
      addHost(parsed.hostname);
    } catch (error) {
      console.warn(`Invalid R2_PUBLIC_URL entry "${candidate}"; skipping`);
    }
  });
} else if (process.env.R2_ACCOUNT_ID) {
  addHost(`pub-${process.env.R2_ACCOUNT_ID}.r2.dev`);
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  experimental: {
    useCache: true,
  },
};

export default nextConfig;
