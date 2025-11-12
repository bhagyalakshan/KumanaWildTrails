import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Bell, Settings, User, LogOut, MapPin } from "lucide-react";
import "./custom-css/DriverHeader.css";

export default function DriverHeader({ setActivePanel, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [error, setError] = useState(null);
  const [driverPhoto, setDriverPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef();
  const notificationRef = useRef();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const previousSightingsRef = useRef([]);
  const previousSosRef = useRef([]);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    try {
      const [driverRes, sightingsRes, sosRes] = await Promise.allSettled([
        fetch(`${backendUrl}/api/driver/get_loggedin`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${backendUrl}/api/sightings/recent`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${backendUrl}/api/sos/unresolved`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Handle driver data
      if (driverRes.status === "fulfilled" && driverRes.value.ok) {
        const driverData = await driverRes.value.json();
        if (driverData.photo_url) {
          setDriverPhoto(`${backendUrl}${driverData.photo_url}`);
        }
      }

      let newNotifications = [];

      // Handle sightings
      if (sightingsRes.status === "fulfilled" && sightingsRes.value.ok) {
        const sightingsData = await sightingsRes.value.json();
        const newSightings = sightingsData.filter(
          (newSighting) =>
            !previousSightingsRef.current.some(
              (prev) => prev.sightingId === newSighting.sightingId
            )
        );
        newNotifications = newNotifications.concat(
          newSightings.map((sighting) => ({
            id: sighting.sightingId,
            message: `New ${sighting.animalName} sighted 🐅 at lat: ${sighting.lat}, lng: ${sighting.lng} by ${sighting.submittedBy}`,
            time: new Date(sighting.dateTime).toLocaleTimeString(),
            unread: true,
            type: "wildlife",
          }))
        );
        previousSightingsRef.current = [...sightingsData];
      }

      // Handle SOS
      if (sosRes.status === "fulfilled" && sosRes.value.ok) {
        const sosData = await sosRes.value.json();
        const newSos = sosData.filter(
          (newAlert) =>
            !previousSosRef.current.some(
              (prev) => prev.alertId === newAlert.alertId
            )
        );
        newNotifications = newNotifications.concat(
          newSos.map((alert) => ({
            id: alert.alertId,
            message: `New SOS alert 🚨: ${alert.details || "No details"} at lat: ${alert.latitude}, lng: ${alert.longitude} by ${alert.driverName}`,
            time: new Date().toLocaleTimeString(), // Use current time since no timestamp in data
            unread: true,
            type: "alert",
          }))
        );
        previousSosRef.current = [...sosData];
      }

      // Add new notifications to the front
      setNotifications((prev) => [...newNotifications, ...prev]);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      console.log("Polling for data");
      fetchData();
    }, 30000);

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const handleClickOutside = (e) => {
      setTimeout(() => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
          setMenuOpen(false);
        }
        if (notificationRef.current && !notificationRef.current.contains(e.target)) {
          setShowNotifications(false);
        }
      }, 10);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(interval);
    };
  }, [fetchData]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }, [navigate]);

  const clearNotification = useCallback((id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, unread: false } : notif))
    );
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "wildlife":
        return "🐘";
      case "alert":
        return "⚠️";
      default:
        return "🔔";
    }
  };

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
    if (!menuOpen) {
      setShowNotifications(false);
    }
  }, [menuOpen]);

  const toggleNotifications = useCallback(() => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) {
      setMenuOpen(false);
    }
  }, [showNotifications]);

  const handleProfileClick = useCallback(() => {
    setActivePanel("profile", { user });
    setMenuOpen(false);
  }, [setActivePanel, user]);

  const handleSettingsClick = useCallback(() => {
    setActivePanel("settings", { user });
    setMenuOpen(false);
  }, [setActivePanel, user]);

  return (
    <header
      className="driver-header px-2 px-sm-4 px-md-6 py-3 d-flex justify-content-between align-items-center shadow sticky-top"
      style={{ minHeight: "70px" }}
    >
      <div className="d-flex align-items-center">
        <div className="me-3">
          <MapPin size={28} className="text-white" />
        </div>
        <h1 className="welcome-text font-weight-bold fs-4 fs-sm-3 fs-md-2 text-truncate mb-0">
          Welcome,  {user?.name || user?.email || "Driver"}!
        </h1>
      </div>

      {user && (
        <div className="d-flex align-items-center gap-3 gap-sm-4 gap-md-5">
          <div className="position-relative" ref={notificationRef}>
            <button
              onClick={toggleNotifications}
              className="notification-btn btn p-2 rounded-circle position-relative border-0"
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell size={20} className="text-white" />
              {notifications.filter((n) => n.unread).length > 0 && (
                <span className="notification-badge position-absolute top-0 end-0 bg-warning rounded-circle" />
              )}
            </button>

            {showNotifications && (
              <div
                className="dropdown-menu-custom notification-panel position-absolute end-0 mt-2 rounded shadow-lg z-50"
                style={{ display: "block" }}
              >
                <div className="dropdown-header p-3 d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Notifications</span>
                  <span className="badge bg-light text-dark">{notifications.length}</span>
                </div>

                <div className="overflow-auto" style={{ maxHeight: "320px" }}>
                  {isLoading ? (
                    <div className="p-3 text-center text-muted">Loading notifications...</div>
                  ) : error ? (
                    <div className="p-3 text-danger text-center">{error}</div>
                  ) : notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`notification-item p-3 d-flex justify-content-between align-items-center border-bottom ${
                          notif.unread ? "unread" : ""
                        }`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="flex-grow-1 min-w-0 me-3">
                          <div className="d-flex align-items-center mb-1">
                            <span className="me-2 fs-5">{getNotificationIcon(notif.type)}</span>
                            <p className="text-dark fw-medium mb-0 text-truncate">{notif.message}</p>
                          </div>
                          <p className="text-muted small mb-0">{notif.time}</p>
                        </div>
                        <button
                          onClick={(e) => clearNotification(notif.id, e)}
                          className="clear-btn btn btn-sm text-muted hover-text-danger p-1"
                          aria-label={`Clear notification: ${notif.message}`}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted">
                      <Bell size={48} className="mb-2 text-muted" />
                      <p className="mb-0">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="position-relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="profile-btn btn d-flex align-items-center gap-2 px-3 py-2 rounded-pill border-0"
              aria-expanded={menuOpen}
            >
              <ChevronDown
                size={18}
                className={`text-white transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div
                className="dropdown-menu-custom position-absolute end-0 mt-2 rounded shadow-lg z-50"
                style={{ display: "block" }}
              >
                <div className="dropdown-header p-3">
                  <p className="fw-bold mb-1 text-truncate">{user.name || user.email || "Driver"}</p>
                  <p className="small opacity-90 mb-0">Safari Driver</p>
                </div>

                <button
                  onClick={handleProfileClick}
                  className="dropdown-item-custom d-flex align-items-center w-100 border-0 bg-transparent text-start"
                >
                  <User size={18} className="me-2" />
                  Profile
                </button>

                <button
                  onClick={handleSettingsClick}
                  className="dropdown-item-custom d-flex align-items-center w-100 border-0 bg-transparent text-start"
                >
                  <Settings size={18} className="me-2" />
                  Settings
                </button>

                <div className="dropdown-divider my-1"></div>

                <button
                  onClick={handleLogout}
                  className="dropdown-item-custom d-flex align-items-center w-100 border-0 bg-transparent text-start text-danger"
                >
                  <LogOut size={18} className="me-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}