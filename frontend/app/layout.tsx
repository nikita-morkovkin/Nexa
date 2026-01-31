import { Toaster } from '@/components/ui/common/Sonner';
import ColorSwitcher from '@/components/ui/elements/ColorSwitcher';
import ApolloClientProvider from '@/providers/ApolloClientProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import {
  WEBSITE_DESCRIPTION,
  WEBSITE_KEYWORDS,
  WEBSITE_NAME,
} from '@/shared/constants/seo.constants';
import { APP_URL } from '@/shared/constants/url.constants';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { type ReactNode } from 'react';
import '../styles/globals.css';
import '../styles/themes.css';

export const metadata: Metadata = {
  title: {
    absolute: `${WEBSITE_NAME}`,
    template: `%s - ${WEBSITE_NAME}`,
  },
  description: WEBSITE_DESCRIPTION,
  metadataBase: new URL(APP_URL),
  applicationName: WEBSITE_NAME,
  authors: [
    {
      name: 'Nikita Morkovkin',
      url: new URL('https:github.com/nikita-morkovkin'),
    },
  ],
  keywords: WEBSITE_KEYWORDS,
  generator: 'Next.js',
  creator: 'Nikita Morkovkin',
  publisher: 'NK Team',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/touch-icons/256x256.png',
    other: {
      rel: 'touch-icons',
      url: 'touch-icons/256x256.png',
      sizes: '256x256',
      type: 'png',
    },
  },
  openGraph: {
    title: WEBSITE_NAME,
    description: WEBSITE_DESCRIPTION,
    type: 'website',
    emails: ['nikitamorkovkinwork@gmail.com'],
    locale: 'ru-RU',
    images: [
      {
        url: '/touch-icons/512x512.png',
        width: 512,
        height: 512,
        alt: WEBSITE_NAME,
      },
    ],
    url: new URL(APP_URL),
  },
  twitter: {
    title: WEBSITE_NAME,
    description: WEBSITE_DESCRIPTION,
    images: [
      {
        url: '/touch-icons/512x512.png',
        width: 512,
        height: 512,
        alt: WEBSITE_NAME,
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen antialiased`}
      >
        <ColorSwitcher />
        <ApolloClientProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute='class'
              defaultTheme='light'
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
