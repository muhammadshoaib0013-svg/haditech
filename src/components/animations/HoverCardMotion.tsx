"use client";
import React from 'react';
import { motion } from 'framer-motion';

export const HoverCardMotion = ({ children, className = "" }: any) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
