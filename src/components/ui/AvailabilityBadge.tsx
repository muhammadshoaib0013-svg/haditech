import React from 'react';

export const AvailabilityBadge = ({ open, message }: { open: boolean, message: string }) => {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${open ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
      <span className="relative flex h-2 w-2">
        {open && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${open ? 'bg-success' : 'bg-warning'}`}></span>
      </span>
      {message}
    </div>
  );
};
