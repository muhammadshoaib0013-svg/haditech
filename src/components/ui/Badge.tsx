import React from 'react';

export const Badge = ({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: "default"|"success"|"warning"|"outline", className?: string }) => {
  const base = "px-3 py-1 text-xs font-medium rounded-full border";
  const variants = {
    default: "bg-primary/10 text-primary border-primary/20",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    outline: "bg-transparent text-muted-foreground border-border",
  };
  
  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
