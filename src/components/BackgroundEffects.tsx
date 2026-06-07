"use client";

import React from "react";

export const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-background transition-colors duration-500" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
      <div className="absolute inset-0 bg-noise mix-blend-overlay" />
      
      {/* Floating Orbs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:opacity-[0.05]" />
      <div className="absolute top-0 -right-4 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:opacity-[0.05]" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:opacity-[0.05]" style={{ animationDelay: '4s' }} />
    </div>
  );
};
