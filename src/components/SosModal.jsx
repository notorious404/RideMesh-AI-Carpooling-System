import React, { useState } from 'react';
import { ShieldAlert, PhoneCall, Share2, X, Check, Info } from 'lucide-react';

export default function SosModal({ isOpen, onClose, rideDetails }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShareLocation = () => {
    const text = `[SmartCarpool SOS Alert] I am currently in a shared ride from ${rideDetails?.source || 'Source'} to ${rideDetails?.destination || 'Destination'}. Driver: ${rideDetails?.driverName || 'Driver'}. Track my active status on SmartCarpool application.`;
    
    if (navigator.share) {
      navigator.share({
        title: 'SmartCarpool Safety Alert',
        text: text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SOS Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Safety & Emergency</h3>
            <p className="text-xs text-red-600 font-semibold uppercase tracking-wider">
              Prototype Feature Notice
            </p>
          </div>
        </div>

        {/* Prototype Alert Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-5 flex items-start space-x-2.5">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed font-medium">
            This safety module is designed for emergency situation response. In a real emergency, always call official emergency helplines (112 / 100).
          </p>
        </div>

        {/* Quick Emergency Actions */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleShareLocation}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Location Link Copied!' : 'Share Live Ride Details'}</span>
          </button>

          <a
            href="tel:112"
            className="w-full py-3 px-4 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call National Emergency (112)</span>
          </a>
        </div>

        {/* Ride Context Summary */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 text-xs space-y-1.5">
          <p className="text-slate-500 font-semibold">Active Ride Information:</p>
          <p className="text-slate-800 font-bold">Driver: {rideDetails?.driverName || 'Rahul Sharma'}</p>
          <p className="text-slate-600">Vehicle: {rideDetails?.vehicleInfo || 'White Sedan'}</p>
          <p className="text-slate-600 truncate">Route: {rideDetails?.source} → {rideDetails?.destination}</p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          Dismiss Alert
        </button>
      </div>
    </div>
  );
}
