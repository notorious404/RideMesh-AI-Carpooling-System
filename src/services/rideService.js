import { 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

// Local storage fallback key
const MOCK_RIDES_KEY = 'smartcarpool_rides_db';

// Initial realistic demo rides
const INITIAL_DEMO_RIDES = [
  {
    id: 'ride_demo_101',
    driverId: 'driver_rahul_1',
    driverName: 'Rahul Sharma',
    driverRating: 4.9,
    driverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    driverPhone: '+91 98765 12345',
    vehicleInfo: 'White Honda City (UP16-AB-8821)',
    source: 'Greater Noida Knowledge Park II',
    destination: 'Noida Sector 62, Electronic City',
    sourceCoordinates: { lat: 28.4682, lng: 77.5097 },
    destinationCoordinates: { lat: 28.6273, lng: 77.3725 },
    departureDate: new Date(Date.now() + 3600000).toISOString().split('T')[0],
    departureTime: '08:30',
    availableSeats: 3,
    totalSeats: 4,
    estimatedFare: 90,
    status: 'scheduled',
    passengers: [],
    passengerDetails: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ride_demo_102',
    driverId: 'driver_priya_2',
    driverName: 'Priya Verma',
    driverRating: 4.8,
    driverPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    driverPhone: '+91 98112 34567',
    vehicleInfo: 'Red Hyundai i20 (DL3C-XY-4490)',
    source: 'Pari Chowk, Greater Noida',
    destination: 'Connaught Place, New Delhi',
    sourceCoordinates: { lat: 28.4744, lng: 77.5040 },
    destinationCoordinates: { lat: 28.6304, lng: 77.2177 },
    departureDate: new Date(Date.now() + 7200000).toISOString().split('T')[0],
    departureTime: '09:15',
    availableSeats: 2,
    totalSeats: 3,
    estimatedFare: 140,
    status: 'scheduled',
    passengers: [],
    passengerDetails: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ride_demo_103',
    driverId: 'driver_amit_3',
    driverName: 'Amit Patel',
    driverRating: 4.7,
    driverPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    driverPhone: '+91 99001 22334',
    vehicleInfo: 'Grey Maruti Swift (UP14-EV-9012)',
    source: 'Indirapuram, Ghaziabad',
    destination: 'Cyber City, Gurugram',
    sourceCoordinates: { lat: 28.6415, lng: 77.3712 },
    destinationCoordinates: { lat: 28.4950, lng: 77.0895 },
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '07:45',
    availableSeats: 1,
    totalSeats: 3,
    estimatedFare: 180,
    status: 'scheduled',
    passengers: [],
    passengerDetails: [],
    createdAt: new Date().toISOString()
  }
];

// Initialize local storage demo store if empty
function getLocalRides() {
  const local = localStorage.getItem(MOCK_RIDES_KEY);
  if (!local) {
    localStorage.setItem(MOCK_RIDES_KEY, JSON.stringify(INITIAL_DEMO_RIDES));
    return INITIAL_DEMO_RIDES;
  }
  return JSON.parse(local);
}

function saveLocalRides(rides) {
  localStorage.setItem(MOCK_RIDES_KEY, JSON.stringify(rides));
}

/**
 * Publish a new ride to Firestore
 */
export async function createRide(rideData, currentUser, userProfile) {
  const newRide = {
    driverId: currentUser.uid,
    driverName: userProfile?.name || currentUser.displayName || 'Driver',
    driverPhoto: userProfile?.profileImage || '',
    driverRating: userProfile?.rating || 4.9,
    driverPhone: userProfile?.phone || '',
    vehicleInfo: rideData.vehicleInfo || 'Sedan / Hatchback',
    source: rideData.source,
    destination: rideData.destination,
    sourceCoordinates: rideData.sourceCoordinates || { lat: 28.4744, lng: 77.5040 },
    destinationCoordinates: rideData.destinationCoordinates || { lat: 28.6273, lng: 77.3725 },
    departureDate: rideData.departureDate,
    departureTime: rideData.departureTime,
    availableSeats: parseInt(rideData.availableSeats, 10),
    totalSeats: parseInt(rideData.availableSeats, 10),
    estimatedFare: parseFloat(rideData.estimatedFare),
    status: 'scheduled', // scheduled, active, completed, cancelled
    passengers: [],
    passengerDetails: [],
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'rides'), {
        ...newRide,
        createdAtServer: serverTimestamp()
      });
      return { id: docRef.id, ...newRide };
    } catch (err) {
      console.warn("Firestore save failed, saving locally:", err);
    }
  }

  // Fallback save locally
  const rides = getLocalRides();
  const id = 'ride_local_' + Date.now();
  const savedRide = { id, ...newRide };
  rides.unshift(savedRide);
  saveLocalRides(rides);
  return savedRide;
}

/**
 * Fetch all available rides (scheduled & seats > 0)
 */
export async function getAvailableRides() {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'rides'),
        where('status', 'in', ['scheduled', 'active']),
        orderBy('createdAtServer', 'desc')
      );
      const snapshot = await getDocs(q);
      const rides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (rides.length > 0) return rides;
    } catch (err) {
      console.warn("Firestore fetch error, reading local fallback:", err);
    }
  }

  return getLocalRides().filter(r => r.status === 'scheduled' || r.status === 'active');
}

/**
 * Fetch details of a single ride by ID
 */
export async function getRideById(rideId) {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'rides', rideId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (err) {
      console.warn("Firestore single fetch failed:", err);
    }
  }

  const rides = getLocalRides();
  return rides.find(r => r.id === rideId) || null;
}

/**
 * Join a ride as a passenger
 */
