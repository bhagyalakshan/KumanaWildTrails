import { useEffect, useMemo, useState } from "react";
import { Calendar, TrendingUp, Clock, Users } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { jwtDecode } from "jwt-decode";

export default function MonthlyBookingStats({
  calendarComponent,
  className = "",
}) {
  const [bookings, setBookings] = useState([]);

  // Extract driverId from JWT
  const getDriverId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const decoded = jwtDecode(token);
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

  // Fetch driver-specific bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const driverId = getDriverId();
        if (!driverId) throw new Error("Driver ID not found in token");

        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${backendUrl}/api/driver/booking/all/${driverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error(`Failed to fetch bookings: ${res.status}`);

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  // Compute monthly stats using safariDate
  const stats = useMemo(() => {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const monthly = bookings.filter((b) => {
      const d = new Date(b.safariDate);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const total = monthly.length;
    const upcoming = monthly.filter(
      (b) => new Date(b.safariDate) >= today
    ).length;
    const past = monthly.filter((b) => new Date(b.safariDate) < today).length;

    return { total, upcoming, past };
  }, [bookings]);

  // Pie chart data
  const pieData = [
    { name: "Upcoming", value: stats.upcoming, color: "#22c55e" },
    { name: "Past", value: stats.past, color: "#ef4444" },
  ];

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );

  return (
    <div
      className={`monthly-stats ${className}`}
      style={{ backgroundColor: "#e2ebf3ff" }} // 👈 inline background color
    >
      <div className="header">
        <TrendingUp size={22} />
        <h2>Monthly Booking Stats</h2>
      </div>

      <div className="stats-grid">
        <StatCard icon={Users} label="Total" value={stats.total} color="blue" />
        <StatCard
          icon={Clock}
          label="Upcoming"
          value={stats.upcoming}
          color="green"
        />
        <StatCard icon={Calendar} label="Past" value={stats.past} color="red" />
      </div>

      {/* Pie Chart Section */}
      <div className="pie-chart-section">
        <h3>Booking Distribution</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Optional Calendar Component */}
      {calendarComponent && (
        <div className="calendar-section">
          <h3>Booking Calendar</h3>
          {calendarComponent}
        </div>
      )}

      <style jsx>{`
        .monthly-stats {
          background: #f8fafc;
          padding: 5px;
          border-radius: 5px;
          box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
          max-width: 1000px;
          margin: none;
        }
        .header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        .stat-card {
          background: white;
          padding: 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #f1f5f9;
        }
        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
        }
        .stat-icon.blue {
          background: #dbeafe;
          color: #1d4ed8;
        }
        .stat-icon.green {
          background: #d1fae5;
          color: #065f46;
        }
        .stat-icon.red {
          background: #fee2e2;
          color: #dc2626;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }
        .stat-label {
          font-size: 13px;
          color: #64748b;
        }

        .pie-chart-section {
          background: white;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #f1f5f9;
          margin-bottom: 16px;
        }
        .pie-chart-section h3 {
          font-size: 16px;
          margin-bottom: 8px;
          color: #1e293b;
        }

        .calendar-section {
          background: white;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #f1f5f9;
        }
        .calendar-section h3 {
          font-size: 16px;
          margin-bottom: 8px;
          color: #1e293b;
        }
      `}</style>
    </div>
  );
}
