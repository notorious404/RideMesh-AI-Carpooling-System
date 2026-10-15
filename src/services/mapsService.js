/**
 * SmartCarpool Maps & Geocoding Service
 * Integrates Google Maps JavaScript API with places autocomplete and directions.
 * Includes graceful fallback map generation when Google Maps API Key is pending.
 */

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

let googleMapsScriptPromise = null;

/**
 * Loads the Google Maps JS script dynamically
 */
export function loadGoogleMapsScript() {
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsScriptPromise) {
    return googleMapsScriptPromise;
  }

  if (!GOOGLE_MAPS_KEY || GOOGLE_MAPS_KEY === 'your_google_maps_api_key_here') {
    return Promise.reject(new Error("Google Maps API Key missing or placeholder."));
  }

  googleMapsScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = (err) => reject(new Error("Failed to load Google Maps script."));
    document.head.appendChild(script);
  });

  return googleMapsScriptPromise;
}

/**
 * Mock geocoding helper for common NCR / Indian college cities fallback
 */
const COMMON_LOCATIONS = {
  'greater noida': { lat: 28.4744, lng: 77.5040, address: 'Greater Noida, Uttar Pradesh' },
  'knowledge park': { lat: 28.4682, lng: 77.5097, address: 'Knowledge Park II, Greater Noida' },
  'noida sector 62': { lat: 28.6273, lng: 77.3725, address: 'Sector 62, Noida, Uttar Pradesh' },
  'connaught place': { lat: 28.6304, lng: 77.2177, address: 'Connaught Place, New Delhi' },
  'cyber city': { lat: 28.4950, lng: 77.0895, address: 'Cyber City, Gurugram, Haryana' },
  'indirapuram': { lat: 28.6415, lng: 77.3712, address: 'Indirapuram, Ghaziabad, Uttar Pradesh' }
};

export function searchLocationSuggestions(query) {
  if (!query || query.length < 2) return [];

  const q = query.toLowerCase();
  const matched = Object.keys(COMMON_LOCATIONS)
    .filter(key => key.includes(q) || COMMON_LOCATIONS[key].address.toLowerCase().includes(q))
    .map(key => COMMON_LOCATIONS[key]);

  if (matched.length > 0) return matched;

  // Generic coordinate generator for testing unlisted locations
  return [
    {
      address: `${query.charAt(0).toUpperCase() + query.slice(1)}, City Center`,
      lat: 28.5 + (query.length % 5) * 0.05,
      lng: 77.3 + (query.length % 7) * 0.04
    }
  ];
}
