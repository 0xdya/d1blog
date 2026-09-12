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
  title: {
    default: site.title,
    template: `%s — ${site.title}`,
  },
  description: site.description,
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
