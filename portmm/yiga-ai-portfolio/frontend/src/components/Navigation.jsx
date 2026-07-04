import React from 'react';
import { Briefcase, Code, Database } from 'lucide-react';

export default function Navigation() {
  return (
    <header className="max-w-7xl w-full mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-900/60 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
        <h1 className="text-xl font-bold tracking-tight text-white font-mono">YIGA_JUNIOR.AI</h1>
      </div>
    
    </header>
  );
}
