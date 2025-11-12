import { useEffect, useState } from "react";
import { X, User, Car, Star, MapPin, Clock } from "lucide-react";
import './custom-css/driver-profile-sidebar.css'; 

export default function DriverProfileSidebar({ isOpen, onClose, user }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [driverData, setDriverData] = useState({
    photo: "https://www.pngkey.com/png/detail/349-3499617_person-placeholder-person-placeholder.png",
    isAvailable: "not_available",
    vehicleType: "",
    seatingCapacity: 0,
  });

  useEffect(() => {
    if (!isOpen) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found");
      return;
    }

    fetch(`${backendUrl}/api/driver/get_loggedin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch driver data");
        return res.json();
      })
      .then((data) => {
        console.log("Driver profile data:", data);
        setDriverData({
          photo: data.photo_url || "https://www.pngkey.com/png/detail/349-3499617_person-placeholder-person-placeholder.png",
          isAvailable: data.isAvailable || "not_available",
          vehicleType: data.vehicle_type || "",
          seatingCapacity: data.seating_capacity || 0,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch driver profile", err);
      });
  }, [isOpen, backendUrl]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with specific class */}
      <div
        className={`profile-sidebar-backdrop ${isOpen ? 'visible' : ''}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Sidebar with specific class */}
      <aside
        className={`driver-profile-sidebar ${isOpen ? 'open' : ''}`}
        aria-labelledby="profile-sidebar-title"
      >
        <div className="profile-header">
          <h2 id="profile-sidebar-title" className="profile-title">
            <User className="icon" /> Driver Profile
          </h2>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Close profile sidebar"
          >
            <X className="close-icon" />
          </button>
        </div>

        <div className="profile-content">
          {/* Profile Header */}
          <div className="profile-avatar-section">
            <div className="avatar-container">
              <img
                src={driverData.photo}
                alt="Driver profile"
                className="profile-avatar"
                onError={(e) => {
                  e.target.src = "https://www.pngkey.com/png/detail/349-3499617_person-placeholder-person-placeholder.png";
                }}
              />
              <span className={`status-indicator ${driverData.isAvailable === "available" ? 'active' : 'inactive'}`}></span>
            </div>
            <h3 className="driver-name">{user?.name || "Unknown Driver"}</h3>
            <p className="driver-email">{user?.email || "No email provided"}</p>
          </div>

          {/* Driver Stats */}
          <div className="driver-stats">
            <h3 className="stats-title">
              <Star className="icon" /> Driver Stats
            </h3>
            <div className="stats-content">
              <div className="stats-section">
                <p className="stat-label">Rating</p>
                <div className="rating-container">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`star-icon ${
                        i < Math.floor(user?.rating || 4.5) ? "filled" : "empty"
                      }`}
                    />
                  ))}
                  <span className="rating-text">({user?.rating || 4.5}/5)</span>
                </div>
              </div>
              <div className="stats-section">
                <p className="stat-label">Experience</p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min((user?.yearsExperience || 5) * 10, 100)}%` }}
                  />
                </div>
                <p className="experience-text">{user?.yearsExperience || 5} years of experience</p>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="vehicle-info">
            <h3 className="section-title">
              <Car className="icon" /> Vehicle Info
            </h3>
            {driverData.vehicleType ? (
              <p className="vehicle-details">
                {driverData.vehicleType} – {driverData.seatingCapacity || 10} Seater
              </p>
            ) : (
              <p className="no-vehicle">No vehicle details available</p>
            )}
          </div>

          {/* Assigned Safaris */}
          {user?.assignedSafaris?.length > 0 && (
            <div className="assigned-safaris">
              <h3 className="section-title">
                <MapPin className="icon" /> Assigned Safaris
              </h3>
              <ul className="safari-list">
                {user.assignedSafaris.map((safari, index) => (
                  <li key={index} className="safari-item">
                    <MapPin className="safari-icon" />
                    <span>{safari.location} – {safari.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Availability */}
          <div className="availability">
            <h3 className="section-title">
              <Clock className="icon" /> Availability
            </h3>
            <p className={`availability-status ${driverData.isAvailable === "available" ? 'active' : 'not_available'}`}>
              {driverData.isAvailable === "available" ? "🟢 Active and Available" : "🔴 Inactive"}
            </p>
          </div>

          {/* Safari Expertise Tags */}
          {user?.tags?.length > 0 && (
            <div className="expertise">
              <h3 className="section-title">Safari Expertise</h3>
              <div className="expertise-tags">
                {user.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}