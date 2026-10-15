import React from 'react';

export function RideCardSkeleton() {
  return (
    <div className="bg-white rounded-card p-5 border border-slate-200/80 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-28 h-6 skeleton rounded-full" />
        <div className="w-16 h-5 skeleton rounded-full" />
      </div>
      <div className="space-y-3 pl-3 border-l-2 border-slate-100">
        <div className="space-y-1">
          <div className="w-12 h-3 skeleton" />
          <div className="w-48 h-5 skeleton" />
        </div>
        <div className="space-y-1">
          <div className="w-12 h-3 skeleton" />
          <div className="w-40 h-5 skeleton" />
        </div>
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full skeleton" />
          <div className="space-y-1">
            <div className="w-24 h-4 skeleton" />
            <div className="w-16 h-3 skeleton" />
          </div>
        </div>
        <div className="w-20 h-9 skeleton rounded-xl" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-32 skeleton rounded-container" />
        <div className="h-32 skeleton rounded-container" />
      </div>
      <div className="space-y-4">
        <div className="w-40 h-6 skeleton" />
        <div className="h-44 skeleton rounded-container" />
      </div>
    </div>
  );
}
