"use client";
import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

import { siteConfig } from '@/lib/data';

export interface FooterProps {
  brandName?: string;
  tagline?: string;
  twitterUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  sections?: Array<{
    id: string;
    title: string;
    content?: string;
    links: Array<{ label: string; href: string }>;
  }>;
}

export default function Footer({
  brandName = siteConfig.brandName,
  tagline = siteConfig.tagline,
  twitterUrl = siteConfig.socials.twitter,
  githubUrl = siteConfig.socials.github,
  linkedinUrl = siteConfig.socials.linkedin,
  sections,
}: FooterProps) {
  return (
    <footer className="mt-24 border-t border-border bg-card/30 backdrop-blur-sm pt-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {brandName.charAt(0)}
            </div>
            <span className="text-lg font-bold tracking-tight">{brandName}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tagline}
          </p>
          <div className="flex items-center gap-4 pt-2">
            {twitterUrl && twitterUrl !== '#' && (
              <a href={twitterUrl} className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={18} /></a>
            )}
            {githubUrl && githubUrl !== '#' && (
              <a href={githubUrl} className="text-muted-foreground hover:text-primary transition-colors"><Github size={18} /></a>
            )}
            {linkedinUrl && linkedinUrl !== '#' && (
              <a href={linkedinUrl} className="text-muted-foreground hover:text-primary transition-colors"><Linkedin size={18} /></a>
            )}
          </div>
        </div>

        {sections && sections.length > 0 ? (
          sections.map((section) => (
            <div key={section.id}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              {section.content && <p className="text-xs text-muted-foreground mb-3">{section.content}</p>}
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.href} className="hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/services" className="hover:text-foreground transition-colors">SaaS Development</Link></li>
                <li><Link href="/services" className="hover:text-foreground transition-colors">Custom Web Apps</Link></li>
                <li><Link href="/services" className="hover:text-foreground transition-colors">AI Integrations</Link></li>
                <li><Link href="/services" className="hover:text-foreground transition-colors">Frontend Revamps</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/projects" className="hover:text-foreground transition-colors">Portfolio</Link></li>
                <li><Link href="/case-studies" className="hover:text-foreground transition-colors">Case Studies</Link></li>
                <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
          </>
        )}

        <div>
          <h4 className="font-semibold mb-4">Stay Updated</h4>
          <p className="text-sm text-muted-foreground mb-4">Subscribe to our newsletter for tech insights.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Email address" className="bg-background border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-primary/50" />
            <button className="bg-foreground text-background px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} HADITECH. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
