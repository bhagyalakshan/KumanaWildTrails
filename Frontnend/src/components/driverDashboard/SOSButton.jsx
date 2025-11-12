import { useState, useEffect } from "react";
import './custom-css/sos-button.css';

// Polygon coordinates of Kumana Park (latitude, longitude)
const kumanaParkBoundary = [
  [6.285, 81.690], [6.290, 81.650], [6.300, 81.600], [6.320, 81.550],
  [6.340, 81.500], [6.360, 81.470], [6.380, 81.450], [6.400, 81.430],
  [6.420, 81.420], [6.440, 81.410], [6.460, 81.400], [6.480, 81.405],
  [6.500, 81.415], [6.520, 81.430], [6.540, 81.450], [6.560, 81.480],
  [6.580, 81.510], [6.600, 81.540], [6.620, 81.570], [6.640, 81.600],
  [6.660, 81.630], [6.680, 81.660], [6.700, 81.700], [6.690, 81.740],
  [6.670, 81.770], [6.650, 81.790], [6.630, 81.800], [6.600, 81.810],
  [6.570, 81.820], [6.540, 81.830], [6.510, 81.840], [6.480, 81.850],
  [6.450, 81.845], [6.420, 81.840], [6.390, 81.830], [6.360, 81.810],
  [6.330, 81.780], [6.300, 81.740], [6.285, 81.690]
];

const isWithinKumana = (lat, lng) => {
  let inside = false;
  for (let i = 0, j = kumanaParkBoundary.length - 1; i < kumanaParkBoundary.length; j = i++) {
    const yi = kumanaParkBoundary[i][0], xi = kumanaParkBoundary[i][1];
    const yj = kumanaParkBoundary[j][0], xj = kumanaParkBoundary[j][1];
    const intersect =
      (yi > lat !== yj > lat) &&
      (lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const demoCoordinates = [
  { lat: 6.547939, lng: 81.688521 },
  { lat: 6.571841, lng: 81.713383 },
  { lat: 6.566790, lng: 81.700198 },
  { lat: 6.474983, lng: 81.654569 },
  { lat: 6.515333, lng: 81.628845 },
];

const getRandomDemoLocation = () => {
  const randomIndex = Math.floor(Math.random() * demoCoordinates.length);
  return demoCoordinates[randomIndex];
};

const SOSButton = ({ onSOS, onShowConfirmation }) => {
  const [isTriggering, setIsTriggering] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isValidLocation, setIsValidLocation] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [useDemoLocation, setUseDemoLocation] = useState(false);

  useEffect(() => {
    if (useDemoLocation) {
      const demoLoc = getRandomDemoLocation();
      setCurrentLocation(demoLoc);
      setIsValidLocation(isWithinKumana(demoLoc.lat, demoLoc.lng));
      setIsLoadingLocation(false);
      return;
    }

    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(newLocation);
          setIsValidLocation(isWithinKumana(newLocation.lat, newLocation.lng));
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setCurrentLocation(null);
          setIsValidLocation(false);
          setIsLoadingLocation(false);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      setCurrentLocation(null);
      setIsValidLocation(false);
      setIsLoadingLocation(false);
    }
  }, [useDemoLocation]);

  const handleSOSClick = () => {
    if (!currentLocation) {
      console.warn("Location unavailable");
      return;
    }
    onShowConfirmation({
      coordinates: currentLocation
        ? `${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}`
        : "Unknown",
      isValid: isValidLocation,
      isLoading: isLoadingLocation,
      currentLocation,
    });
  };

  const toggleDemoMode = () => {
    setUseDemoLocation((prev) => !prev);
  };

  return (
    <div className="card shadow-sm mx-auto sos-card bg-danger-subtle border-danger-subtle">
      <div className="card-body p-3">
        <div className="mb-2">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <span className="sos-icon me-2">🚨</span>
              <h3 className="card-title text-danger mb-0 fw-bold fs-6">Emergency Alert System</h3>
            </div>
            <span className="badge bg-danger-subtle text-danger fw-bold text-uppercase">
              Emergency
            </span>
          </div>
        </div>

        <p className="text-muted small mb-2">
          Press the button below to send your current location to nearby rangers and emergency services.
        </p>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted small fw-medium">Location Mode:</span>
          <button
            type="button"
            onClick={toggleDemoMode}
            disabled={isLoadingLocation}
            className="btn btn-outline-secondary btn-sm sos-toggle-button"
          >
            {useDemoLocation ? "Use Real GPS" : "Use Test GPS"}
          </button>
        </div>

        <button
          onClick={handleSOSClick}
          disabled={isTriggering || isLoadingLocation || !isValidLocation}
          className={`btn btn-danger w-100 py-2 fs-6 fw-bold sos-button ${pulseAnimation ? "animate-pulse" : ""}`}
        >
          {isLoadingLocation
            ? "Getting Location..."
            : isTriggering
            ? "Sending SOS..."
            : "🚨 Send SOS"}
        </button>

        {isLoadingLocation ? (
          <p className="mt-2 text-center text-muted small">
            Determining your location...
          </p>
        ) : (
          <p className="mt-2 text-center small">
            {isValidLocation ? (
              <span className="text-success fw-medium">
                ✅ You are within Kumana National Park
              </span>
            ) : (
              <span className="text-danger fw-medium">
                ❌ Outside park boundaries - SOS unavailable
              </span>
            )}
          </p>
        )}

        {useDemoLocation && (
          <p className="mt-2 text-center text-warning small bg-warning-subtle p-2 rounded">
            Test mode active. Coordinates are randomly generated from demo list.
          </p>
        )}

        <p className="mt-2 text-center text-muted small">
          Use only in genuine emergency situations
        </p>
      </div>
    </div>
  );
};

export default SOSButton;