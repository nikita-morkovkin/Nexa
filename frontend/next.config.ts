import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '7f86f122-ec06-460f-b974-b7a795917a9b.selstorage.ru',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin('./config/i18n/request.ts');
export default withNextIntl(nextConfig);
