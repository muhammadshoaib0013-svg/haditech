import React from 'react';
import { Star, Quote } from 'lucide-react';
import { GlowCard } from './GlowCard';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  companyUrl?: string;
  quote: string;
  rating: number;
  avatarUrl?: string;
  variant?: 'full' | 'compact';
  className?: string;
}

export const TestimonialCard = ({
  name,
  role,
  company,
  companyUrl,
  quote,
  rating,
  avatarUrl,
  variant = 'full',
  className = ''
}: TestimonialCardProps) => {
  const isCompact = variant === 'compact';

  if (isCompact) {
    return (
      <div className={`p-4 rounded-xl bg-card border border-border/50 shadow-sm relative ${className}`}>
        <Quote className="absolute top-4 right-4 w-6 h-6 text-primary/10" />
        <div className="flex gap-1 text-warning mb-2" aria-label={`Rating: ${rating} out of 5 stars`}>
          {[...Array(rating)].map((_, s) => <Star key={s} fill="currentColor" size={12} />)}
        </div>
        <p className="text-sm italic text-foreground mb-4 line-clamp-3">"{quote}"</p>
        <div className="flex items-center gap-2">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">{name.charAt(0)}</span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs font-bold">{name}</span>
            <span className="text-[10px] text-muted-foreground">{role}, {company}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GlowCard className={`flex flex-col gap-4 p-6 ${className}`}>
      <div className="flex gap-1 text-warning" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[...Array(rating)].map((_, s) => <Star key={s} fill="currentColor" size={16} />)}
      </div>
      <p className="text-foreground flex-1 italic leading-relaxed text-lg">"{quote}"</p>
      <div className="flex items-center gap-4 pt-6 border-t border-border mt-2">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <span className="text-lg font-medium text-muted-foreground">{name.charAt(0)}</span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{name}</span>
          <span className="text-sm text-primary font-medium">{role}</span>
          {companyUrl && companyUrl !== "#" ? (
            <a href={companyUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:underline">
              {company}
            </a>
          ) : (
            <span className="text-xs text-muted-foreground">{company}</span>
          )}
        </div>
      </div>
    </GlowCard>
  );
};
