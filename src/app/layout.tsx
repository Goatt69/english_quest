import type { Metadata } from 'next'
import './globals.css'
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ClientChatboxWrapper from '../components/ClientChatboxWrapper';
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
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </head>
      <body>
      <Navbar/>
        <AuthProvider>
          {children}
          <ClientChatboxWrapper />
        </AuthProvider>
      <Footer/>
      </body>
    </html>
  )
}
