import React from 'react';
import { GlowCard } from './GlowCard';

export const StatCard = ({ title, value, prefix = "", suffix = "", icon: Icon }: any) => {
  return (
    <GlowCard className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-muted-foreground">
        <span className="text-sm font-medium">{title}</span>
        {Icon && <Icon size={18} />}
      </div>
      <div className="text-3xl font-bold text-foreground mt-2">
        {prefix}{value}{suffix}
      </div>
    </GlowCard>
  );
};
