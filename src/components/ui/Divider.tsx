import React from 'react';

export const Divider = ({ className = "" }: { className?: string }) => {
  return <div className={`w-full h-px bg-gradient-to-r from-transparent via-border to-transparent ${className}`} />;
};
