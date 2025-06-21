import type { Metadata } from 'next'
import './globals.css'
import ClientChatboxWrapper from '../components/ClientChatboxWrapper';
import { AuthProvider } from '@/components/AuthContext';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          <ClientChatboxWrapper />
        </AuthProvider>
      </body>
    </html>
  )
}
