"use client";
import React from 'react';
import { motion } from 'framer-motion';

export const FloatingWhatsAppButton = ({ number, message = "Hi Haditech, I'm interested in working with you!" }: any) => {
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-6 right-20 lg:right-20 z-40 w-14 h-14 bg-success text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_hsla(var(--success),0.5)] transition-all hover:scale-110"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.128.552 4.195 1.603 6.012L.412 24l6.113-1.603a11.96 11.96 0 005.506 1.341h.005c6.645 0 12.031-5.385 12.031-12.032S18.676 0 12.031 0zm0 21.724c-1.8 0-3.565-.483-5.11-1.4l-.367-.218-3.797.996.996-3.796-.218-.368A9.972 9.972 0 012.052 12.03c0-5.503 4.48-9.982 9.983-9.982 2.668 0 5.176 1.04 7.062 2.927a9.92 9.92 0 012.924 7.058c-.001 5.503-4.48 9.991-9.99 9.991zm5.474-7.48c-.3-.15-1.776-.877-2.05-.977-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.49-.893-.795-1.496-1.778-1.671-2.078-.175-.3-.018-.462.132-.611.135-.135.3-.351.45-.526.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.626-.925-2.226-.243-.585-.49-.505-.675-.514-.175-.009-.375-.009-.575-.009s-.525.075-.8.375c-.275.3-1.05 1.026-1.05 2.502s1.075 2.898 1.225 3.098c.15.2 2.11 3.22 5.11 4.516.714.308 1.27.493 1.705.63.717.228 1.368.196 1.884.119.58-.087 1.776-.726 2.026-1.426.25-.7.25-1.301.175-1.426-.075-.125-.275-.2-.575-.35z"/>
      </svg>
    </motion.a>
  );
};
