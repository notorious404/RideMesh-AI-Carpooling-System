import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  IndianRupee, 
  Star, 
  Sparkles, 
  Navigation,
  CheckCircle2,
  Radio,
  Clock
} from 'lucide-react';

export default function RideCard({ ride, matchDetails, onJoin, isJoining }) {
  const matchPercent = matchDetails?.routeMatchPercent || ride.matchScore || 85;

  return (
    <div className="bg-white rounded-card border border-slate-200/80 shadow-soft hover:shadow-hover-card transition-all duration-200 ease-out hover:-translate-y-1 flex flex-col justify-between group overflow-hidden">
      
      {/* Card Header & Route Match Score */}
      <div className="p-5 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3.5">
          {/* Match Score Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>{matchPercent}% ROUTE MATCH</span>
          </div>

          {/* Status Indicator */}
          {ride.status === 'active' ? (
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200/60">
              <Radio className="w-3 h-3 text-red-600 animate-pulse-live" />
              <span>LIVE RIDE</span>
            </span>
          ) : ride.status === 'completed' ? (
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
              <CheckCircle2 className="w-3 h-3 text-slate-500" />
              <span>Completed</span>
            </span>
          ) : (
            <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{ride.departureTime}</span>
            </span>
          )}
        </div>

        {/* Visual Route Diagram */}
        <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 ml-1.5 my-1">
          {/* Pickup */}
          <div className="relative">
            <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pickup Point</p>
            <p className="text-sm font-bold text-slate-900 line-clamp-1">{ride.source}</p>
          </div>

          {/* Shared Route Overlap Representation */}
          <div className="text-[10px] font-semibold text-emerald-600 bg-emerald-50/80 px-2 py-0.5 rounded inline-block">
            Direct Route Match
          </div>

          {/* Dropoff */}
          <div className="relative pt-0.5">
            <span className="absolute -left-[21px] top-2 w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-white" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dropoff Destination</p>
            <p className="text-sm font-bold text-slate-900 line-clamp-1">{ride.destination}</p>
          </div>
        </div>
      </div>

      {/* Driver Metadata & Fare */}
      <div className="px-5 py-3.5 bg-slate-50/70 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <img
            src={ride.driverPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${ride.driverName || 'Driver'}`}
            alt={ride.driverName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
          />
          <div>
            <p className="text-xs font-bold text-slate-900">{ride.driverName}</p>
            <div className="flex items-center text-xs text-slate-500 font-medium space-x-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-700">{ride.driverRating || 4.8}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">{ride.vehicleInfo ? ride.vehicleInfo.split(' ')[0] : 'Sedan'}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end text-lg font-extrabold text-slate-900 tracking-tight">
            <IndianRupee className="w-4 h-4 text-slate-700 -mr-0.5" />
            <span>{ride.estimatedFare}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">per seat</span>
        </div>
      </div>

      {/* Footer & Action Button */}
      <div className="p-4 bg-white flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs text-slate-700 font-semibold bg-slate-100/90 px-2.5 py-1 rounded-lg">
          <Users className="w-3.5 h-3.5 text-emerald-600" />
          <span>{ride.availableSeats} {ride.availableSeats === 1 ? 'seat' : 'seats'} left</span>
        </div>

        <div>
          {ride.status === 'active' ? (
            <Link
              to={`/active-ride/${ride.id}`}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 btn-interaction flex items-center space-x-1.5 shadow-xs"
            >
              <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>Track Live</span>
            </Link>
          ) : (
            <Link
              to={`/ride/${ride.id}`}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 btn-interaction flex items-center space-x-1"
            >
              <span>View Ride</span>
              <Navigation className="w-3 h-3 ml-1" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
