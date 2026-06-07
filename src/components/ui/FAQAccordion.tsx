"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { GlowCard } from './GlowCard';

interface FAQ {
  question: string;
  answer: string;
}

export const FAQAccordion = ({ faqs }: { faqs: FAQ[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4 max-w-3xl mx-auto w-full">
      {faqs.map((faq, index) => (
        <GlowCard key={index} className="overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-6 text-left"
            aria-expanded={openIndex === index}
          >
            <span className="font-bold text-lg text-foreground pr-8">{faq.question}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="shrink-0 text-primary"
            >
              <ChevronDown size={24} />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-6 pb-6 pt-0 text-muted-foreground text-lg leading-relaxed border-t border-border/30">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlowCard>
      ))}
    </div>
  );
};
