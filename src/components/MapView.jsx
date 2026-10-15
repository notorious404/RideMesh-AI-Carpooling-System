import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript } from '../services/mapsService';
import { MapPin, Navigation, Radio, Compass } from 'lucide-react';

export default function MapView({
  sourceCoords = { lat: 28.4744, lng: 77.5040 },
  destCoords = { lat: 28.6273, lng: 77.3725 },
  driverCoords,
  isLiveTracking = false,
  height = "350px"
}) {
  const mapRef = useRef(null);
  const [googleMapLoaded, setGoogleMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    loadGoogleMapsScript()
      .then((googleMaps) => {
        if (!mapRef.current) return;
        setGoogleMapLoaded(true);

        const centerLat = (sourceCoords.lat + destCoords.lat) / 2;
        const centerLng = (sourceCoords.lng + destCoords.lng) / 2;

        const map = new googleMaps.Map(mapRef.current, {
          center: { lat: centerLat, lng: centerLng },
          zoom: 12,
          disableDefaultUI: false,
          zoomControl: true,
          styles: [
            {
              "featureType": "administrative",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#444444" }]
            },
            {
              "featureType": "landscape",
              "elementType": "all",
              "stylers": [{ "color": "#f2f2f2" }]
            },
            {
              "featureType": "poi",
              "elementType": "all",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "road",
              "elementType": "all",
              "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
            },
            {
              "featureType": "road.highway",
              "elementType": "all",
              "stylers": [{ "visibility": "simplified" }]
            },
            {
              "featureType": "water",
              "elementType": "all",
              "stylers": [{ "color": "#e0f2fe" }, { "visibility": "on" }]
            }
          ]
        });

        // Source Marker
        new googleMaps.Marker({
          position: sourceCoords,
          map,
          title: "Pickup Point",
          icon: {
            path: googleMaps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#10b981",
            fillOpacity: 1,
            strokeWeight: 3,
            strokeColor: "#ffffff"
          }
        });

        // Destination Marker
        new googleMaps.Marker({
          position: destCoords,
          map,
          title: "Destination",
          icon: {
            path: googleMaps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#0284c7",
            fillOpacity: 1,
            strokeWeight: 3,
            strokeColor: "#ffffff"
          }
        });

        // Driver Marker if live tracking
        if (driverCoords) {
          new googleMaps.Marker({
            position: driverCoords,
            map,
            title: "Driver Location",
            icon: {
              path: googleMaps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 6,
              fillColor: "#ef4444",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#ffffff",
              rotation: driverCoords.heading || 0
            }
          });
        }

        // Draw Polyline Route
        const routePath = new googleMaps.Polyline({
          path: [sourceCoords, driverCoords || sourceCoords, destCoords],
          geodesic: true,
          strokeColor: "#10b981",
          strokeOpacity: 0.8,
          strokeWeight: 4
        });
        routePath.setMap(map);

      })
      .catch((err) => {
        console.info("Using Interactive SVG Fallback Map (Google Maps API key pending)");
        setMapError(true);
      });
  }, [sourceCoords, destCoords, driverCoords]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-inner border border-slate-200 bg-slate-900" style={{ height }}>
      {/* Real Google Maps Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Fallback Interactive SVG Map if Google Maps script is not loaded */}
      {mapError && (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-4">
          
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* SVG Route Visualization */}
          <svg className="w-full h-full max-h-56 relative z-10" viewBox="0 0 400 200">
            {/* Curved Path */}
            <path
              d="M 50 140 Q 200 40 350 140"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
            {/* Polyline line */}
            <path
              d="M 50 140 Q 200 40 350 140"
              fill="none"
              stroke="#059669"
              strokeWidth="2"
            />

            {/* Pickup Node */}
            <g transform="translate(50, 140)">
              <circle r="12" fill="#10b981" opacity="0.3" className="animate-ping" />
              <circle r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="24" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">Pickup</text>
            </g>

            {/* Driver Node if live tracking */}
            {isLiveTracking && (
              <g transform="translate(190, 75)">
                <circle r="16" fill="#ef4444" opacity="0.4" className="animate-ping" />
                <circle r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="-14" fill="#ef4444" fontSize="10" textAnchor="middle" fontWeight="bold">Driver (Live)</text>
              </g>
            )}

            {/* Dropoff Node */}
            <g transform="translate(350, 140)">
              <circle r="12" fill="#0284c7" opacity="0.3" />
              <circle r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="24" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">Dropoff</text>
            </g>
          </svg>

          {/* Map Overlay Badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-xs font-semibold">
            {isLiveTracking ? (
              <>
                <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                <span>Live Route Monitor</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 text-brand-400" />
                <span>Smart Route Map</span>
              </>
            )}
          </div>

          <div className="absolute bottom-3 right-3 z-20 text-[10px] text-slate-400 bg-slate-900/80 px-2 py-1 rounded">
            Visual Map Engine Active
          </div>
        </div>
      )}
    </div>
  );
}
