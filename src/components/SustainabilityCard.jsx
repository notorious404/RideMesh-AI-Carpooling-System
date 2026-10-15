import React from 'react';
import { Leaf, IndianRupee, Car, Info } from 'lucide-react';

export default function SustainabilityCard({ sharedRidesCount = 18 }) {
  const co2SavedKg = (sharedRidesCount * 1.35).toFixed(1);
  const moneySaved = sharedRidesCount * 70;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-850 rounded-container p-6 border border-slate-800 text-white shadow-card relative overflow-hidden">
      
      {/* Glow highlight background */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Sustainability Impact</h3>
            <p className="text-[11px] text-slate-400 font-medium">Estimated eco savings this month</p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Impact Tracker
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <p className="text-xl font-extrabold text-white">{sharedRidesCount}</p>
          <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Shared Rides</p>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <p className="text-xl font-extrabold text-emerald-400">{co2SavedKg} kg</p>
          <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">CO₂ Saved</p>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <p className="text-xl font-extrabold text-sky-400">₹{moneySaved}</p>
          <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Cost Saved</p>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 mt-3.5 flex items-center justify-center space-x-1">
        <Info className="w-3 h-3 text-slate-400" />
        <span>Calculated estimates based on average commute vehicle emissions & shared fare.</span>
      </p>

    </div>
  );
}
