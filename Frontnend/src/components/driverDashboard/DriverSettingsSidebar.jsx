import { useState, useEffect } from "react";
import { X, Palette, Clock } from "lucide-react";
import toast from "react-hot-toast";
import "./custom-css/driver-settings-sidebar.css";

export default function DriverSettingsSidebar({ isOpen, onClose }) {
  const [isAvailable, setIsAvailable] = useState("not_available");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [vehicleType, setVehicleType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isOpen || !token) {
      if (!token) {
        console.warn("No token found in localStorage");
        toast.error("Authentication token missing. Please log in again.");
      }
      return;
    }

    const fetchDriverData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/driver/get_loggedin`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `Failed to fetch driver data: ${response.status} ${text}`
          );
        }

        const data = await response.json();
        console.log("Fetched driver data:", data);

        if (data.isAvailable) setIsAvailable(data.isAvailable);
        if (data.vehicle_type) setVehicleType(data.vehicle_type);
      } catch (err) {
        console.error("Failed to fetch driver profile:", err.message);
        toast.error("Failed to load driver profile. Please try again.");
      }
    };

    fetchDriverData();
  }, [isOpen, backendUrl, token]);

  const validatePassword = () => {
    if (password && password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (password && !validatePassword()) {
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    setIsLoading(true);
    try {
      // Prepare the update payload
      const updatePayload = {
        isAvailable,
        vehicle_type: vehicleType,
      };

      // Only include password fields if password is provided
      if (password && confirmPassword) {
        updatePayload.newPassword = password;
        updatePayload.confirmPassword = confirmPassword;
      }

      console.log("Sending update payload:", updatePayload);

      const response = await fetch(`${backendUrl}/api/driver/update/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Update failed: ${response.status} - ${errorText}`);
      }

      // Try to parse response as JSON, fallback to text if needed
      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      console.log("Update successful:", result);

      toast.success("Settings updated successfully!");
      setShowConfirmModal(false);
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
      onClose();
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error(
        err.message || "An error occurred while saving your settings."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setPasswordError("");
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? "visible" : ""}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`driver-settings-sidebar ${isOpen ? "open" : ""}`}
        aria-labelledby="settings-sidebar-title"
      >
        <div className="sidebar-header">
          <h2 id="settings-sidebar-title" className="sidebar-title">
            <Palette className="icon" /> Driver Settings
          </h2>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Close settings sidebar"
            disabled={isLoading}
          >
            <X className="close-icon" />
          </button>
        </div>

        <form className="settings-form" onSubmit={handleSaveChanges}>
          {/* Availability / Status */}
          <div className="settings-section">
            <h3>
              <Clock className="icon" /> Availability
            </h3>
            <label className="checkbox-container">
              <input
                type="checkbox"
                className="checkbox-custom"
                checked={isAvailable === "available"}
                onChange={(e) =>
                  setIsAvailable(
                    e.target.checked ? "available" : "not_available"
                  )
                }
                disabled={isLoading}
              />
              <span className="checkbox-label">Available for Safaris</span>
            </label>
          </div>

          {/* Vehicle Info */}
          <div className="settings-section">
            <h3>Update Vehicle Info</h3>
            <label className="form-label">Vehicle Type</label>
            <input
              type="text"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="form-control-custom"
              placeholder="e.g., Jeep, Land Cruiser, Safari Van"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="settings-section">
            <h3>Change Password</h3>
            <div className="password-fields">
              <div className="field-group">
                <label className="form-label">New Password (optional)</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control-custom"
                  disabled={isLoading}
                />
              </div>
              <div className="field-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control-custom"
                  disabled={isLoading}
                />
              </div>
              {passwordError && (
                <div className="error-message">{passwordError}</div>
              )}
              {password && !passwordError && (
                <div className="success-message">
                  ✓ Password will be updated
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </aside>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="confirmation-modal-overlay" onClick={handleCancel}>
          <div
            className="confirmation-modal-content"
            onClick={handleModalClick}
          >
            <h3>Confirm Changes</h3>
            <p>Are you sure you want to save these settings?</p>

            <div className="changes-summary">
              <div className="change-item">
                <strong>Availability:</strong>{" "}
                {isAvailable === "available" ? "Available" : "not_vailable"}
              </div>
              <div className="change-item">
                <strong>Vehicle Type:</strong> {vehicleType || "Not specified"}
              </div>
              {password && (
                <div className="change-item">
                  <strong>Password:</strong> Will be updated
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                disabled={isLoading}
                className="confirm-button"
              >
                {isLoading ? "Saving..." : "Confirm Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
