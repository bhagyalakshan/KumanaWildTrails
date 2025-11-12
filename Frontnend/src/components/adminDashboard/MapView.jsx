"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Modal, Badge } from "react-bootstrap";
import { jwtDecode } from 'jwt-decode';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, actionType }) => {
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="small">{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant={actionType === "resolve" ? "success" : "danger"}
          size="sm"
          onClick={onConfirm}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const MapView = () => {
  const [activeTab, setActiveTab] = useState("sightings");
  const [sightings, setSightings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sightingToDelete, setSightingToDelete] = useState(null);
  const [alertToResolve, setAlertToResolve] = useState(null);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerPoolRef = useRef([]);
  const containerRef = useRef(null);

  // Default center for Yala National Park
  const defaultCenter = { lat: 6.4698, lng: 81.3456 };

  // Check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  // Format ISO date to readable time
  const formatTimestamp = (dateTime) => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return dateTime;
    }
  };

  // Normalize animal name to expected type
  const normalizeAnimalType = (animalName) => {
    if (!animalName) return "default";
    const lowerName = animalName.toLowerCase();
    if (lowerName.includes("bear")) return "bear";
    if (lowerName.includes("elephant")) return "elephant";
    if (lowerName.includes("tiger")) return "leopard";
    if (lowerName.includes("bird")) return "bird";
    return "default";
  };

  // Load Google Maps
  useEffect(() => {
    if (window.google?.maps?.Map) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=marker&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => setApiError("Failed to load Google Maps API");

    window.initMap = () => setMapLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      delete window.initMap;
    };
  }, []);

  // Initialize map with proper sizing
  useEffect(() => {
    if (!mapLoaded) return;

    const initMap = () => {
      try {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 12,
          disableDefaultUI: true,
          gestureHandling: "greedy",
          mapId: "6bbf28f0a2a779649aa95dc3",
          clickableIcons: false,
        });

        // Ensure map fills container
        setTimeout(() => {
          window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
          mapInstanceRef.current.setCenter(defaultCenter);
        }, 100);
      } catch (error) {
        console.error("Error initializing map:", error);
        setApiError("Error initializing map");
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        window.google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
    };
  }, [mapLoaded]);

  // Handle window resize events
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current && mapRef.current) {
        setTimeout(() => {
          window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Trigger initial resize
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Resize map when sidebar toggles
  useEffect(() => {
    if (mapInstanceRef.current && mapRef.current) {
      setTimeout(() => {
        window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
      }, 300);
    }
  }, [sidebarOpen]);

  // Fetch data with polling
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token || isTokenExpired(token)) {
        setApiError("Authentication required");
        setIsLoading(false);
        return;
      }

      try {
        const [sightingsRes, alertsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sightings/recent`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sos/unresolved`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (sightingsRes.ok) {
          const rawSightings = await sightingsRes.json();
          const mappedSightings = rawSightings.map(s => ({
            id: s.sightingId,
            type: normalizeAnimalType(s.animalName),
            lat: s.lat,
            lng: s.lng,
            timestamp: formatTimestamp(s.dateTime),
            reportedBy: s.submittedBy,
            count: s.count || 1,
            details: s.notes,
          }));
          setSightings(mappedSightings);
        }
        if (alertsRes.ok) {
          const rawAlerts = await alertsRes.json();
          setAlerts(rawAlerts);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setApiError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Animal type to color mapping
  const getAnimalColor = (type) => {
    const colors = {
      elephant: "#2A9D8F",
      leopard: "#E9C46A",
      bear: "#264653",
      bird: "#F4A261",
      default: "#E76F51"
    };
    return colors[type] || colors.default;
  };

  // Animal type to emoji mapping
  const getAnimalIcon = (type) => {
    const icons = {
      elephant: "🐘",
      leopard: "🐆",
      bear: "🐻",
      bird: "🦅",
      default: "🐆"
    };
    return icons[type] || icons.default;
  };

  // Alert type to emoji mapping
  const getAlertIcon = (type) => {
    const icons = {
      sos: "🆘",
      injury: "🩹",
      danger: "⚠️",
      information: "ℹ️",
      default: "⚠️"
    };
    return icons[type] || icons.default;
  };

  // Create custom marker element for sightings
  const createSightingMarkerElement = (sighting) => {
    const element = document.createElement("div");
    element.className = "bg-white p-2 rounded shadow border w-48 small";
    element.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span style="display: flex; align-items: center;">
          <span style="margin-right: 4px; font-size: 20px;">${getAnimalIcon(sighting.type)}</span>
          <span style="font-weight: 500; text-transform: capitalize;">${sighting.type}</span>
        </span>
        <span style="background: ${getAnimalColor(sighting.type)}; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px;">
          ${sighting.count}
        </span>
      </div>
      <p style="font-size: 12px; color: #6B7280;">${sighting.timestamp} by ${sighting.reportedBy}</p>
      ${sighting.details ? `<p style="font-size: 12px; margin-top: 4px;">${sighting.details}</p>` : ''}
      <p style="font-size: 12px; margin-top: 4px;">GPS: ${Number(sighting.lat).toFixed(4)}, ${Number(sighting.lng).toFixed(4)}</p>
      <button id="delete-${sighting.id}" style="margin-top: 8px; width: 100%; padding: 4px; background: #EF4444; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
        Delete
      </button>
    `;
    element.querySelector(`#delete-${sighting.id}`).addEventListener("click", (e) => {
      e.stopPropagation();
      setSightingToDelete(sighting.id);
      setIsModalOpen(true);
    });
    return element;
  };

  // Create custom marker element for alerts
  const createAlertMarkerElement = (alert) => {
    const element = document.createElement("div");
    element.className = `bg-white p-2 rounded shadow border ${alert.solved === false ? "border-danger" : "border-success"} w-48 small`;
    element.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span style="display: flex; align-items: center;">
          <span style="margin-right: 4px; font-size: 20px;">${getAlertIcon(alert.type || "danger")}</span>
          <span style="font-weight: 500; text-transform: capitalize;">${alert.type || "danger"}</span>
        </span>
        <span style="background: ${alert.solved === false ? "#FECACA" : "#BBF7D0"}; color: ${alert.solved === false ? "#B91C1C" : "#15803D"}; font-size: 10px; padding: 2px 6px; border-radius: 4px;">
          ${alert.solved === false ? "active" : "resolved"}
        </span>
      </div>
      <p style="font-size: 12px; color: #6B7280;">${alert.timestamp || "2025/09/30"} by ${alert.driverName || alert.reportedBy}</p>
      <p style="font-size: 12px; margin-top: 4px;">${alert.details || "No additional details provided"}</p>
      <p style="font-size: 12px; margin-top: 4px;">GPS: ${Number(alert.latitude).toFixed(4)}, ${Number(alert.longitude).toFixed(4)}</p>
      ${alert.solved === false ? `
        <button id="resolve-${alert.alertId}" style="margin-top: 8px; width: 100%; padding: 4px; background: #22C55E; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
          Mark as Resolved
        </button>
      ` : ''}
    `;
    if (alert.solved === false) {
      element.querySelector(`#resolve-${alert.alertId}`).addEventListener("click", (e) => {
        e.stopPropagation();
        setAlertToResolve(alert.alertId);
        setIsModalOpen(true);
      });
    }
    return element;
  };

  // Create sighting marker
  const createSightingMarker = useCallback((sighting) => {
    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      position: { lat: Number(sighting.lat), lng: Number(sighting.lng) },
      map: activeTab === "sightings" ? mapInstanceRef.current : null,
      content: createSightingMarkerElement(sighting),
      title: `${sighting.type} — ${sighting.timestamp} by ${sighting.reportedBy}`
    });
    marker.__id = sighting.id;
    return marker;
  }, [activeTab]);

  // Create alert marker
  const createAlertMarker = useCallback((alert) => {
    const lat = Number(alert.latitude);
    const lng = Number(alert.longitude);
  
    if (isNaN(lat) || isNaN(lng)) {
      console.error("Invalid coordinates for alert:", alert);
      return null;
    }
  
    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      position: { lat, lng },
      map: activeTab === "alerts" ? mapInstanceRef.current : null,
      content: createAlertMarkerElement(alert),
      title: `SOS alert — ID ${alert.alertId} by ${alert.driverName || alert.reportedBy}`
    });
  
    marker.__id = `alert-${alert.alertId}`;
    return marker;
  }, [activeTab]);

  // Center map on a specific sighting or alert
  const centerMapOnItem = (item, type) => {
    if (!mapInstanceRef.current) return;
    const lat = type === "sighting" ? Number(item.lat) : Number(item.latitude);
    const lng = type === "sighting" ? Number(item.lng) : Number(item.longitude);
    if (isNaN(lat) || isNaN(lng)) {
      console.error(`Invalid coordinates for ${type}:`, item);
      return;
    }
    mapInstanceRef.current.setCenter({ lat, lng });
    mapInstanceRef.current.setZoom(15);
    setActiveTab(type === "sighting" ? "sightings" : "alerts");
    setSidebarOpen(true);
  };

  // Update markers
  const updateMarkers = useCallback(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    const currentIds = new Set();

    // Add sighting markers
    if (activeTab === "sightings") {
      sightings.forEach((sighting) => {
        if (!sighting.id) return;
        currentIds.add(sighting.id);
        if (!markerPoolRef.current.some(m => m.__id === sighting.id)) {
          const marker = createSightingMarker(sighting);
          if (marker) markerPoolRef.current.push(marker);
        }
      });
    }

    // Add alert markers
    if (activeTab === "alerts") {
      alerts.forEach((alert) => {
        const alertId = `alert-${alert.alertId}`;
        currentIds.add(alertId);
        if (!markerPoolRef.current.some(m => m.__id === alertId)) {
          const marker = createAlertMarker(alert);
          if (marker) markerPoolRef.current.push(marker);
        }
      });
    }

    // Remove old markers
    markerPoolRef.current = markerPoolRef.current.filter((marker) => {
      if (currentIds.has(marker.__id)) return true;
      marker.map = null;
      return false;
    });
  }, [mapLoaded, sightings, alerts, activeTab, createSightingMarker, createAlertMarker]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  // Delete sighting
  const removeSighting = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sightings/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setSightings(sightings.filter(s => s.id !== id));
        toast.success("Sighting deleted successfully!");
      } else {
        throw new Error("Failed to delete sighting");
      }
    } catch (error) {
      console.error("Error deleting sighting:", error);
      toast.error("Failed to delete sighting. Please try again.");
    }
  };

  // Handle modal confirm for deleting sighting
  const handleConfirmDelete = () => {
    if (sightingToDelete) {
      removeSighting(sightingToDelete);
      setIsModalOpen(false);
      setSightingToDelete(null);
    }
  };

  // Resolve alert
  const resolveAlert = async (id) => {
    try {
      console.log(id)
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sos/resolve/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setAlerts(prev => prev.filter(alert => alert.alertId !== id));
        toast.success("SOS alert resolved successfully!");
      } else {
        throw new Error("Failed to resolve SOS alert");
      }
    } catch (error) {
      console.error("Error resolving alert:", error);
      toast.error("Failed to resolve alert. Please try again.");
    }
  };

  // Handle modal confirm for resolving alert
  const handleConfirmResolve = () => {
    if (alertToResolve) {
      resolveAlert(alertToResolve);
      setIsModalOpen(false);
      setAlertToResolve(null);
    }
  };

  if (apiError) {
    return (
      <div className="card shadow-sm border h-100">
        <div className="card-body">
          <div className="text-danger">{apiError}</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="card shadow-sm border overflow-hidden d-flex h-100 w-100"
    >
      {/* Collapsible sidebar */}
      <div 
        className={`position-absolute position-md-relative z-1 h-100 bg-white border-end transition-all duration-300 ${sidebarOpen ? "w-250px translate-0" : "w-0 translate-x-full d-md-block w-md-50px"}`}
        style={{ height: '100%' }}
      >
        {sidebarOpen ? (
          <div className="p-3 overflow-y-auto h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">{activeTab === "sightings" ? "Animal Sightings" : "SOS & Alerts"}</h5>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="btn btn-sm btn-light rounded"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose size={16} />
              </button>
            </div>

            <div className="d-flex gap-2 mb-3">
              <Button
                variant={activeTab === "sightings" ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setActiveTab("sightings")}
              >
                Sightings
              </Button>
              <Button
                variant={activeTab === "alerts" ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setActiveTab("alerts")}
              >
                Alerts
                {alerts.filter(a => a.solved === false).length > 0 && (
                  <Badge bg="danger" className="ms-1">
                    {alerts.filter(a => a.solved === false).length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* List of items */}
            {activeTab === "sightings" ? (
              <div className="d-flex flex-column gap-2">
                {sightings.length === 0 ? (
                  <p className="small text-muted">No sightings available</p>
                ) : (
                  sightings.map(sighting => (
                    <div
                      key={sighting.id}
                      className="bg-light p-2 rounded border cursor-pointer"
                      onClick={() => centerMapOnItem(sighting, "sighting")}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <span className="me-2 fs-5">{getAnimalIcon(sighting.type)}</span>
                          <span className="small text-capitalize">{sighting.type}</span>
                        </div>
                        <span className="bg-primary text-white small px-2 py-1 rounded">{sighting.count}</span>
                      </div>
                      <p className="small text-muted mt-1 mb-0">{sighting.timestamp} by {sighting.reportedBy}</p>
                      {sighting.details && <p className="small text-muted mt-1 mb-0">{sighting.details}</p>}
                      <p className="small text-muted mt-1 mb-0">GPS: {Number(sighting.lat).toFixed(4)}, {Number(sighting.lng).toFixed(4)}</p>
                      <Button
                        variant="danger"
                        size="sm"
                        className="mt-2 w-100 small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSightingToDelete(sighting.id);
                          setIsModalOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {alerts.length === 0 ? (
                  <p className="small text-muted">No alerts available</p>
                ) : (
                  alerts.map(alert => (
                    <div
                      key={alert.alertId}
                      className="bg-light p-2 rounded border cursor-pointer"
                      onClick={() => centerMapOnItem(alert, "alert")}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <span className="me-2 fs-5">{getAlertIcon(alert.type || "danger")}</span>
                          <span className="small text-capitalize">{alert.type || "danger"}</span>
                        </div>
                        <span
                          className={`small px-2 py-1 rounded ${alert.solved === false ? "bg-danger text-white" : "bg-success text-white"}`}
                        >
                          {alert.solved === false ? "active" : "resolved"}
                        </span>
                      </div>
                      <p className="small text-muted mt-1 mb-0">
                        {alert.timestamp || "2025/09/30"} by {alert.driverName || alert.reportedBy}
                      </p>
                      <p className="small text-muted mt-1 mb-0">{alert.details || "No additional details provided"}</p>
                      <p className="small text-muted mt-1 mb-0">
                        GPS: {Number(alert.latitude).toFixed(4)}, {Number(alert.longitude).toFixed(4)}
                      </p>
                      {alert.solved === false && (
                        <Button
                          variant="success"
                          size="sm"
                          className="mt-2 w-100 small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAlertToResolve(alert.alertId);
                            setIsModalOpen(true);
                          }}
                        >
                          Mark as Resolved
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="h-100 d-flex flex-column align-items-center pt-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="btn btn-sm btn-light rounded"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen size={16} />
            </button>
            <div className="d-flex flex-column align-items-center mt-3 gap-2">
              <Button
                variant={activeTab === "sightings" ? "primary" : "outline-primary"}
                size="sm"
                className="w-100px h-100px p-0"
                onClick={() => setActiveTab("sightings")}
              >
                🐾
              </Button>
              <Button
                variant={activeTab === "alerts" ? "primary" : "outline-primary"}
                size="sm"
                className="w-100px h-100px p-0 position-relative"
                onClick={() => setActiveTab("alerts")}
              >
                🚨
                {alerts.filter(a => a.solved === false).length > 0 && (
                  <span className="position-absolute top-0 end-0 bg-danger text-white small rounded-circle d-flex align-items-center justify-content-center" style={{ width: '16px', height: '16px' }}>
                    {alerts.filter(a => a.solved === false).length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Map container - always takes remaining space */}
      <div className="flex-grow-1 position-relative h-100 w-100">
        {/* Map controls */}
        <div className="position-absolute top-0 start-0 z-1 bg-white rounded shadow p-2 d-flex align-items-center gap-2">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-sm btn-light rounded"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>
          
          <div className="d-flex gap-1">
            <Button
              variant={activeTab === "sightings" ? "primary" : "outline-primary"}
              size="sm"
              className="small"
              onClick={() => setActiveTab("sightings")}
            >
              Sightings
            </Button>
            <Button
              variant={activeTab === "alerts" ? "primary" : "outline-primary"}
              size="sm"
              className="small position-relative"
              onClick={() => setActiveTab("alerts")}
            >
              Alerts
              {alerts.filter(a => a.solved === false).length > 0 && (
                <span className="position-absolute top-0 end-0 bg-danger text-white small rounded-circle d-flex align-items-center justify-content-center" style={{ width: '16px', height: '16px' }}>
                  {alerts.filter(a => a.solved === false).length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Map element - always fills container */}
        <div 
          ref={mapRef} 
          className="position-absolute top-0 start-0 h-100 w-100"
          style={{ outline: "none" }}
        />

        {isLoading && (
          <div className="position-absolute top-0 end-0 bg-white bg-opacity-75 px-3 py-1 rounded shadow small">
            Loading map data...
          </div>
        )}
      </div>

      {/* Confirmation modal for deleting sightings or resolving alerts */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSightingToDelete(null);
          setAlertToResolve(null);
        }}
        onConfirm={sightingToDelete ? handleConfirmDelete : handleConfirmResolve}
        title={sightingToDelete ? "Confirm Deletion" : "Confirm Resolution"}
        message={sightingToDelete 
          ? "Are you sure you want to delete this sighting? This action cannot be undone."
          : "Are you sure you want to mark this alert as resolved? This action cannot be undone."}
        actionType={sightingToDelete ? "delete" : "resolve"}
      />
    </div>
  );
};

export default MapView;