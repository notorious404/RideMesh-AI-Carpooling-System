import React from 'react';
import { Loader2, Car } from 'lucide-react';

export default function LoadingSpinner({ fullScreen = false, label = "Loading..." }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
        <div className="relative mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center shadow-glow animate-pulse">
            <Car className="w-7 h-7 text-slate-950 font-bold" />
          </div>
          <Loader2 className="w-16 h-16 text-brand-400 animate-spin absolute -top-1 -left-1 opacity-75" />
        </div>
        <p className="text-slate-300 font-medium text-sm tracking-wide">{label}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-2" />
      {label && <p className="text-xs text-slate-500 font-medium">{label}</p>}
    </div>
  );
}
