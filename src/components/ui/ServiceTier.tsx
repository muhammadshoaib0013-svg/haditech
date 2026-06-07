import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock } from 'lucide-react';
import { GlowCard } from './GlowCard';
import { Badge } from './Badge';

interface ServiceTierProps {
  service: any;
  icon: any;
}

export const ServiceTier = ({ service, icon: Icon }: ServiceTierProps) => {
  return (
    <GlowCard className={`flex flex-col h-full ${service.popular ? 'border-primary shadow-[0_0_30px_-10px_var(--primary)]' : 'border-primary/20'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Icon size={28} />
        </div>
        <div className="flex flex-col items-end gap-2">
          {service.popular && <Badge variant="success">Most Popular</Badge>}
          <Badge variant="outline" className="capitalize">{service.tier} Tier</Badge>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-2 text-foreground">{service.title}</h3>
      <p className="text-muted-foreground mb-6 flex-1 text-sm leading-relaxed">{service.shortDescription}</p>
      
      <div className="text-3xl font-extrabold text-foreground mb-8">
        {service.pricingHint}
      </div>

      <div className="space-y-4 mb-8 flex-1">
        <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">What's Included</h4>
        <ul className="space-y-3">
          {service.features.map((item: string, j: number) => (
            <li key={j} className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-6 border-t border-border flex flex-col gap-4">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground bg-muted/30 py-2 rounded-lg">
          <Clock size={16} /> Estimated {service.deliveryTime}
        </div>
        <Link href="/contact" className="w-full">
          <button className={`w-full py-3 rounded-xl font-bold transition-all ${service.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
            Select {service.tier}
          </button>
        </Link>
      </div>
    </GlowCard>
  );
};
