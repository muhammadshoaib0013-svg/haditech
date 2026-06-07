"use client";

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export const CopyButton = ({ text }: { text: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <button
      disabled={isCopied}
      onClick={copy}
      className="absolute right-3 top-3 p-2 rounded-md bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors backdrop-blur-sm z-10"
      aria-label="Copy code"
    >
      {isCopied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
    </button>
  );
};
