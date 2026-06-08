import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center';
}

export const SectionHeader = ({ title, subtitle, badge, align = 'left' }: SectionHeaderProps) => {
  return (
    <div className={`flex flex-col gap-4 mb-12 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
      {badge && (
        <span className="inline-flex items-center text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/10 shadow-sm">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading leading-tight">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">{subtitle}</p>}
    </div>
  );
};
