import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";
import "./custom-css/booking-calender.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { jwtDecode } from "jwt-decode"; // Try this first

export default function DriverBookingCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [bookingsByDate, setBookingsByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDriverId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const decoded = jwtDecode(token); // Use named import
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem("token");
        return null;
      }
      return decoded.id || decoded.sub || decoded.driverId;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const driverId = getDriverId();
        if (!driverId) throw new Error("Driver ID not found in token");

        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
        const token = localStorage.getItem("token");
        const res = await fetch(`${backendUrl}/api/driver/booking/all/${driverId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch bookings: ${res.status}`);

        const data = await res.json();
        const grouped = data.reduce((acc, b) => {
          // Parse the date in local timezone to avoid off-by-one errors
          const safariDate = new Date(b.safariDate);
          const year = safariDate.getFullYear();
          const month = String(safariDate.getMonth() + 1).padStart(2, '0');
          const day = String(safariDate.getDate()).padStart(2, '0');
          const key = `${year}-${month}-${day}`;
          if (!acc[key]) acc[key] = [];
          acc[key].push(b);
          return acc;
        }, {});
        setBookingsByDate(grouped);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const showDetails = (date) => {
    // Use local date string to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${day}`;
    const selected = bookingsByDate[key] || [];
    setSelectedDate({ date: key, bookings: selected });
  };

  const tileClassName = ({ date, view }) => {
    // Use local date string to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    if (view === "month" && bookingsByDate[dateStr]) {
      return "border-bottom border-4 border-success";
    }
    return "";
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-muted" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-danger">{error}</div>;
  }

  return (
    <div className="p-4 background rounded w-100">
      <div className="mb-4">
        <h4 className=" fw-bold text-dark mb-2">Booking Calendar</h4>
      </div>

      <div className="d-flex flex-column flex-lg-row gap-4">
        <div className="w-100 w-lg-66">
          <div className="bg-white rounded p-3 shadow-sm">
            <Calendar
              onClickDay={showDetails}
              tileClassName={tileClassName}
              value={selectedDate ? new Date(selectedDate.date) : new Date()}
              onActiveStartDateChange={({ activeStartDate }) =>
                setActiveStartDate(activeStartDate)
              }
              activeStartDate={activeStartDate}
              prevLabel={<FaChevronLeft className="text-muted" />}
              nextLabel={<FaChevronRight className="text-muted" />}
              prev2Label={null}
              next2Label={null}
              className="w-100"
            />
          </div>
        </div>

        <div className="w-100 w-lg-33 bg-light rounded p-3 shadow-sm">
          <h3 className="fs-5 fw-semibold text-dark mb-3 border-bottom pb-2">
            {selectedDate?.date
              ? `Bookings on ${selectedDate.date}`
              : "Select a date to view bookings"}
          </h3>

          {selectedDate?.bookings?.length ? (
            <div className="d-flex flex-column gap-3 max-h-400px overflow-auto">
              {new Date(selectedDate.date) < new Date() && (
                <div className="alert alert-warning py-2 small">
                  ⚠️ This date is in the past. These bookings are for reference only.
                </div>
              )}
              {selectedDate.bookings.map((b, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded border shadow-sm"
                >
                  <h4 className="fw-bold text-dark">{b.safariPackageName}</h4>
                  <div className="text-muted small">
                    <span className="fw-medium">Guest:</span> {b.guestName} ({b.guestPhone})
                  </div>
                  <div className="text-muted small">
                    <span className="fw-medium">Pickup:</span> {b.pickupLocation}
                  </div>
                  <div className="text-muted small">
                    <span className="fw-medium">Adults:</span> {b.numAdults}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-3 rounded text-center text-muted">
              {selectedDate?.date
                ? "No bookings on this date"
                : "Click on any marked date to view bookings"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}