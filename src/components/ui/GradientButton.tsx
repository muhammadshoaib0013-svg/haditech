import React from 'react';

export const GradientButton = ({ children, onClick, className = "", type = "button" }: any) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative group overflow-hidden rounded-xl bg-foreground text-background px-6 py-3 font-medium transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:-translate-y-0.5 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="relative flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
        {children}
      </span>
    </button>
  );
};
