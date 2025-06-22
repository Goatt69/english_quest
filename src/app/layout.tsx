import type { Metadata } from 'next'
import './globals.css'
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

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
      <body>
        <Navbar/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  )
}
