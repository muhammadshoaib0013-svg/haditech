"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { TestimonialCard } from './TestimonialCard';
import { testimonials } from '@/lib/data';

// Duplicate testimonials to create a seamless infinite loop
const loopedTestimonials = [...testimonials, ...testimonials];

export const TestimonialsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Speed of the infinite scroll
  const speed = 1;
  const [x, setX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current && scrollRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      // The scrollRef holds 2 identical sets of items.
      // So half of its width is one full set.
      setContentWidth(scrollRef.current.scrollWidth / 2);
    }
    
    const handleResize = () => {
      if (containerRef.current && scrollRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setContentWidth(scrollRef.current.scrollWidth / 2);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useAnimationFrame(() => {
    if (isHovered) return;
    if (contentWidth === 0) return;
    
    setX((prevX) => {
      const newX = prevX - speed;
      // If we've scrolled exactly the width of the first set, reset to 0 seamlessly
      if (Math.abs(newX) >= contentWidth) {
        return 0;
      }
      return newX;
    });
  });

  // Use CSS scroll snap on mobile, Framer motion on desktop
  return (
    <div 
      className="relative w-full overflow-hidden py-10"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* Gradient masks for fading edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none hidden md:block" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none hidden md:block" />
      
      {/* Desktop Animated Scroll Container */}
      <motion.div 
        ref={scrollRef}
        className="hidden md:flex gap-6 whitespace-nowrap px-4"
        style={{ x, width: "max-content" }}
      >
        {loopedTestimonials.map((t, idx) => (
          <div key={`${t.id}-${idx}`} className="w-[400px] shrink-0 whitespace-normal">
            <TestimonialCard {...t} />
          </div>
        ))}
      </motion.div>

      {/* Mobile Scroll-Snap Container Fallback */}
      <div className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-8 scrollbar-hide">
        {testimonials.map((t) => (
          <div key={t.id} className="w-[300px] sm:w-[350px] shrink-0 snap-center">
            <TestimonialCard {...t} />
          </div>
        ))}
      </div>
    </div>
  );
};
