"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Send } from "lucide-react";
import { siteConfig } from "@/lib/data";

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

// ── Newsletter sub-form ───────────────────────────────────────────────────────
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data: { ok: boolean; message?: string; error?: string } = await res.json();

      if (data.ok) {
        setStatus("success");
        setMessage(data.message || "You're subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label="Newsletter subscription form">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          disabled={status === "loading" || status === "success"}
          className="bg-background border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-primary/50 disabled:opacity-60 transition-colors"
          aria-label="Email address for newsletter"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success" || !email.trim()}
          className="bg-foreground text-background px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
          aria-label="Subscribe to newsletter"
        >
          {status === "loading" ? (
            <>
              <span
                className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
              <span>Sending</span>
            </>
          ) : status === "success" ? (
            "✓ Done"
          ) : (
            <>
              <Send size={13} aria-hidden="true" />
              Subscribe
            </>
          )}
        </button>
      </div>

      {message && (
        <p
          className={`text-xs ${
            status === "success" ? "text-emerald-500" : "text-destructive"
          }`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </form>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
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
        {/* Brand */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {brandName.charAt(0)}
            </div>
            <span className="text-lg font-bold tracking-tight">{brandName}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{tagline}</p>
          <div className="flex items-center gap-4 pt-2">
            {twitterUrl && twitterUrl !== "#" && (
              <a
                href={twitterUrl}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            )}
            {githubUrl && githubUrl !== "#" && (
              <a
                href={githubUrl}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            )}
            {linkedinUrl && linkedinUrl !== "#" && (
              <a
                href={linkedinUrl}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Nav sections */}
        {sections && sections.length > 0 ? (
          sections.map((section) => (
            <div key={section.id}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              {section.content && (
                <p className="text-xs text-muted-foreground mb-3">{section.content}</p>
              )}
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

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold mb-4">Stay Updated</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe to our newsletter for tech insights.
          </p>
          <NewsletterForm />
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