export async function joinRide(rideId, passengerUser, passengerProfile) {
  const passengerInfo = {
    uid: passengerUser.uid,
    name: passengerProfile?.name || 'Passenger',
    email: passengerUser.email || '',
    phone: passengerProfile?.phone || '',
    photo: passengerProfile?.profileImage || '',
    joinedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const rideRef = doc(db, 'rides', rideId);
      const rideSnap = await getDoc(rideRef);

      if (rideSnap.exists()) {
        const rideData = rideSnap.data();
        if (rideData.availableSeats <= 0) {
          throw new Error("Sorry, this ride is already fully booked.");
        }
        if (rideData.passengers && rideData.passengers.includes(passengerUser.uid)) {
          throw new Error("You have already joined this ride.");
        }

        await updateDoc(rideRef, {
          availableSeats: rideData.availableSeats - 1,
          passengers: arrayUnion(passengerUser.uid),
          passengerDetails: arrayUnion(passengerInfo)
        });

        // Also create record in bookings collection
        await addDoc(collection(db, 'bookings'), {
          rideId,
          passengerId: passengerUser.uid,
          driverId: rideData.driverId,
          status: 'confirmed',
          createdAt: serverTimestamp()
        });

        return true;
      }
    } catch (err) {
      if (err.message.includes("fully booked") || err.message.includes("already joined")) {
        throw err;
      }
      console.warn("Firestore join ride failed, falling back locally:", err);
    }
  }

  // Local fallback
  const rides = getLocalRides();
  const index = rides.findIndex(r => r.id === rideId);
  if (index !== -1) {
    const r = rides[index];
    if (r.availableSeats <= 0) throw new Error("Sorry, this ride is already fully booked.");
    if (r.passengers && r.passengers.includes(passengerUser.uid)) {
      throw new Error("You have already joined this ride.");
    }
    r.availableSeats = Math.max(0, r.availableSeats - 1);
    r.passengers = r.passengers || [];
    r.passengerDetails = r.passengerDetails || [];
    r.passengers.push(passengerUser.uid);
    r.passengerDetails.push(passengerInfo);
    rides[index] = r;
    saveLocalRides(rides);
    return true;
  }
  throw new Error("Ride not found.");
}

/**
 * Leave a joined ride
 */
export async function leaveRide(rideId, passengerUid) {
  if (isFirebaseConfigured && db) {
    try {
      const rideRef = doc(db, 'rides', rideId);
      const rideSnap = await getDoc(rideRef);
      if (rideSnap.exists()) {
        const rideData = rideSnap.data();
        const updatedDetails = (rideData.passengerDetails || []).filter(p => p.uid !== passengerUid);
        await updateDoc(rideRef, {
          availableSeats: Math.min(rideData.totalSeats || 4, rideData.availableSeats + 1),
          passengers: arrayRemove(passengerUid),
          passengerDetails: updatedDetails
        });
        return true;
      }
    } catch (err) {
      console.warn("Firestore leave error, falling back locally:", err);
    }
  }

  const rides = getLocalRides();
  const index = rides.findIndex(r => r.id === rideId);
  if (index !== -1) {
    const r = rides[index];
    r.availableSeats = Math.min(r.totalSeats || 4, r.availableSeats + 1);
    r.passengers = (r.passengers || []).filter(id => id !== passengerUid);
    r.passengerDetails = (r.passengerDetails || []).filter(p => p.uid !== passengerUid);
    rides[index] = r;
    saveLocalRides(rides);
    return true;
  }
  return false;
}

/**
 * Start a ride (driver action)
 */
export async function startRide(rideId) {
  if (isFirebaseConfigured && db) {
    try {
      const rideRef = doc(db, 'rides', rideId);
      await updateDoc(rideRef, {
        status: 'active',
        startedAt: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.warn("Firestore start ride error:", err);
    }
  }

  const rides = getLocalRides();
  const index = rides.findIndex(r => r.id === rideId);
  if (index !== -1) {
    rides[index].status = 'active';
    rides[index].startedAt = new Date().toISOString();
    saveLocalRides(rides);
    return true;
  }
  return false;
}

/**
 * Complete a ride (driver action)
 */
export async function completeRide(rideId) {
  if (isFirebaseConfigured && db) {
    try {
      const rideRef = doc(db, 'rides', rideId);
      await updateDoc(rideRef, {
        status: 'completed',
        completedAt: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.warn("Firestore complete ride error:", err);
    }
  }

  const rides = getLocalRides();
  const index = rides.findIndex(r => r.id === rideId);
  if (index !== -1) {
    rides[index].status = 'completed';
    rides[index].completedAt = new Date().toISOString();
    saveLocalRides(rides);
    return true;
  }
  return false;
}

/**
 * Fetch user's rides (driving or passenger)
 */
export async function getUserRides(userUid) {
  if (isFirebaseConfigured && db) {
    try {
      const qDriver = query(collection(db, 'rides'), where('driverId', '==', userUid));
      const snapDriver = await getDocs(qDriver);
      const driving = snapDriver.docs.map(d => ({ id: d.id, ...d.data() }));

      const qPassenger = query(collection(db, 'rides'), where('passengers', 'array-contains', userUid));
      const snapPassenger = await getDocs(qPassenger);
      const passenger = snapPassenger.docs.map(d => ({ id: d.id, ...d.data() }));

      return { driving, passenger };
    } catch (err) {
      console.warn("Firestore user rides query failed, returning local fallback:", err);
    }
  }

  const rides = getLocalRides();
  const driving = rides.filter(r => r.driverId === userUid);
  const passenger = rides.filter(r => r.passengers && r.passengers.includes(userUid));
  return { driving, passenger };
}
