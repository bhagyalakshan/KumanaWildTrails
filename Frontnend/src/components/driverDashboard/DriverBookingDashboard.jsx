import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Use named import
import "./custom-css/booking-card.css";
import "bootstrap/dist/css/bootstrap.min.css";

function BookingCard({ booking }) {
  return (
    <div className="card shadow-sm mb-2 bg-light border-secondary-subtle">
      <div className="card-body p-3">
        <h3 className="card-title text-dark mb-2 fw-bold fs-6">
          📅 {booking.bookingDate}
        </h3>
        <p className="text-muted small mb-1">
          <span className="fw-medium">Booking Type:</span> {booking.bookingType}
        </p>
        <p className="text-muted small mb-1">
          <span className="fw-medium">Number of Adults:</span> {booking.numAdults}
        </p>
      </div>
    </div>
  );
}

export default function DriverBookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");
        const decoded = jwtDecode(token); 
        const driverId = decoded.id; 
        if (!driverId) throw new Error("Invalid token: Driver ID not found");
        console.log("Fetching bookings for driver ID:", driverId);
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
        const res = await fetch(`${backendUrl}/api/driver/booking/${driverId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch bookings: ${res.status}`);
        }

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="text-center py-4 text-muted">Loading bookings...</div>;
  if (error) return <div className="text-center py-4 text-danger">{error}</div>;

  return (
    <div className="p-3">
      <div className="container-fluid px-0 bookingcard">
        <h1 className="fs-4 fw-bold text-dark mb-3">My Assigned Bookings</h1>
        {bookings.length === 0 ? (
          <div className="text-center py-4 text-muted small">
            No assigned bookings to show.
          </div>
        ) : (
          <div className="border rounded overflow-auto p-2 booking-list-container">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}