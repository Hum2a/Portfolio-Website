/**
 * Traffic page formatting and location helpers
 */

export function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  try {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleString();
    }
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString();
  } catch (error) {
    return 'N/A';
  }
}

/**
 * Human-readable duration (e.g. "45s", "2m 30s", "1h 5m")
 */
export function formatDuration(totalSeconds) {
  if (totalSeconds == null || totalSeconds < 0) return '0s';
  const s = Math.floor(totalSeconds);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const secs = s % 60;
  if (m < 60) return secs > 0 ? `${m}m ${secs}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const mins = m % 60;
  if (mins > 0) return `${h}h ${mins}m`;
  return `${h}h`;
}

export function getLocationString(location) {
  if (!location) return 'Location unavailable';
  if ((location.city === 'Unknown' || !location.city) && (location.country === 'Unknown' || !location.country)) {
    return 'Location unavailable';
  }
  const parts = [];
  if (location.city && location.city !== 'Unknown') parts.push(location.city);
  if (location.region && location.region !== 'Unknown') parts.push(location.region);
  if (location.country && location.country !== 'Unknown') parts.push(location.country);
  return parts.length > 0 ? parts.join(', ') : 'Location unavailable';
}

export function hasValidCoordinates(location) {
  if (!location || !location.coordinates) return false;
  const [lat, lon] = location.coordinates;
  return lat && lon && lat !== '0' && lon !== '0' && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lon));
}

export function getGoogleMapsUrl(location) {
  if (!hasValidCoordinates(location)) {
    const locationStr = getLocationString(location).replace(/\s+/g, '+');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationStr)}`;
  }
  const [lat, lon] = location.coordinates;
  return `https://www.google.com/maps?q=${lat},${lon}`;
}
