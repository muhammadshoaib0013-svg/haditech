"use client";
import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVis = () => setIsVisible(window.scrollY > 300);
    window.addEventListener('scroll', toggleVis);
    return () => window.removeEventListener('scroll', toggleVis);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-20 lg:bottom-6 right-6 z-40 p-3 rounded-full bg-foreground text-background shadow-xl hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all hover:-translate-y-1"
        >
          <ChevronUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
