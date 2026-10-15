import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Footer from '../components/Footer';
import MapView from '../components/MapView';
import LoadingSpinner from '../components/LoadingSpinner';
import { getRideById, joinRide, leaveRide, startRide } from '../services/rideService';
import { calculateMatchScore } from '../services/matchingService';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  IndianRupee, 
  Star, 
  Car, 
  Phone, 
  Radio, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Navigation
} from 'lucide-react';

export default function RideDetailsPage() {
  const { rideId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRide();
  }, [rideId]);

  const fetchRide = async () => {
    setLoading(true);
    try {
      const data = await getRideById(rideId);
      setRide(data);
    } catch (err) {
      console.error("Error loading ride:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen label="Loading trip specs..." />;

  if (!ride) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-container text-center shadow-soft">
          <h2 className="text-xl font-bold text-slate-900">Ride Not Found</h2>
          <p className="text-xs text-slate-500 my-3">The requested ride may have been cancelled or removed.</p>
          <Link to="/find-ride" className="inline-block px-5 py-2.5 rounded-control bg-brand-500 text-slate-950 font-extrabold text-xs">
            Back to Search
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isDriver = currentUser && currentUser.uid === ride.driverId;
  const isJoined = currentUser && ride.passengers && ride.passengers.includes(currentUser.uid);
  const matchInfo = calculateMatchScore(ride);

  const handleJoin = async () => {
    setActionLoading(true);
    try {
      await joinRide(rideId, currentUser, userProfile);
      addToast("Ride joined successfully! Added to your schedule.", "success");
      await fetchRide();
    } catch (err) {
      addToast(err.message || "Could not join ride.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    setActionLoading(true);
    try {
      await leaveRide(rideId, currentUser.uid);
      addToast("You have left this ride.", "info");
      await fetchRide();
    } catch (err) {
      addToast(err.message || "Could not leave ride.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartRide = async () => {
    setActionLoading(true);
    try {
      await startRide(rideId);
      addToast("Ride started! Real-time GPS broadcasting active.", "success");
      navigate(`/active-ride/${rideId}`);
    } catch (err) {
      addToast("Could not start ride.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow animate-fade-in">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-container p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                  <span>{matchInfo.routeMatchPercent}% MATCH SCORE</span>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  ride.status === 'active' ? 'bg-red-100 text-red-700 animate-pulse' :
                  ride.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                  'bg-brand-50 text-brand-700'
                }`}>
                  {ride.status}
                </span>
              </div>

              {/* Route */}
              <div className="space-y-4 relative pl-5 border-l-2 border-slate-200 ml-2 py-1">
                <div className="relative">
                  <span className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pickup Point</p>
                  <p className="text-lg font-bold text-slate-900">{ride.source}</p>
                </div>

                <div className="relative pt-2">
                  <span className="absolute -left-[27px] top-3.5 w-3.5 h-3.5 rounded-full bg-sky-500 ring-4 ring-white" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Destination</p>
                  <p className="text-lg font-bold text-slate-900">{ride.destination}</p>
                </div>
              </div>

              {/* Trip Grid */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <Calendar className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Date</p>
                  <p className="text-xs font-bold text-slate-800">{ride.departureDate || 'Today'}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl">
                  <Clock className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Time</p>
                  <p className="text-xs font-bold text-slate-800">{ride.departureTime}</p>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <IndianRupee className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Fare Share</p>
                  <p className="text-sm font-extrabold text-slate-900">₹{ride.estimatedFare}</p>
                </div>
              </div>

            </div>

            {/* Driver Profile */}
            <div className="bg-white rounded-container p-6 border border-slate-200/80 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Driver & Vehicle Details
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={ride.driverPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${ride.driverName}`}
                    alt={ride.driverName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500/40 shadow-xs"
                  />
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">{ride.driverName}</h4>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                      <span className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                        {ride.driverRating || 4.9}
                      </span>
                      <span>•</span>
                      <span>Verified Driver</span>
                    </div>
                  </div>
                </div>

                {ride.driverPhone && (
                  <a
                    href={`tel:${ride.driverPhone}`}
                    className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                    title="Call Driver"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                )}
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-3 text-xs">
                <Car className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="font-bold text-slate-800">{ride.vehicleInfo || 'White Sedan'}</p>
                  <p className="text-slate-500">Air-conditioned vehicle with luggage space</p>
                </div>
              </div>
            </div>

            {/* Passenger Roster */}
            <div className="bg-white rounded-container p-6 border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Joined Passengers</h3>
                <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                  {ride.availableSeats} of {ride.totalSeats || 4} seats available
                </span>
              </div>

              {ride.passengerDetails && ride.passengerDetails.length > 0 ? (
                <div className="space-y-3">
                  {ride.passengerDetails.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={p.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`}
                          alt={p.name}
                          className="w-8 h-8 rounded-full border border-slate-300"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{p.name}</p>
                          <p className="text-[10px] text-slate-400">Joined carpool</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Confirmed
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No passengers joined yet. Be the first!</p>
              )}
            </div>

          </div>

          {/* Right Map & Actions */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-container p-6 border border-slate-200/80 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-slate-900">Route Map Overview</h3>
              
              <MapView
                sourceCoords={ride.sourceCoordinates || { lat: 28.4744, lng: 77.5040 }}
                destCoords={ride.destinationCoordinates || { lat: 28.6273, lng: 77.3725 }}
                isLiveTracking={ride.status === 'active'}
                height="260px"
              />

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                {isDriver ? (
                  <div className="space-y-3">
                    {ride.status === 'scheduled' && (
                      <button
                        onClick={handleStartRide}
                        disabled={actionLoading}
                        className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-sm shadow-glow btn-interaction flex items-center justify-center space-x-2"
                      >
                        <Radio className="w-5 h-5 animate-pulse" />
                        <span>Start Ride & Enable GPS Tracking</span>
                      </button>
                    )}

                    {ride.status === 'active' && (
                      <Link
                        to={`/active-ride/${ride.id}`}
                        className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-md btn-interaction flex items-center justify-center space-x-2"
                      >
                        <Radio className="w-5 h-5 animate-pulse" />
                        <span>Open Live Tracking Console</span>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ride.status === 'active' ? (
                      <Link
                        to={`/active-ride/${ride.id}`}
                        className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-md btn-interaction flex items-center justify-center space-x-2"
                      >
                        <Radio className="w-5 h-5 animate-pulse" />
                        <span>Track Live GPS Location</span>
                      </Link>
                    ) : isJoined ? (
                      <button
                        onClick={handleLeave}
                        disabled={actionLoading}
                        className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs btn-interaction flex items-center justify-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Leave Ride</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleJoin}
                        disabled={actionLoading || ride.availableSeats <= 0}
                        className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-slate-950 font-extrabold text-sm shadow-glow btn-interaction disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{ride.availableSeats > 0 ? 'Join Carpool Ride' : 'Fully Booked'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
