import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Footer from '../components/Footer';
import LocationAutocompleteInput from '../components/LocationAutocompleteInput';
import RideCard from '../components/RideCard';
import { RideCardSkeleton } from '../components/SkeletonLoader';
import { getAvailableRides } from '../services/rideService';
import { matchAndRankRides } from '../services/matchingService';
import { 
  Search, 
  Navigation, 
  Calendar, 
  Clock, 
  Sparkles, 
  SlidersHorizontal,
  Car
} from 'lucide-react';

export default function FindRidePage() {
  const [pickup, setPickup] = useState('Greater Noida');
  const [pickupCoords, setPickupCoords] = useState({ lat: 28.4744, lng: 77.5040 });

  const [destination, setDestination] = useState('Noida Sector 62');
  const [destCoords, setDestCoords] = useState({ lat: 28.6273, lng: 77.3725 });

  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [preferredTime, setPreferredTime] = useState('08:30');

  const [loading, setLoading] = useState(false);
  const [matchingRides, setMatchingRides] = useState([]);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const allRides = await getAvailableRides();

      const searchParams = {
        pickupCoordinates: pickupCoords,
        destCoordinates: destCoords,
        preferredTime: preferredTime,
        travelDate: travelDate
      };

      const ranked = matchAndRankRides(allRides, searchParams);
      setMatchingRides(ranked);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow animate-fade-in">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">
            <Search className="w-4 h-4" />
            <span>Passenger Search</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Find Compatible Carpool Rides</h1>
          <p className="text-slate-500 text-sm mt-1">Search rides with algorithmic route overlap and schedule matching.</p>
        </div>

        {/* Search Panel Card */}
        <div className="bg-white rounded-container p-6 sm:p-8 border border-slate-200/80 shadow-soft mb-10">
          <form onSubmit={handleSearch} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LocationAutocompleteInput
                label="Pickup Location"
                placeholder="Where are you starting from?"
                value={pickup}
                onChange={setPickup}
                onSelectLocation={(loc) => {
                  setPickup(loc.address);
                  setPickupCoords(loc.coordinates);
                }}
              />

              <LocationAutocompleteInput
                label="Destination"
                placeholder="Where are you heading?"
                value={destination}
                onChange={setDestination}
                onSelectLocation={(loc) => {
                  setDestination(loc.address);
                  setDestCoords(loc.coordinates);
                }}
                icon={Navigation}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-control text-slate-900 text-sm focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Preferred Time
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-control text-slate-900 text-sm focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-control bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md btn-interaction flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4 text-brand-400" />
                <span>{loading ? 'Searching Engine...' : 'Search Rides'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Results Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <span>Compatible Rides ({matchingRides.length})</span>
            </h2>
            <div className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Ranked by Algorithmic Match Score</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RideCardSkeleton />
              <RideCardSkeleton />
              <RideCardSkeleton />
            </div>
          ) : matchingRides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingRides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  matchDetails={ride.matchDetails}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-container p-12 text-center border border-dashed border-slate-300 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No compatible rides found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your departure time or destination parameters as drivers publish new trips.
              </p>
            </div>
          )}
        </div>

      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
