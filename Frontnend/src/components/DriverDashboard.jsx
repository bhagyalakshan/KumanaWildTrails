import React, { useState, useEffect, lazy, Suspense } from "react";
import { toast, Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import "../components/driverDashboard/custom-css/driver-dashboard.css";

// Lazy load components
const Header = lazy(() => import("../components/driverDashboard/DriverHeader"));
const Mapbox = lazy(() => import("../components/driverDashboard/MapSection"));
const Booking = lazy(() => import("../components/driverDashboard/DriverBookingDashboard"));
const Calender = lazy(() => import("../components/driverDashboard/DriverBookingCalendar"));
const Sightingform = lazy(() => import("../components/driverDashboard/AnimalSightingForm"));
const DriverProfileSidebar = lazy(() => import("../components/driverDashboard/DriverProfileSidebar"));
const DriverSettingsSidebar = lazy(() => import("../components/driverDashboard/DriverSettingsSidebar"));
const SOSButton = lazy(() => import("../components/driverDashboard/SOSButton"));
const MonthlyBookingStats = lazy(() => import("../components/driverDashboard/MonthlyBookingStats"));

// SOSConfirmationModal component
const SOSConfirmationModal = ({ isOpen, onConfirm, onCancel, locationStatus }) => {
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1050,
      }}
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "600px" }}>
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header bg-light border-0">
            <h5 className="modal-title text-danger fw-bold fs-6">
              <span className="me-2">⚠️</span> Confirm SOS Alert
            </h5>
            <button type="button" className="btn-close" onClick={onCancel} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-warning mb-3 small" role="alert">
              <strong>Warning:</strong> You are about to send an emergency alert. Are you sure you want to proceed?
            </div>
            <div className="mb-3 p-2 bg-light rounded small">
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-medium">Location:</span>
                <span>{locationStatus.coordinates}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="fw-medium">Status:</span>
                <span className={locationStatus.isValid ? "text-success" : "text-danger"}>
                  {locationStatus.isValid ? "Within Park" : "Outside Park"}
                </span>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="sosNote" className="form-label fw-medium small">Additional Note (optional):</label>
              <textarea
                className="form-control form-control-sm"
                id="sosNote"
                rows="3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe the emergency..."
              ></textarea>
            </div>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => onConfirm(note)}>
              Send SOS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DriverDashboard() {
  const [view, setView] = useState("list");
  const [user, setUser] = useState(null);
  const [isLoadingToken, setIsLoadingToken] = useState(true); // New state for token loading
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 6.48553,
    lng: 81.68975,
  });
  const [activePanel, setActivePanel] = useState(null);
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosLocationStatus, setSosLocationStatus] = useState(null);

  const dummyBookings = [
    { id: 1, date: "2025-06-01", timeSlot: "morning", tourType: "Normal Safari", status: "accepted", clientName: "John Safari", vehicle: "Toyota Land Cruiser" },
    { id: 2, date: "2025-06-01", timeSlot: "evening", tourType: "Bird Watching", status: "pending", clientName: "Sarah Bird", vehicle: "Land Rover Defender" },
    { id: 3, date: "2025-06-03", timeSlot: "full", tourType: "Normal Safari", status: "rejected", clientName: "Mike Explorer", vehicle: "Toyota Hilux" },
    { id: 4, date: "2025-06-15", timeSlot: "morning", tourType: "Photography Tour", status: "accepted", clientName: "Lisa Photographer", vehicle: "Toyota Land Cruiser" },
    { id: 5, date: "2025-06-20", timeSlot: "evening", tourType: "Family Safari", status: "pending", clientName: "The Wilson Family", vehicle: "Land Rover Defender" }
  ];

  useEffect(() => {
    const decodeToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser({
            id: decoded.id,
            name: decoded.name,
            email: decoded.sub,
            role: decoded.role,
          });
        } catch (error) {
          console.error("Invalid token", error);
          toast.error("Invalid session. Please log in again.");
        }
      } else {
        toast.error("No session found. Please log in.");
      }
      setIsLoadingToken(false); // Token processing complete
    };

    decodeToken();
  }, []);

  const [sightings, setSightings] = useState([
    { id: "1", animalName: "Elephant", dateTime: "2025-05-25T10:30:00", location: { lat: 6.4853, lng: 81.6853 }, description: "Family of 5 elephants near the watering hole" },
    { id: "2", animalName: "Leopard", dateTime: "2025-05-25T09:15:00", location: { lat: 6.4803, lng: 81.6793 }, description: "Spotted on a tree branch" },
    { id: 3, animalName: "Crocodile", dateTime: "2025-05-25T08:30:00", location: { lat: 6.4873, lng: 81.6923 }, description: "Large crocodile sunbathing on river bank" }
  ]);

  const handleSendSOS = async (location) => {
    setIsSendingSOS(true);
    try {
      const token = localStorage.getItem("token");
      const backendUrl = "http://localhost:8080";
      const body = {
        latitude: location.lat,
        longitude: location.lng,
        details: location.note || "",
      };

      const response = await fetch(`${backendUrl}/api/sos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`SOS alert failed: ${response.status} ${text}`);
      }
      toast.success("SOS alert sent successfully! Rangers will contact you soon.");
    } catch (error) {
      toast.error(error.message || "Failed to send SOS alert. Please try again.");
    } finally {
      setIsSendingSOS(false);
    }
  };

  const handleShowSOSModal = (locationStatus) => {
    setSosLocationStatus(locationStatus);
    setShowSOSModal(true);
  };

  const handleConfirmSOS = (note) => {
    setShowSOSModal(false);
    if (sosLocationStatus?.currentLocation) {
      handleSendSOS({ ...sosLocationStatus.currentLocation, note });
    }
  };

  const handleCancelSOS = () => {
    setShowSOSModal(false);
    setSosLocationStatus(null);
  };

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    const handlePopState = (event) => {
      window.history.pushState(null, document.title, window.location.href);
      toast("Back navigation is disabled on this page", { icon: "⚠️" });
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Render a loading state while token is being processed
  if (isLoadingToken) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Render a message if no user is found (e.g., no token or invalid token)
  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <h5 className="text-danger">Session Expired</h5>
          <p>Please log in to access the dashboard.</p>
          {/* Optionally, add a link to the login page */}
          <a href="/login" className="btn btn-primary">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <Suspense fallback={
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }>
        {/* Main Dashboard Content */}
        <main className="d-flex flex-column min-vh-100 align-items-center p-0">
          <div className="w-100 bg-light">
            <div className="d-flex flex-column h-100">
              <Header setActivePanel={setActivePanel} user={user} />

              <div className="flex-grow-1 container-fluid p-3 overflow-auto dashboard-main">
                <div className="row h-100 w-100 g-3">
                  {/* Map Section */}
                  <div className="col-12 col-lg-9 h-100">
                    <div className="map-container">
                      <Mapbox
                        selectedLocation={selectedLocation}
                        setSelectedLocation={setSelectedLocation}
                        sightings={sightings}
                      />
                    </div>
                  </div>

                  {/* Sidebar Section */}
                  <div className="col-12 col-lg-3 h-100 d-flex flex-column gap-3 overflow-auto">
                    <Sightingform
                      onNewSighting={(newSighting) =>
                        setSightings((prev) => [newSighting, ...prev])
                      }
                    />
                    <SOSButton
                      onSOS={handleSendSOS}
                      onShowConfirmation={handleShowSOSModal}
                      isSending={isSendingSOS}
                    />
                    <div>
                      <Booking />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar/List View Section */}
          <div className="w-100 bg-light py-3">
            <div className="container-fluid px-2 px-md-3">
              <div className="row g-3">
                <div className="col-lg-8 d-flex">
                  <div className="card flex-grow-1 border-0 rounded-0 bg-white">
                    <Calender view={view} />
                  </div>
                </div>
                <div className="col-lg-4 d-flex">
                  <div className="card flex-grow-1 border-0 rounded-0 bg-white">
                    <MonthlyBookingStats bookings={dummyBookings} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SOS Confirmation Modal */}
          <SOSConfirmationModal
            isOpen={showSOSModal}
            onConfirm={handleConfirmSOS}
            onCancel={handleCancelSOS}
            locationStatus={sosLocationStatus}
          />
        </main>

        {/* Sidebars */}
        {activePanel === "profile" && (
          <DriverProfileSidebar
            isOpen={activePanel === "profile"}
            onClose={() => setActivePanel(null)}
            user={user}
          />
        )}
        {activePanel === "settings" && (
          <DriverSettingsSidebar
            isOpen={activePanel === "settings"}
            onClose={() => setActivePanel(null)}
          />
        )}
      </Suspense>
    </>
  );
}