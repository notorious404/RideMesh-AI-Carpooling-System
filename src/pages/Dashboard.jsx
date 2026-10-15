import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Footer from '../components/Footer';
import RideCard from '../components/RideCard';
import SustainabilityCard from '../components/SustainabilityCard';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import { getAvailableRides, getUserRides } from '../services/rideService';
import { matchAndRankRides } from '../services/matchingService';
import { 
  Search, 
  PlusCircle, 
  Car, 
  Clock, 
  MapPin, 
  Users, 
  IndianRupee, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Radio
} from 'lucide-react';

export default function Dashboard() {
  const { userProfile, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [upcomingRide, setUpcomingRide] = useState(null);
  const [suggestedRides, setSuggestedRides] = useState([]);
  const [completedCount, setCompletedCount] = useState(18);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const available = await getAvailableRides();
        
        if (currentUser) {
          const { driving, passenger } = await getUserRides(currentUser.uid);
          const allUserRides = [...driving, ...passenger];
          
          const nextRide = allUserRides.find(r => r.status === 'scheduled' || r.status === 'active');
          if (nextRide) {
            setUpcomingRide(nextRide);
          }

          const completed = allUserRides.filter(r => r.status === 'completed');
          setCompletedCount(Math.max(14, completed.length * 3 + 12));
        }

        const searchDefaults = {
          pickupCoordinates: { lat: 28.4744, lng: 77.5040 },
          destCoordinates: { lat: 28.6273, lng: 77.3725 }
        };

        const ranked = matchAndRankRides(
          available.filter(r => r.driverId !== currentUser?.uid),
          searchDefaults
        );
        setSuggestedRides(ranked.slice(0, 3));

      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [currentUser]);

  const firstName = userProfile?.name ? userProfile.name.split(' ')[0] : 'Commuter';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow animate-fade-in">
        
        {/* Header Greeting */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {getGreeting()}, <span className="text-brand-600">{firstName}</span> 👋
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Ready for your next shared journey?
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-xl border border-emerald-200/80 shadow-xs self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Peer Network</span>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          
          {/* Find Ride CTA */}
          <Link
            to="/find-ride"
            className="group relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-container shadow-card hover:shadow-hover-card btn-interaction border border-slate-700/80 flex items-center justify-between"
          >
            <div className="space-y-1 relative z-10">
              <span className="text-[11px] font-extrabold text-brand-400 uppercase tracking-widest">Passenger Mode</span>
              <h3 className="text-2xl font-extrabold text-white">Find a Ride</h3>
              <p className="text-xs text-slate-300">Search compatible carpools along your route</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-glow">
              <Search className="w-7 h-7 stroke-[2.5]" />
            </div>
          </Link>

          {/* Offer Ride CTA */}
          <Link
            to="/create-ride"
            className="group relative overflow-hidden bg-gradient-to-br from-brand-500 to-emerald-600 text-slate-950 p-6 rounded-container shadow-card hover:shadow-hover-card btn-interaction flex items-center justify-between"
          >
            <div className="space-y-1 relative z-10">
              <span className="text-[11px] font-extrabold text-slate-900/80 uppercase tracking-widest">Driver Mode</span>
              <h3 className="text-2xl font-extrabold text-slate-950">Offer a Ride</h3>
              <p className="text-xs text-slate-900/90 font-medium">Publish empty seats & split fuel cost</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-slate-950/20 text-slate-950 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-7 h-7 stroke-[2.5]" />
            </div>
          </Link>

        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-10">
            
            {/* Upcoming Ride Card */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-brand-600" />
                  <span>Upcoming Ride</span>
                </h2>
                {upcomingRide && (
                  <Link to="/my-rides" className="text-xs font-bold text-brand-600 hover:underline flex items-center">
                    <span>Manage Rides</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                )}
              </div>

              {upcomingRide ? (
                <div className="bg-white rounded-container p-6 border border-slate-200/80 shadow-soft relative overflow-hidden">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                        {upcomingRide.status === 'active' ? '🔴 Live Active Ride' : 'Scheduled Ride'}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {upcomingRide.departureTime} Departure
                      </span>
                    </div>

                    <Link
                      to={upcomingRide.status === 'active' ? `/active-ride/${upcomingRide.id}` : `/ride/${upcomingRide.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 btn-interaction"
                    >
                      {upcomingRide.status === 'active' ? 'Track Live GPS' : 'View Details'}
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-2 space-y-3">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Route Overview</p>
                          <p className="text-lg font-bold text-slate-900">{upcomingRide.source}</p>
                          <p className="text-xs font-bold text-brand-600 my-0.5">↓</p>
                          <p className="text-lg font-bold text-slate-900">{upcomingRide.destination}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600 font-semibold">
                        <span className="flex items-center space-x-1.5">
                          <Users className="w-4 h-4 text-slate-500" />
                          <span>Passengers:</span>
                        </span>
                        <span className="font-bold text-slate-900">
                          {upcomingRide.passengerDetails?.length || 1} participant(s)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600 font-semibold">
                        <span className="flex items-center space-x-1.5">
                          <IndianRupee className="w-4 h-4 text-slate-500" />
                          <span>Fare Share:</span>
                        </span>
                        <span className="font-bold text-emerald-600 text-sm">
                          ₹{upcomingRide.estimatedFare}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                /* Empty state */
                <div className="bg-white rounded-container p-8 border border-dashed border-slate-300 text-center space-y-3 shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                    <Car className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    "Your next shared journey starts here."
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You have no scheduled rides right now. Find a ride or offer empty seats to start carpooling.
                  </p>
                  <div className="pt-2 flex justify-center space-x-3">
                    <Link
                      to="/find-ride"
                      className="px-5 py-2.5 rounded-xl bg-brand-500 text-slate-950 font-extrabold text-xs shadow-glow hover:bg-brand-600 btn-interaction"
                    >
                      Find a Ride
                    </Link>
                  </div>
                </div>
              )}
            </section>

            {/* Sustainability Impact Section */}
            <section>
              <SustainabilityCard sharedRidesCount={completedCount} />
            </section>

            {/* Suggested Rides Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Suggested Compatible Rides</span>
                </h2>
                <Link to="/find-ride" className="text-xs font-bold text-brand-600 hover:underline">
                  View All Search Results
                </Link>
              </div>

              {suggestedRides.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {suggestedRides.map((ride) => (
                    <RideCard key={ride.id} ride={ride} matchDetails={ride.matchDetails} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No suggested rides available right now.</p>
              )}
            </section>

          </div>
        )}

      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
