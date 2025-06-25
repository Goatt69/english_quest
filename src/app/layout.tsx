import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthContext';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'English Quest - Learn English Interactively',
  description: 'Master English with interactive lessons, gamified learning, and AI-powered tutoring. Start your language learning journey today!',
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
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8925433318915764`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AuthProvider>
            {children}
        </AuthProvider>
    </body>
    </html>
    )
}
