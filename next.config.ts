import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dvktrglcfrowudopmpup.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'www.backcountrylight.id',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
