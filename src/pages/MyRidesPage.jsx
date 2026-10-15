import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Footer from '../components/Footer';
import RideCard from '../components/RideCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getUserRides } from '../services/rideService';
import { Car, Navigation, CheckCircle2, Clock } from 'lucide-react';

export default function MyRidesPage() {
  const { currentUser } = useAuth();
  const [tab, setTab] = useState('driving'); // driving | passenger
  const [loading, setLoading] = useState(true);
  const [drivingRides, setDrivingRides] = useState([]);
  const [passengerRides, setPassengerRides] = useState([]);

  useEffect(() => {
    async function loadUserRides() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const { driving, passenger } = await getUserRides(currentUser.uid);
        setDrivingRides(driving);
        setPassengerRides(passenger);
      } catch (err) {
        console.error("Error loading user rides:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserRides();
  }, [currentUser]);

  const displayedRides = tab === 'driving' ? drivingRides : passengerRides;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Carpool Rides</h1>
          <p className="text-slate-500 text-sm mt-1">Manage rides you are offering or participating in.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 mb-8 space-x-6">
          <button
            onClick={() => setTab('driving')}
            className={`pb-3 text-sm font-bold transition-all relative flex items-center space-x-2 ${
              tab === 'driving' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Rides I'm Driving ({drivingRides.length})</span>
            {tab === 'driving' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />}
          </button>

          <button
            onClick={() => setTab('passenger')}
            className={`pb-3 text-sm font-bold transition-all relative flex items-center space-x-2 ${
              tab === 'passenger' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Rides I'm Joined In ({passengerRides.length})</span>
            {tab === 'passenger' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />}
          </button>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading your ride records..." />
        ) : displayedRides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
            <Car className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              No rides in this category
            </h3>
            <p className="text-xs text-slate-500">
              {tab === 'driving'
                ? "You haven't created any rides to offer yet."
                : "You haven't joined any active carpool rides."}
            </p>
          </div>
        )}

      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
