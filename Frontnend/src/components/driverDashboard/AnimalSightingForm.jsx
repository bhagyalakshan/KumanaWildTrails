import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const token = localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

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

// Updated demo coordinates within Kumana Park boundaries
const demoCoordinates = [
  { lat: 6.350, lng: 81.470 },
  { lat: 6.400, lng: 81.500 },
  { lat: 6.450, lng: 81.600 },
  { lat: 6.500, lng: 81.700 },
  { lat: 6.600, lng: 81.650 },
];

const getLocalDateTimeString = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
};

// Ray casting algorithm for point-in-polygon detection
const isPointInPolygon = (point, polygon) => {
  const [lat, lng] = point;
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [latI, lngI] = polygon[i];
    const [latJ, lngJ] = polygon[j];
    
    const intersect = ((lngI > lng) !== (lngJ > lng)) &&
      (lat < ((latJ - latI) * (lng - lngI)) / (lngJ - lngI) + latI);
      
    if (intersect) inside = !inside;
  }
  
  return inside;
};

const AnimalSightingForm = ({ onSubmit }) => {
  const [animalName, setAnimalName] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidLocation, setIsValidLocation] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [useDemoLocation, setUseDemoLocation] = useState(false);

  const animalOptions = [
    { value: "Tiger", label: "Tiger" },
    { value: "Sloth Bear", label: "Sloth Bear" },
    { value: "Elephant", label: "Elephant" },
  
  ];

  const isWithinKumanaPolygon = (lat, lng) => {
    // First try using Google Maps geometry if available
    if (window.google?.maps?.geometry) {
      const point = new window.google.maps.LatLng(lat, lng);
      const polygon = new window.google.maps.Polygon({
        paths: kumanaParkBoundary.map(([lat, lng]) => new window.google.maps.LatLng(lat, lng)),
      });

      return window.google.maps.geometry.poly.containsLocation(point, polygon);
    }
    
    // Fallback to our own ray casting implementation
    return isPointInPolygon([lat, lng], kumanaParkBoundary);
  };

  const getRandomDemoLocation = () => {
    const randomIndex = Math.floor(Math.random() * demoCoordinates.length);
    return demoCoordinates[randomIndex];
  };

  useEffect(() => {
    setDateTime(getLocalDateTimeString());

    const processLocation = (lat, lng) => {
      setSelectedLocation({ lat, lng });
      const isValid = isWithinKumanaPolygon(lat, lng);
      setIsValidLocation(isValid);
      setIsLoadingLocation(false);
    };

    if (useDemoLocation) {
      const demoLoc = getRandomDemoLocation();
      processLocation(demoLoc.lat, demoLoc.lng);
      return;
    }

    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          processLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setIsLoadingLocation(false);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
    }
  }, [useDemoLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!animalName.trim() || !dateTime || !isValidLocation) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newSighting = {
        animalName: animalName.trim(),
        dateTime: new Date(dateTime).toISOString(),
        notes: notes.trim() || undefined,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      };
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/sightings/createSighting`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSighting),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Something went wrong");
        return;
      }
      const data = await response.json();
      console.log("Sighting submitted:", data);

      if (onSubmit && typeof onSubmit === "function") {
        await onSubmit(newSighting);
      }
      toast.success("Sighting submitted successfully!");
      setAnimalName("");
      setNotes("");
    } catch (error) {
      console.error("Error submitting sighting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3 border rounded bg-success-subtle border-success mb-3">
      <div className="d-flex align-items-start">
        <div className="w-100">
          <div className="d-flex justify-content-between align-items-start">
            <h3 className="fw-medium text-success fs-5">Animal Sighting Report</h3>
            <span className="d-inline-block px-2 py-1 fs-7 fw-semibold rounded bg-success-subtle text-success">REPORT</span>
          </div>

          <p className="fs-6 text-muted mt-2 mb-3">Record details of any wildlife sightings during your safari.</p>

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label htmlFor="animalName" className="form-label fs-6 fw-medium text-muted">Animal Species*</label>
              <select
                id="animalName"
                className="form-select bg-white border rounded py-2 px-3 fs-6"
                value={animalName}
                onChange={(e) => setAnimalName(e.target.value)}
                required
              >
                <option value="" disabled>Select an animal</option>
                {animalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dateTime" className="form-label fs-6 fw-medium text-muted">Date & Time*</label>
              <input
                id="dateTime"
                type="datetime-local"
                value={dateTime}
                readOnly
                className="form-control bg-light border rounded py-2 px-3 fs-6 text-muted"
              />
            </div>

            <div>
              <label htmlFor="notes" className="form-label fs-6 fw-medium text-muted">Notes</label>
              <textarea
                id="notes"
                placeholder="Additional observations (behavior, group size, etc.)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-control border rounded py-2 px-3 h-24 fs-6"
              />
            </div>

            <div className="d-flex flex-column gap-2">
              <div className="d-flex justify-content-between align-items-center">
                <label className="form-label fs-6 fw-medium text-muted">Location</label>
                <button
                  type="button"
                  onClick={() => setUseDemoLocation(!useDemoLocation)}
                  className="btn btn-light px-2 py-1 fs-7 text-muted rounded"
                >
                  {useDemoLocation ? "Use Real Location" : "Use Demo Location"}
                </button>
              </div>

              {isLoadingLocation ? (
                <div className="d-flex align-items-center justify-content-center h-10 border rounded bg-light">
                  <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                  <span className="fs-6 text-muted">Getting location...</span>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <div
                    className={`w-100 border rounded py-2 px-3 fs-6 ${
                      isValidLocation
                        ? "bg-success-subtle border-success text-success"
                        : "bg-danger-subtle border-danger text-danger"
                    }`}
                  >
                    <div className="d-flex justify-content-between">
                      <span className="fw-medium">Coordinates:</span>
                      <span>
                        {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                      </span>
                    </div>
                    <div className="fs-7 mt-1">
                      {isValidLocation ? "✅ Within Kumana National Park" : "❌ Outside park boundaries"}
                    </div>
                  </div>
                  {useDemoLocation && (
                    <div className="fs-7 text-muted bg-warning-subtle p-2 rounded">
                      Using demo location for testing. Auto-randomizing every 10s.
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValidLocation || isLoadingLocation}
              className="btn btn-success text-white mt-2 px-4 py-2 d-flex align-items-center justify-content-center"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner-border spinner-border-sm text-white me-2" role="status"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    className="me-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Submit Sighting
                </>
              )}
            </button>

            <p className="fs-7 text-muted text-center mt-2">* Required fields</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnimalSightingForm;