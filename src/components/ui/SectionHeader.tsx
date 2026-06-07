import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center';
}

export const SectionHeader = ({ title, subtitle, badge, align = 'left' }: SectionHeaderProps) => {
  return (
    <div className={`flex flex-col gap-3 mb-10 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
      {badge && (
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-lg max-w-2xl">{subtitle}</p>}
    </div>
  );
};
