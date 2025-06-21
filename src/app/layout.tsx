import type { Metadata } from 'next'
import './globals.css'
import ClientChatboxWrapper from '../components/ClientChatboxWrapper';
import { AuthProvider } from '@/components/AuthContext';


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
      <body>
        <AuthProvider>
          {children}
          <ClientChatboxWrapper />
        </AuthProvider>
      </body>
    </html>
  )
}
