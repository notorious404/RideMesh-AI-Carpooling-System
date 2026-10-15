import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Footer from '../components/Footer';
import LocationAutocompleteInput from '../components/LocationAutocompleteInput';
import MapView from '../components/MapView';
import { createRide } from '../services/rideService';
import { calculateHaversineDistance } from '../services/matchingService';
import { 
  PlusCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  IndianRupee, 
  Car, 
  AlertCircle,
  Navigation,
  Sparkles
} from 'lucide-react';

export default function CreateRidePage() {
  const { currentUser, userProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [source, setSource] = useState('Greater Noida Knowledge Park II');
  const [sourceCoords, setSourceCoords] = useState({ lat: 28.4682, lng: 77.5097 });

  const [destination, setDestination] = useState('Noida Sector 62, Electronic City');
  const [destCoords, setDestCoords] = useState({ lat: 28.6273, lng: 77.3725 });

  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [departureTime, setDepartureTime] = useState('08:30');
  const [availableSeats, setAvailableSeats] = useState(3);
  const [estimatedFare, setEstimatedFare] = useState(90);
  const [vehicleInfo, setVehicleInfo] = useState('White Honda City (UP16-AB-8821)');

  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);

  const distanceKm = calculateHaversineDistance(
    sourceCoords.lat,
    sourceCoords.lng,
    destCoords.lat,
    destCoords.lng
  ).toFixed(1);

  const durationMin = Math.round(distanceKm * 2.2 + 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!source || !destination) {
      return setError("Please provide both starting location and destination.");
    }

    if (availableSeats <= 0) {
      return setError("Available seats must be at least 1.");
    }

    if (estimatedFare <= 0) {
      return setError("Please specify a valid estimated fare per seat.");
    }

    setPublishing(true);

    try {
      const rideData = {
        source,
        destination,
        sourceCoordinates: sourceCoords,
        destinationCoordinates: destCoords,
        departureDate,
        departureTime,
        availableSeats,
        estimatedFare,
        vehicleInfo
      };

      const published = await createRide(rideData, currentUser, userProfile);
      addToast("Ride published successfully! Ready for passenger bookings.", "success");
      navigate(`/ride/${published.id}`);
    } catch (err) {
      setError(err.message || "Failed to publish ride. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow animate-fade-in">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">
            <PlusCircle className="w-4 h-4" />
            <span>Driver Mode</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Offer a Carpool Ride</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Publish your commute route, set available seats, and split travel expenses.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Left Side */}
          <div className="lg:col-span-7 bg-white rounded-container p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
            
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>1. Journey & Route</span>
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </h2>

            <LocationAutocompleteInput
              label="Starting Location (Pickup)"
              placeholder="e.g. Greater Noida Knowledge Park II"
              value={source}
              onChange={setSource}
              onSelectLocation={(loc) => {
                setSource(loc.address);
                setSourceCoords(loc.coordinates);
              }}
              required
            />

            <LocationAutocompleteInput
              label="Destination (Dropoff)"
              placeholder="e.g. Noida Sector 62"
              value={destination}
              onChange={setDestination}
              onSelectLocation={(loc) => {
                setDestination(loc.address);
                setDestCoords(loc.coordinates);
              }}
              icon={Navigation}
              required
            />

            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 pt-2">
              2. Schedule & Departure
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Departure Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-control text-slate-900 text-sm focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Departure Time *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="time"
                    required
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-control text-slate-900 text-sm focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 pt-2">
              3. Seats & Fare Estimate
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Available Seats *
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <select
                    value={availableSeats}
                    onChange={(e) => setAvailableSeats(parseInt(e.target.value, 10))}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-control text-slate-900 text-sm focus:outline-none focus:border-brand-500 font-medium"
                  >
                    <option value={1}>1 seat</option>
                    <option value={2}>2 seats</option>
                    <option value={3}>3 seats</option>
                    <option value={4}>4 seats</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Estimated Fare / Seat (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="number"
                    min="10"
                    max="2000"
                    required
                    value={estimatedFare}
                    onChange={(e) => setEstimatedFare(e.target.value)}
                    placeholder="90"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-control text-slate-900 text-sm focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Vehicle Details
              </label>
              <div className="relative">
                <Car className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={vehicleInfo}
                  onChange={(e) => setVehicleInfo(e.target.value)}
                  placeholder="e.g. White Honda City UP16-AB-8821"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-control text-slate-900 text-sm focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={publishing}
              className="w-full py-4 rounded-container bg-brand-500 hover:bg-brand-600 text-slate-950 font-extrabold text-base shadow-glow btn-interaction flex items-center justify-center space-x-2"
            >
              <span>{publishing ? 'Publishing Ride...' : 'Publish Ride'}</span>
            </button>

          </div>

          {/* Right Map Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-container p-6 border border-slate-200/80 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>Interactive Route Preview</span>
              </h3>

              <MapView
                sourceCoords={sourceCoords}
                destCoords={destCoords}
                height="280px"
              />

              <div className="grid grid-cols-2 gap-3 pt-2 text-center">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Approx Distance</p>
                  <p className="text-lg font-extrabold text-slate-900">{distanceKm} km</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Estimated Duration</p>
                  <p className="text-lg font-extrabold text-slate-900">~{durationMin} mins</p>
                </div>
              </div>
            </div>
          </div>

        </form>

      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
