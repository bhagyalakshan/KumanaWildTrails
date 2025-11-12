import React, { useState, useEffect } from "react";
import AddDriverForm from "./AddDriverForm";
import "bootstrap/dist/css/bootstrap.min.css";

const Admin_Add_Driver = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDriverData, setEditDriverData] = useState({});
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchDrivers = () => {
    fetch("http://localhost:8080/api/drivers")
      .then((res) => res.json())
      .then((data) => setDrivers(data))
      .catch((err) => console.error("Error fetching drivers:", err));
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleDeleteDriver = (id) => {
    fetch(`http://localhost:8080/api/drivers/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        showAlert("Driver deleted!", "success");
        setSelectedDriver(null);
        setShowDeleteConfirm(false);
        fetchDrivers();
      })
      .catch((err) => {
        console.error("Error deleting driver:", err);
        showAlert("Error deleting driver", "danger");
        setShowDeleteConfirm(false);
      });
  };

  const handleEditClick = () => {
    setEditDriverData({ ...selectedDriver });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDriverData({ ...editDriverData, [name]: value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8080/api/drivers/${editDriverData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editDriverData),
    })
      .then((res) => res.json())
      .then(() => {
        showAlert("Driver updated successfully!", "success");
        setIsEditing(false);
        setSelectedDriver(null);
        fetchDrivers();
      })
      .catch((err) => {
        console.error("Error updating driver:", err);
        showAlert("Error updating driver", "danger");
      });
  };

  const showAlert = (message, type) => {
    setAlertMsg(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMsg(null);
    }, 3000);
  };

  const groupedDrivers = drivers.reduce((groups, driver) => {
    const type = driver.vehicleType || "Other";
    if (!groups[type]) groups[type] = [];
    groups[type].push(driver);
    return groups;
  }, {});

  return (
    <div
      style={{
        backgroundImage: 'url("/admin.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "#ffffff",
        paddingBottom: "2rem",
        padding: "20px",
      }}
    >
      {alertMsg && (
        <div className={`alert alert-${alertType} text-center`} role="alert">
          {alertMsg}
        </div>
      )}

      {/* Form Section */}
      <div
        className="mb-5 mt-5 rounded"
        style={{
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
          padding: "10px 20px",
          width: "100%",
          backgroundColor: "#0f1626",
        }}
      >
        <h2 className="mb-4 text-light mt-4" style={{color: '#f8f9fa'}}>Drivers Adding Section</h2>
        <AddDriverForm showAlert={showAlert} />
      </div>

      {/* Driver Details Section */}
      <div
        className="p-3 mt-5 rounded"
        style={{
          
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
        }}
      >
        <h3 className="mb-4  text-center mb-5" style={{color: '#f8f9fa'}}>Driver Details (by Vehicle Type)</h3>

        <div className="row">
          {Object.keys(groupedDrivers).map((vehicleType, index) => (
            <div key={vehicleType} className="col-md-6 mb-4">
              <div
                className="p-3 rounded"
                style={{
                  
                  backgroundColor: "#1c2230",
                  height: "100%",
                }}
              >
                <h4 className="text-warning mb-3 text-center">{vehicleType}</h4>

                <div className="row g-4">
                  {groupedDrivers[vehicleType].map((driver) => (
                    <div key={driver.id} className="col-12 col-sm-6">
                      <div
                        className="d-flex flex-column align-items-center p-3 rounded text-center"
                        style={{
                          backgroundColor: "#2a2e39",
                          
                          height: "100%",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "36px",
                            color: "#00bfff",
                            marginBottom: "10px",
                          }}
                        >
                          <i className="bi bi-person-circle"></i>
                        </div>

                        <h5 className="text-light mb-2">{driver.name}</h5>
                        <p className="text-light mb-1" style={{ fontSize: "14px" }}>
                          📞 {driver.phoneNumber}
                        </p>
                        <p className="text-light mb-2" style={{ fontSize: "14px" }}>
                          🏠 {driver.address}
                        </p>

                        <button
                          className="btn btn-outline-info mt-auto"
                          onClick={() => {
                            setSelectedDriver(driver);
                            setIsEditing(false);
                            setShowDeleteConfirm(false);
                          }}
                        >
                          View Driver
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Driver View/Edit Modal */}
      {selectedDriver && (
        <div
          style={{
            position: "fixed",
            top: "5%",
            left: "5%",
            width: "90%",
            height: "90%",
            backgroundColor: "#1c2230",
            color: "#f5f5f5",
            border: "2px solid #00bfff",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(0,191,255,0.3)",
            padding: "20px",
            overflowY: "auto",
            zIndex: 9999,
          }}
        >
          <button
            onClick={() => setSelectedDriver(null)}
            style={{
              position: "absolute",
              top: "10px",
              right: "20px",
              backgroundColor: "transparent",
              border: "none",
              color: "#f5f5f5",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            &times;
          </button>

          <h2 className="mb-4">Driver Details</h2>

          {!isEditing ? (
            <>
              <p><strong>Name:</strong> {selectedDriver.name}</p>
              <p><strong>License Number:</strong> {selectedDriver.licenseNumber}</p>
              <p><strong>Phone Number:</strong> {selectedDriver.phoneNumber}</p>
              <p><strong>Email:</strong> {selectedDriver.email}</p>
              <p><strong>Address:</strong> {selectedDriver.address}</p>
              <p><strong>Vehicle Type:</strong> {selectedDriver.vehicleType}</p>
              <p><strong>Vehicle Number:</strong> {selectedDriver.vehicleNumber}</p>
              <p><strong>Status:</strong> {selectedDriver.status}</p>

              <div className="mt-4 d-flex flex-column align-items-center gap-3">
                <div className="d-flex gap-3">
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "#00bfff",
                      color: "#000",
                      fontWeight: "bold",
                      padding: "12px 36px",
                      borderRadius: "8px",
                      fontSize: "1.1rem",
                      border: "none",
                    }}
                    onClick={handleEditClick}
                  >
                    Edit Driver
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Driver
                  </button>
                </div>

                {showDeleteConfirm && (
                  <div
                    className="mt-4 p-3 rounded text-center"
                    style={{
                      border: "1px solid #ff4d4d",
                      backgroundColor: "#2a2a2a",
                      width: "100%",
                      maxWidth: "500px",
                    }}
                  >
                    <p>
                      Are you sure you want to delete{" "}
                      <strong>{selectedDriver.name}</strong>?
                    </p>
                    <div className="d-flex justify-content-center gap-3 mt-3">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteDriver(selectedDriver.id)}
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <form onSubmit={handleEditSubmit}>
              <div className="row g-3">
                {[
                  { label: "Name", name: "name" },
                  { label: "License Number", name: "licenseNumber" },
                  { label: "Phone Number", name: "phoneNumber" },
                  { label: "Email", name: "email" },
                  { label: "Address", name: "address" },
                  { label: "Vehicle Number", name: "vehicleNumber" },
                  { label: "Status", name: "status" },
                ].map((field) => (
                  <div className="col-md-6" key={field.name}>
                    <label className="text-light">{field.label}:</label>
                    <input
                      type="text"
                      name={field.name}
                      value={editDriverData[field.name] || ""}
                      onChange={handleEditChange}
                      className="form-control"
                      style={{
                        backgroundColor: "white",
                        color: "#000",
                        border: "1px solid #555",
                      }}
                      required
                    />
                  </div>
                ))}

                <div className="col-md-6">
                  <label className="text-light">Vehicle Type:</label>
                  <select
                    name="vehicleType"
                    value={editDriverData.vehicleType || ""}
                    onChange={handleEditChange}
                    className="form-control"
                    style={{
                      backgroundColor: "white",
                      color: "#000",
                      border: "1px solid #555",
                    }}
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="Mahindra Normal Jeep">Mahindra Normal Jeep</option>
                    <option value="Mahindra 4x4 Jeep">Mahindra 4x4 Jeep</option>
                    <option value="Other 4x4 Jeep">Other 4x4 Jeep</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 d-flex justify-content-center gap-3">
                <button
                  type="submit"
                  className="btn"
                  style={{
                    backgroundColor: "#00bfff",
                    color: "#000",
                    fontWeight: "bold",
                    padding: "12px 36px",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    border: "none",
                  }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin_Add_Driver;
