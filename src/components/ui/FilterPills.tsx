import React from 'react';

export const FilterPills = ({ options, active, onChange }: any) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt: string) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            active === opt 
            ? 'bg-foreground text-background shadow-md' 
            : 'bg-card/50 text-muted-foreground border border-border hover:border-primary/50 hover:text-foreground'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};
