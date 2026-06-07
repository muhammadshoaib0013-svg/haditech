'use client'

import { usePathname } from 'next/navigation'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { BackgroundEffects } from "@/components/BackgroundEffects"
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton"
import { FloatingWhatsAppButton } from "@/components/ui/FloatingWhatsAppButton"

export function AppLayoutWrapper({ 
  children, 
  whatsappNumber,
  brandName,
  tagline,
  twitterUrl,
  githubUrl,
  linkedinUrl,
  navItems,
  footerSections
}: { 
  children: React.ReactNode, 
  whatsappNumber: string,
  brandName?: string,
  tagline?: string,
  twitterUrl?: string,
  githubUrl?: string,
  linkedinUrl?: string,
  navItems?: Array<{ id: string; label: string; href: string; sort_order: number; is_active: boolean }>,
  footerSections?: Array<{ id: string; title: string; content?: string; links: Array<{ label: string; href: string }> }>
}) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <BackgroundEffects />
      <div className="flex flex-col min-h-screen relative overflow-hidden">
        <Navbar navItems={navItems} brandName={brandName} />
        <main className="flex-1 flex flex-col relative z-10 w-full mt-24">
          <div className="flex-1 px-4 sm:px-8 lg:px-12 py-8 lg:py-12 max-w-7xl mx-auto w-full">
            {children}
          </div>
          <Footer 
            brandName={brandName}
            tagline={tagline}
            twitterUrl={twitterUrl}
            githubUrl={githubUrl}
            linkedinUrl={linkedinUrl}
            sections={footerSections}
          />
        </main>
      </div>
      <ScrollToTopButton />
      <FloatingWhatsAppButton number={whatsappNumber} message="Hello HADITECH, I want a SaaS website development service." />
    </>
  )
}
