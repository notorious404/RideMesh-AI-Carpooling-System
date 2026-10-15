import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Search, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  Compass, 
  DollarSign, 
  Users, 
  Radio
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-brand-400 shadow-xs">
                <Sparkles className="w-4 h-4 text-brand-400 fill-brand-400/20" />
                <span>Smart Carpooling & Ride Sharing Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Share the Ride.<br />
                <span className="bg-gradient-to-r from-brand-400 via-emerald-300 to-sky-400 bg-clip-text text-transparent">
                  Split the Cost.
                </span><br />
                Move Smarter.
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                SmartCarpool connects people travelling along similar routes so they can share rides, reduce travel costs and make daily commuting more sustainable.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/find-ride"
                  className="w-full sm:w-auto px-8 py-4 rounded-container bg-brand-500 hover:bg-brand-600 text-slate-950 font-extrabold text-base shadow-glow btn-interaction flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5 stroke-[2.5]" />
                  <span>Find a Ride</span>
                </Link>

                <Link
                  to="/create-ride"
                  className="w-full sm:w-auto px-8 py-4 rounded-container bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base border border-slate-700 btn-interaction flex items-center justify-center space-x-2"
                >
                  <PlusCircle className="w-5 h-5 stroke-[2.5] text-brand-400" />
                  <span>Offer a Ride</span>
                </Link>
              </div>

              {/* Metrics */}
              <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center sm:text-left max-w-md mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">90%+</p>
                  <p className="text-xs text-slate-400 font-semibold">Route Match Score</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">Real-Time</p>
                  <p className="text-xs text-slate-400 font-semibold">GPS Telemetry</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">100%</p>
                  <p className="text-xs text-slate-400 font-semibold">Verified Users</p>
                </div>
              </div>

            </div>

            {/* Hero Right Visual Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-slate-900/90 border border-slate-800 rounded-container p-6 shadow-2xl backdrop-blur-xl">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse-live" />
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Active Route Monitor</p>
                      <p className="text-[11px] text-slate-400">Knowledge Park → Sec 62</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 text-xs font-bold">
                    92% Match
                  </span>
                </div>

                {/* Animated Route Line Map Visual */}
                <div className="relative h-48 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 mb-4 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

                  <svg className="w-full h-full relative z-10" viewBox="0 0 300 150">
                    {/* Animated Dash Route Line */}
                    <path
                      d="M 40 110 Q 150 20 260 110"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="4"
                      strokeDasharray="8 6"
                      className="animate-dash-route"
                    />
                    
                    <circle cx="40" cy="110" r="6" fill="#10b981" stroke="#fff" strokeWidth="2" />
                    <circle cx="260" cy="110" r="6" fill="#0284c7" stroke="#fff" strokeWidth="2" />
                    
                    {/* Driver Location Marker */}
                    <g transform="translate(145, 45)">
                      <circle r="12" fill="#ef4444" opacity="0.4" className="animate-ping" />
                      <circle r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                    </g>
                  </svg>

                  <div className="absolute bottom-3 left-3 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700 text-[11px] text-slate-300 font-semibold flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse-live" />
                    <span>Driver is 1.4 km away</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
                      alt="Driver"
                      className="w-10 h-10 rounded-full border border-brand-500 object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">Rahul (Driver)</p>
                      <p className="text-[11px] text-slate-400">⭐ 4.9 • Honda City</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-extrabold text-brand-400">₹90 <span className="text-[10px] text-slate-400 font-normal">/seat</span></p>
                    <p className="text-[11px] text-emerald-400 font-semibold">2 Seats Available</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold text-brand-400 uppercase tracking-widest">Simple & Reliable</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How SmartCarpool Works</h2>
            <p className="text-slate-400 text-sm">Three easy steps to connect, share rides, and split travel expenses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-950 p-8 rounded-container border border-slate-800 card-hover">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center font-black text-xl mb-6">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Publish or Search Ride</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Drivers list trip details and seats. Passengers search by pickup, dropoff, and time.
              </p>
            </div>

            <div className="bg-slate-950 p-8 rounded-container border border-slate-800 card-hover">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-black text-xl mb-6">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Algorithmic Matching</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our smart matching engine scores route overlap, pickup proximity, and schedule alignment.
              </p>
            </div>

            <div className="bg-slate-950 p-8 rounded-container border border-slate-800 card-hover">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black text-xl mb-6">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Track & Share Fare</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Join the carpool, track driver GPS in real time, and split travel cost fairly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why SmartCarpool Grid */}
      <section id="why-us" className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold text-sky-400 uppercase tracking-widest">Built for Campus & Daily Commuters</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Why SmartCarpool?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-card bg-slate-900 border border-slate-800 space-y-3 card-hover">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Smart Matching</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates route compatibility score based on pickup distance, destination proximity, and time window.
              </p>
            </div>

            <div className="p-6 rounded-card bg-slate-900 border border-slate-800 space-y-3 card-hover">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Real-Time GPS Telemetry</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Firebase Realtime Database updates driver location live for precise pickup ETAs.
              </p>
            </div>

            <div className="p-6 rounded-card bg-slate-900 border border-slate-800 space-y-3 card-hover">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Transparent Cost Sharing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fare per seat estimates make daily commuting affordable for students & professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
