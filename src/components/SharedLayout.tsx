'use client';

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ClientChatboxWrapper from './ClientChatboxWrapper';

interface SharedLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  showChatbox?: boolean;
  className?: string;
}

export default function SharedLayout({ 
  children, 
  showNavbar = true, 
  showFooter = true, 
  showChatbox = true,
  className = ""
}: SharedLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {showNavbar && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
        {showChatbox && <ClientChatboxWrapper />}
    </div>
  );
}