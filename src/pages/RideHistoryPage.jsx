import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { getUserRides } from '../services/rideService';
import { 
  Clock, 
  MapPin, 
  Users, 
  IndianRupee, 
  CheckCircle2, 
  Calendar,
  Car,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RideHistoryPage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [historyRides, setHistoryRides] = useState([]);

  useEffect(() => {
    async function loadHistory() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const { driving, passenger } = await getUserRides(currentUser.uid);
        const combined = [...driving, ...passenger];
        const completed = combined.filter(r => r.status === 'completed' || r.status === 'cancelled');
        setHistoryRides(completed);
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
            <Clock className="w-4 h-4" />
            <span>Trip History Log</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Completed Ride History</h1>
          <p className="text-slate-500 text-sm mt-1">Review past carpool trips, participants, and expense breakdowns.</p>
        </div>

        {loading ? (
          <LoadingSpinner label="Fetching ride history..." />
        ) : historyRides.length > 0 ? (
          <div className="space-y-4">
            {historyRides.map((ride) => (
              <div
                key={ride.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                
                {/* Left Route & Driver Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                      <span className="capitalize">{ride.status}</span>
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{ride.departureDate || 'Completed Trip'}</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-base font-extrabold text-slate-900">
                      {ride.source} <span className="text-brand-600 font-bold mx-1">→</span> {ride.destination}
                    </p>
                    <p className="text-xs text-slate-500">
                      Driver: <span className="font-semibold text-slate-800">{ride.driverName}</span> • Vehicle: {ride.vehicleInfo || 'Sedan'}
                    </p>
                  </div>
                </div>

                {/* Right Participant & Fare Breakdown */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  
                  <div className="text-right">
                    <div className="flex items-center justify-end text-lg font-extrabold text-slate-900">
                      <IndianRupee className="w-4 h-4 text-slate-600" />
                      <span>{ride.estimatedFare}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Shared Cost</span>
                  </div>

                  <Link
                    to={`/ride/${ride.id}`}
                    className="p-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>

                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No completed rides yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Once you complete your first shared ride, it will appear here with full trip metrics.
            </p>
          </div>
        )}

      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
