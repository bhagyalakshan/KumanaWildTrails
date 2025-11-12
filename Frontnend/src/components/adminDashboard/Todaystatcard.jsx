import React, { useState, useEffect } from "react";
import { Badge, Button } from "react-bootstrap";

const token = localStorage.getItem("token"); 
const Todaystatard = () => {
  const [safaris, setSafaris] = useState([]);
  const [quickStats, setQuickStats] = useState({
    activeDrivers: 8,
    vehicles: 12,
    sightings: 47,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodayStats = async () => {
      try {
        const token = localStorage.getItem("token"); 
        if (!token) {
          throw new Error("No authentication token found");
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080"; // Fallback URL
        const response = await fetch(`${backendUrl}/api/admin/todaystat`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setSafaris(data.safaris || []);
        setQuickStats(data.quickStats || quickStats); // Use API data or fallback to default
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTodayStats();
  }, []);

  if (loading) {
    return (
      <div className="col-lg-4">
        <div className="card h-100" style={{ maxHeight: "550px" }}>
          <div className="card-header">
            <h5 className="card-title mb-0">Today's Safaris</h5>
            <small className="text-muted">Scheduled safari trips for today</small>
          </div>
          <div className="card-body text-center">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-lg-4">
        <div className="card h-100" style={{ maxHeight: "550px" }}>
          <div className="card-header">
            <h5 className="card-title mb-0">Today's Safaris</h5>
            <small className="text-muted">Scheduled safari trips for today</small>
          </div>
          <div className="card-body text-center">
            <p className="text-danger">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-lg-4">
      <div className="card h-100" style={{ maxHeight: "550px" }}>
        <div className="card-header">
          <h5 className="card-title mb-0">Today's Safaris</h5>
          <small className="text-muted">Scheduled safari trips for today</small>
        </div>
        <div className="card-body" style={{ overflowY: "auto" }}>
          <div className="mb-3">
            {safaris.length === 0 ? (
              <p className="text-muted">No safaris scheduled today.</p>
            ) : (
              safaris.map((safari) => (
                <div
                  key={safari.id}
                  className="d-flex justify-content-between align-items-center p-2 border rounded mb-2"
                >
                  <div>
                    <div className="d-flex align-items-center">
                      <span className="fw-medium me-2">{safari.time}</span>
                      <span className="text-muted">•</span>
                      <span className="ms-2 small">{safari.guide}</span>
                    </div>
                    <div className="small text-muted">
                      {safari.guests} {safari.guests === 1 ? "guest" : "guests"}
                    </div>
                  </div>
                  <Badge
                    bg={
                      safari.status === "in-progress"
                        ? "success"
                        : safari.status === "starting-soon"
                        ? "primary"
                        : "secondary"
                    }
                  >
                    {safari.status === "in-progress"
                      ? "In Progress"
                      : safari.status === "starting-soon"
                      ? "Starting Soon"
                      : "Scheduled"}
                  </Badge>
                </div>
              ))
            )}
          </div>

          <div className="border-top pt-3">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="text-muted">Quick Stats</h6>
              
            </div>

            <div className="row g-2 mt-2">
              <div className="col-4">
                <div className="border rounded p-2 text-center">
                  <div className="small text-muted">Active Drivers</div>
                  <div className="h5 mb-0">{quickStats.activeDrivers}</div>
                </div>
              </div>
              <div className="col-4">
                <div className="border rounded p-2 text-center">
                  <div className="small text-muted">Vehicles</div>
                  <div className="h5 mb-0">{quickStats.vehicles}</div>
                </div>
              </div>
              <div className="col-4">
                <div className="border rounded p-2 text-center">
                  <div className="small text-muted">Sightings</div>
                  <div className="h5 mb-0">{quickStats.sightings}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todaystatard;