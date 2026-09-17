import Script from 'next/script';
import { Noto_Naskh_Arabic, JetBrains_Mono } from 'next/font/google';
import { site } from '@/lib/site';
import './globals.css';

const arabicFont = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});


export const metadata = {
  metadataBase: new URL(site.url),

  title: {
    default: site.title,
    template: `%s — ${site.title}`,
  },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.owner }],
  creator: site.owner,

  alternates: {
    canonical: '/',
  },

  // كيفاش تظهر عند مشاركة الرابط (فيسبوك، واتساب، لينكدإن...)
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.title,
    locale: site.locale,
    type: 'website',
    images: ['/opengraph-image.png'],
  },

  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
    creator: site.twitterHandle,
    images: ['/opengraph-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
  },

};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${arabicFont.variable} ${monoFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem('theme')||'auto';if(t!=='auto'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}`}
        </Script>
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
