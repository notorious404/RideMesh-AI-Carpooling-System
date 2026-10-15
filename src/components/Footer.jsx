import React from 'react';
import { Car, ShieldCheck, Leaf, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Car className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">SmartCarpool</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time intelligent carpooling platform designed for college commuters & professionals. Reduce travel cost, emissions, and commute times.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Core Features</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#how-it-works" className="hover:text-brand-400 transition-colors">Smart Route Matching</a></li>
            <li><a href="#tracking" className="hover:text-brand-400 transition-colors">Live GPS Tracking</a></li>
            <li><a href="#cost" className="hover:text-brand-400 transition-colors">Fair Fare Splitting</a></li>
            <li><a href="#safety" className="hover:text-brand-400 transition-colors">SOS Safety Center</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Technology Stack</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>React 18 & Vite Frontend</li>
            <li>Firebase Auth & Firestore</li>
            <li>Firebase Realtime Database</li>
            <li>Google Maps JS Platform</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">B.Tech Project Specs</h4>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 space-y-2 text-xs">
            <div className="flex items-center text-emerald-400 font-medium space-x-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Algorithmic Engine</span>
            </div>
            <div className="flex items-center text-teal-400 font-medium space-x-1.5">
              <Leaf className="w-4 h-4" />
              <span>Eco Sustainability Metrics</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Department of Computer Science & Engineering
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} SmartCarpool. Final Year CSE Project.</p>
        <p className="mt-2 md:mt-0 flex items-center">
          Crafted with <Heart className="w-3.5 h-3.5 mx-1 text-red-500 fill-red-500" /> for clean mobility.
        </p>
      </div>
    </footer>
  );
}
