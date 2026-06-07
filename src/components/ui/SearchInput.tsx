import React from 'react';
import { Search } from 'lucide-react';

export const SearchInput = ({ placeholder = "Search...", ...props }: any) => {
  return (
    <div className="relative group w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
        <Search size={18} />
      </div>
      <input
        type="text"
        className="w-full bg-card/50 border border-border rounded-xl py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-muted-foreground"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};
