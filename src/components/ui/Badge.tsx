import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'outline' | 'secondary';

export const Badge = ({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) => {
  const base = 'inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border';

  const variants: Record<BadgeVariant, string> = {
    default: 'bg-primary/8 text-primary border-primary/20',
    // success: use a neutral blue-teal, NOT green
    success: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    outline: 'bg-transparent text-muted-foreground border-border',
    secondary: 'bg-secondary text-secondary-foreground border-border',
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
