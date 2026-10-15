import { ref, set, onValue, off } from 'firebase/database';
import { rtdb, isFirebaseConfigured } from '../firebase/config';

// In-memory active watch ID & interval reference
let watchId = null;
let broadcastIntervalId = null;
let lastLocation = null;

// Local fallback state broadcast for testing when Firebase RTDB is unconfigured
const mockLocationListeners = new Map();

/**
 * Check if browser supports Geolocation API
 */
export function isGeolocationSupported() {
  return 'geolocation' in navigator;
}

/**
 * Get current single location fix
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading || 0,
          speed: position.coords.speed || 0,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      (error) => {
        let msg = "Failed to retrieve location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = "Location permission denied. Please allow location access to track active rides.";
            break;
          case error.POSITION_UNAVAILABLE:
            msg = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            msg = "The request to get user location timed out.";
            break;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000
      }
    );
  });
}

/**
 * Start live location tracking and broadcast to Firebase Realtime Database
 * Throttled to every 5-8 seconds to prevent excessive writes.
 * 
 * Path: activeRides/{rideId}/locations/{userId}
 */
export function startLocationBroadcasting(rideId, userId, updateIntervalMs = 5000) {
  stopLocationBroadcasting(); // Clear existing

  if (!isGeolocationSupported()) {
    console.warn("Geolocation API not supported.");
    return false;
  }

  // Initial location fetch
  getCurrentLocation()
    .then(loc => {
      lastLocation = loc;
      publishLocationToRTDB(rideId, userId, loc);
    })
    .catch(err => console.warn("Initial location fix failed:", err.message));

  // Continuous watch
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      lastLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        heading: position.coords.heading || 0,
        speed: position.coords.speed || 0,
        timestamp: position.timestamp
      };
    },
    (err) => console.warn("Watch position error:", err.message),
    {
      enableHighAccuracy: true,
      maximumAge: 4000,
      timeout: 10000
    }
  );

  // Throttled Periodic Broadcast to RTDB
  broadcastIntervalId = setInterval(() => {
    if (lastLocation) {
      publishLocationToRTDB(rideId, userId, lastLocation);
    }
  }, updateIntervalMs);

  return true;
}

/**
 * Write location object to Firebase RTDB or local fallback listener
 */
function publishLocationToRTDB(rideId, userId, loc) {
  if (isFirebaseConfigured && rtdb) {
    try {
      const locRef = ref(rtdb, `activeRides/${rideId}/locations/${userId}`);
      set(locRef, {
        latitude: loc.latitude,
        longitude: loc.longitude,
        heading: loc.heading || 0,
        speed: loc.speed || 0,
        updatedAt: new Date().toISOString(),
        timestamp: Date.now()
      });
    } catch (err) {
      console.warn("RTDB location write error:", err);
    }
  }

  // Trigger local listener if any
  const listeners = mockLocationListeners.get(rideId) || [];
  listeners.forEach(cb => cb(userId, loc));
}

/**
 * Stop live location tracking and clean up listeners
 */
export function stopLocationBroadcasting() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  if (broadcastIntervalId !== null) {
    clearInterval(broadcastIntervalId);
    broadcastIntervalId = null;
  }
  lastLocation = null;
}

/**
 * Listen to real-time location updates for a specific ride
 * 
 * @param {string} rideId 
 * @param {function} callback - Called with snapshot of all user locations in the ride
 */
export function subscribeToRideLocations(rideId, callback) {
  if (isFirebaseConfigured && rtdb) {
    try {
      const locationsRef = ref(rtdb, `activeRides/${rideId}/locations`);
      const listener = onValue(locationsRef, (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val());
        } else {
          callback(null);
        }
      });

      return () => off(locationsRef, 'value', listener);
    } catch (err) {
      console.warn("RTDB subscribe failed, fallback to local:", err);
    }
  }

  // Local fallback mock subscription
  if (!mockLocationListeners.has(rideId)) {
    mockLocationListeners.set(rideId, []);
  }
  
  const mockCb = (userId, loc) => {
    callback({
      [userId]: {
        latitude: loc.latitude,
        longitude: loc.longitude,
        updatedAt: new Date().toISOString()
      }
    });
  };

  mockLocationListeners.get(rideId).push(mockCb);

  return () => {
    const list = mockLocationListeners.get(rideId) || [];
    mockLocationListeners.set(rideId, list.filter(cb => cb !== mockCb));
  };
}
