"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { heroContent, siteConfig, stats } from '@/lib/data';
import { AvailabilityBadge } from '../ui/AvailabilityBadge';

const CountUp = ({ to, duration = 2 }: { to: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = to / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [to, duration, isInView]);

  return <span ref={ref}>{count}</span>;
};

export interface HeroProps {
  headline?: string;
  subheadline?: string;
  whatsappLink?: string;
  availabilityOpen?: boolean;
  availabilityMessage?: string;
  stats?: Array<{ label: string; value: string; suffix: string }>;
}

export const Hero = ({
  headline = heroContent.headline,
  subheadline = heroContent.subheadline,
  whatsappLink = siteConfig.whatsappLink,
  availabilityOpen = siteConfig.availability.open,
  availabilityMessage = siteConfig.availability.message,
  stats: propsStats = stats,
}: HeroProps) => {
  const titleWords = headline.split(" ");
  
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-20 mix-blend-screen" />

      <div className="container relative z-10 px-4 mx-auto text-center">
        
        {/* Availability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <AvailabilityBadge open={availabilityOpen} message={availabilityMessage} />
        </motion.div>

        {/* Animated Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="inline-block mr-4 text-foreground last:mr-0 last:text-primary"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: titleWords.length * 0.1 }}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
        >
          {subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: (titleWords.length * 0.1) + 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
        >
          <Link href="/portfolio">
            <button className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-extrabold text-xs uppercase tracking-wider rounded-lg hover:bg-primary/95 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm">
              See my work <ArrowRight size={16} />
            </button>
          </Link>
          <a href={process.env.NEXT_PUBLIC_WHATSAPP_LINK || whatsappLink} target="_blank" rel="noopener noreferrer">
            <button className="flex items-center gap-2 px-8 py-4 bg-card hover:bg-muted/30 border border-border text-foreground font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm">
              Book free call <MessageSquare size={16} />
            </button>
          </a>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: (titleWords.length * 0.1) + 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-24 pt-12 border-t border-border/50"
        >
          {propsStats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="text-4xl md:text-5xl font-extrabold text-foreground">
                <CountUp to={parseFloat(stat.value)} />
                {stat.suffix}
              </span>
              <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
