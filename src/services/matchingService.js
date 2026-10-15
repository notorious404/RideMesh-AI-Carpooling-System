/**
 * SmartCarpool - Intelligent Matching Service
 * 
 * Reusable modular matching engine.
 * Calculates compatibility scores between passenger search parameters and available driver rides.
 * Can easily be upgraded in future phases to incorporate machine learning or complex graph routing.
 */

// Earth radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Calculates Haversine distance between two sets of geographic coordinates (lat/lng) in kilometers.
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Computes proximity score (0 to 1) based on distance in kilometers.
 * Distance <= 1km returns ~1.0 score, decaying to 0 at maxDistanceKm (default 25km).
 */
export function getProximityScore(distanceKm, maxDistanceKm = 25) {
  if (distanceKm <= 0) return 1.0;
  if (distanceKm >= maxDistanceKm) return 0.0;
  return Math.max(0, 1 - (distanceKm / maxDistanceKm));
}

/**
 * Computes time compatibility score (0 to 1) between ride departure time and preferred time.
 * Accepts ISO time strings, HH:MM strings, or Date objects.
 */
export function getTimeCompatibilityScore(rideDepartureTime, preferredTime) {
  if (!rideDepartureTime || !preferredTime) return 0.8; // Default neutral score if unspecified

  try {
    const parseTimeToMinutes = (val) => {
      if (typeof val === 'string' && val.includes(':')) {
        const parts = val.split('T').pop().split(':');
        return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      }
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return d.getHours() * 60 + d.getMinutes();
      }
      return 0;
    };

    const rideMinutes = parseTimeToMinutes(rideDepartureTime);
    const prefMinutes = parseTimeToMinutes(preferredTime);

    const diffMinutes = Math.abs(rideMinutes - prefMinutes);

    // 0 min diff => 1.0 score, 120 min diff => 0 score
    if (diffMinutes >= 120) return 0.0;
    return Math.max(0, 1 - (diffMinutes / 120));
  } catch (err) {
    return 0.7;
  }
}

/**
 * Core Algorithm: Calculates overall ride compatibility score.
 * 
 * Formula:
 * matchScore = (pickupProximity * 0.35) + (destinationProximity * 0.40) + (timeCompatibility * 0.25)
 * 
 * @param {Object} ride - Available ride document from Firestore
 * @param {Object} searchParams - Search criteria (pickupCoords, destCoords, date, preferredTime)
 * @returns {Object} { totalScore, routeMatchPercent, pickupDistanceKm, destDistanceKm }
 */
export function calculateMatchScore(ride, searchParams = {}) {
  // Extract coordinates
  const rideSourceCoords = ride.sourceCoordinates || { lat: 28.4744, lng: 77.5040 }; // Default Greater Noida
  const rideDestCoords = ride.destinationCoordinates || { lat: 28.6273, lng: 77.3725 }; // Default Noida Sec 62

  const searchPickupCoords = searchParams.pickupCoordinates || rideSourceCoords;
  const searchDestCoords = searchParams.destCoordinates || rideDestCoords;

  // 1. Pickup proximity
  const pickupDistanceKm = calculateHaversineDistance(
    searchPickupCoords.lat,
    searchPickupCoords.lng,
    rideSourceCoords.lat,
    rideSourceCoords.lng
  );
  const pickupProximityScore = getProximityScore(pickupDistanceKm, 20);

  // 2. Destination proximity
  const destDistanceKm = calculateHaversineDistance(
    searchDestCoords.lat,
    searchDestCoords.lng,
    rideDestCoords.lat,
    rideDestCoords.lng
  );
  const destProximityScore = getProximityScore(destDistanceKm, 20);

  // 3. Time compatibility
  const timeScore = getTimeCompatibilityScore(ride.departureTime, searchParams.preferredTime);

  // Composite Route Match Score
  // Pickup (35%), Destination (40%), Time (25%)
  const compositeScore = (pickupProximityScore * 0.35) + (destProximityScore * 0.40) + (timeScore * 0.25);
  
  // Convert to percentage integer (min 60% for reasonable suggestions in mock/search)
  const routeMatchPercent = Math.min(99, Math.max(62, Math.round(compositeScore * 100)));

  return {
    compositeScore,
    routeMatchPercent,
    pickupDistanceKm: parseFloat(pickupDistanceKm.toFixed(1)),
    destDistanceKm: parseFloat(destDistanceKm.toFixed(1)),
    isHighlyCompatible: routeMatchPercent >= 80
  };
}

/**
 * Filter and sort rides based on compatibility score and available seats
 */
export function matchAndRankRides(rides, searchParams) {
  return rides
    .filter(ride => {
      // Filter out completed, cancelled or full rides
      const seatsAvailable = (ride.availableSeats ?? 0) > 0;
      const isScheduled = ride.status === 'scheduled' || ride.status === 'active';
      return seatsAvailable && isScheduled;
    })
    .map(ride => {
      const matchDetails = calculateMatchScore(ride, searchParams);
      return {
        ...ride,
        matchDetails,
        matchScore: matchDetails.routeMatchPercent
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
