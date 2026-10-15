import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Footer from '../components/Footer';
import MapView from '../components/MapView';
import SosModal from '../components/SosModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { getRideById, completeRide } from '../services/rideService';
import { 
  startLocationBroadcasting, 
  stopLocationBroadcasting, 
  subscribeToRideLocations 
} from '../services/locationService';
import { calculateHaversineDistance } from '../services/matchingService';
import { 
  Radio, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert, 
  Navigation,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function ActiveRidePage() {
  const { rideId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [driverLocation, setDriverLocation] = useState(null);
  const [distanceAwayKm, setDistanceAwayKm] = useState(1.4);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [completing, setCompleting] = useState(false);

  const isDriver = currentUser && ride && currentUser.uid === ride.driverId;

  useEffect(() => {
    async function initActiveRide() {
      setLoading(true);
      try {
        const rideData = await getRideById(rideId);
        setRide(rideData);

        if (!rideData) return;

        if (currentUser && currentUser.uid === rideData.driverId) {
          const success = startLocationBroadcasting(rideId, currentUser.uid, 5000);
          if (!success) {
            setLocationError("Browser geolocation unavailable or permission denied.");
          }
        }

        const unsubscribe = subscribeToRideLocations(rideId, (locations) => {
          if (locations) {
            const driverLoc = locations[rideData.driverId];
            if (driverLoc) {
              setDriverLocation({
                lat: driverLoc.latitude,
                lng: driverLoc.longitude,
                heading: driverLoc.heading || 0
              });

              const dist = calculateHaversineDistance(
                driverLoc.latitude,
                driverLoc.longitude,
                rideData.sourceCoordinates?.lat || 28.4744,
                rideData.sourceCoordinates?.lng || 77.5040
              );
              setDistanceAwayKm(parseFloat(dist.toFixed(1)));
            }
          }
        });

        return () => {
          if (unsubscribe) unsubscribe();
        };

      } catch (err) {
        console.error("Active ride error:", err);
      } finally {
        setLoading(false);
      }
    }

    initActiveRide();

    return () => {
      stopLocationBroadcasting();
    };
  }, [rideId, currentUser]);

  const handleCompleteRide = async () => {
    setCompleting(true);
    try {
      stopLocationBroadcasting();
      await completeRide(rideId);
      navigate('/ride-history');
    } catch (err) {
      console.error("Complete ride failed:", err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen label="Connecting to Realtime GPS Stream..." />;

  if (!ride) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-container text-center shadow-soft">
          <h2 className="text-xl font-bold text-slate-900">Active Ride Session Expired</h2>
          <p className="text-xs text-slate-500 my-3">This ride is no longer in active tracking state.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const etaMinutes = Math.round(distanceAwayKm * 2.5 + 2);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-brand-500 selection:text-slate-950">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow animate-fade-in">
        
        {/* Live Status Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-container backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse-live" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold text-red-400 uppercase tracking-widest">LIVE TRACKING ACTIVE</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-semibold text-slate-300">
                  {isDriver ? 'Broadcasting Location' : 'Passenger View'}
                </span>
              </div>
              <p className="text-sm font-bold text-white mt-0.5">
                Driver is currently {distanceAwayKm} km away • ETA ~{etaMinutes} min
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSosOpen(true)}
              className="px-4 py-2 rounded-control bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/40 text-xs font-extrabold transition-all btn-interaction flex items-center space-x-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>SOS / Emergency</span>
            </button>

            {isDriver && (
              <button
                onClick={handleCompleteRide}
                disabled={completing}
                className="px-5 py-2.5 rounded-control bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-glow btn-interaction disabled:opacity-50 flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{completing ? 'Completing...' : 'Complete Ride'}</span>
              </button>
            )}
          </div>
        </div>

        {locationError && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{locationError}</span>
          </div>
        )}

        {/* Map Display */}
        <div className="mb-8 rounded-container overflow-hidden border border-slate-800 shadow-2xl relative">
          <MapView
            sourceCoords={ride.sourceCoordinates || { lat: 28.4744, lng: 77.5040 }}
            destCoords={ride.destinationCoordinates || { lat: 28.6273, lng: 77.3725 }}
            driverCoords={driverLocation || ride.sourceCoordinates}
            isLiveTracking={true}
            height="440px"
          />

          {/* Floating Live Overlay Card */}
          <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-4 rounded-card text-white max-w-xs shadow-2xl space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
              <Radio className="w-4 h-4 text-red-500 animate-pulse-live" />
              <span>Active GPS Telemetry</span>
            </div>
            <p className="text-sm font-extrabold truncate">{ride.source} → {ride.destination}</p>
            <p className="text-[11px] text-slate-400">Updating live every 5s</p>
          </div>
        </div>

        {/* Live Trip Roster */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-container p-6 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Driver Specification</h3>
            <div className="flex items-center space-x-3">
              <img
                src={ride.driverPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${ride.driverName}`}
                alt={ride.driverName}
                className="w-12 h-12 rounded-full border-2 border-brand-500"
              />
              <div>
                <p className="font-extrabold text-white text-base">{ride.driverName}</p>
                <p className="text-xs text-slate-400">{ride.vehicleInfo || 'White Honda City'}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-container p-6 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Route Roster</h3>
            <div className="text-xs space-y-1">
              <p className="text-slate-300 font-semibold">From: <span className="text-white font-bold">{ride.source}</span></p>
              <p className="text-slate-300 font-semibold">To: <span className="text-white font-bold">{ride.destination}</span></p>
              <p className="text-slate-400">Total Participants: {ride.passengerDetails?.length || 1}</p>
            </div>
          </div>
        </div>

      </main>

      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        rideDetails={ride}
      />

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
