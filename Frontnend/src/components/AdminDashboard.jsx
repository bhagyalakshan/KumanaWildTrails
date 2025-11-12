import { useState, useEffect } from "react";
import { lazy, Suspense } from "react";
import Sidebar from "../components/adminDashboard/Sidebar";
import Header from "../components/adminDashboard/Header";
import StatsCard from "../components/adminDashboard/StatsCard";
import MapView from "../components/adminDashboard/MapView";
import BookingItem from "../components/adminDashboard/BookingItem";
const ReviewsTable = lazy(() =>
  import("../components/adminDashboard/ReviewsTable")
);
import LoyaltyControl from "../components/adminDashboard/LoyaltyControl";
const SightingSummary = lazy(() => import("./adminDashboard/SightingSummary"));
import { Card } from "../components/ui/adminDashboard-ui/card";
import { Badge } from "react-bootstrap";

import { Button } from "react-bootstrap";
import {
  CalendarClockIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faUserPlus,
  faEdit,
  faEnvelopeOpenText,
  faBlog,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import Todaystatard from "../components/adminDashboard/Todaystatcard";
import "../components/adminDashboard/custom-css/admindashboard.css";

const token = localStorage.getItem("token");

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);
  const adminActions = [
    {
      label: "Check Bookings",
      path: "/AdminDashboard/CheckBookings",
      icon: faClipboardList,
      color: "#0d6efd",
    }, // blue
    {
      label: "Add Driver",
      path: "/AdminDashboard/AddDriver",
      icon: faUserPlus,
      color: "#198754",
    }, // green
    {
      label: "Edit Package Details",
      path: "/AdminDashboard/EditPackages",
      icon: faEdit,
      color: "#ffc107",
    }, // yellow
    {
      label: "View Contact Messages",
      path: "/AdminDashboard/ViewMessages",
      icon: faEnvelopeOpenText,
      color: "#fd7e14",
    }, // orange
    {
      label: "Admin Blog Add",
      path: "/AdminDashboard/BlogAdd",
      icon: faBlog,
      color: "#6f42c1",
    }, // purple
    {
      label: "Stats",
      path: "/AdminDashboard/Stats",
      icon: faChartBar,
      color: "#dc3545",
    }, // red
  ];

  const MOCK_TODAYS_SAFARIS = [
    {
      id: "TS1",
      time: "06:30 AM",
      guide: "Ajith",
      guests: 6,
      status: "in-progress",
    },
    {
      id: "TS2",
      time: "07:00 AM",
      guide: "Kumar",
      guests: 4,
      status: "in-progress",
    },
    {
      id: "TS3",
      time: "08:30 AM",
      guide: "Malik",
      guests: 2,
      status: "starting-soon",
    },
    {
      id: "TS4",
      time: "09:30 AM",
      guide: "Saman",
      guests: 8,
      status: "starting-soon",
    },
    {
      id: "TS5",
      time: "03:30 PM",
      guide: "Nuwan",
      guests: 5,
      status: "scheduled",
    },
  ];

  const MOCK_BOOKINGS = [
    {
      id: "B1",
      customerName: "John Davis",
      date: "May 27, 2025",
      time: "06:30 AM",
      persons: 4,
      status: "pending",
      package: "Morning Safari",
    },
    {
      id: "B2",
      customerName: "Maria Garcia",
      date: "May 27, 2025",
      time: "03:30 PM",
      persons: 2,
      status: "driver_accepted",
      package: "Afternoon Safari",
    },
    {
      id: "B3",
      customerName: "Robert Wilson",
      date: "May 28, 2025",
      time: "06:00 AM",
      persons: 6,
      status: "pending",
      package: "Full Day Safari",
    },
  ];

  return (
    <div className="d-flex vh-100 bg-light overflow-hidden">
      {/* <Sidebar /> */}

      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <Header
          title="Dashboard"
          breadcrumbs={["Home", "Dashboard"]}
          adminName={admin?.name}
        />
        {/* Admin Navigation Row */}
        <div className="admin-nav-row d-flex flex-wrap justify-content-center gap-2 mb-3 p-2 border-bottom bg-light">
          {adminActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => (window.location.href = action.path)}
              className="admin-nav-btn d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: action.color,
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                minWidth: "160px", // default desktop width
                height: "50px",
                padding: "0 14px",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
            >
              <FontAwesomeIcon
                icon={action.icon}
                style={{ fontSize: "1.2rem" }}
              />
              <span className="ms-2 d-none d-md-inline">{action.label}</span>
            </button>
          ))}
        </div>

        <main className="flex-grow-1 overflow-y-auto p-4">
          {/* Welcome Section */}
          <div className="card mb-4 shadow">
            <div className="card-body">
              <h2 className="card-title h4">
                Welcome, {admin?.name || "Admin"}!
              </h2>
              <p className="card-text text-muted">
                Manage your wildlife safari operations efficiently from this
                dashboard.
              </p>
            </div>
          </div>

          <div className="mb-4">
            {/* Overview Section */}
            <section id="overview" className="mb-4">
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="map-view-container">
                    <MapView />
                  </div>
                </div>
                <Todaystatard />
              </div>
            </section>

            {/* Reviews and Loyalty */}
            <div className="row g-4 mt-4">
              <div className="col-lg-8">
                {token ? (
                  <Suspense fallback={<div>Loading reviews...</div>}>
                    <ReviewsTable />
                  </Suspense>
                ) : (
                  <div>Checking login status...</div>
                )}
              </div>
              <div className="col-lg-4">
                <LoyaltyControl />
              </div>
            </div>

            {/* Driver Management Section */}

            {/* Sighting Summary */}
            <section id="summary" className="mt-4">
              <Suspense fallback={<div>Loading summary...</div>}>
                <SightingSummary />
              </Suspense>
            </section>
          </div>
        </main>
        <style>
          {`
    /* Mobile devices (<768px) */
    /* Mobile devices (<768px) */
@media (max-width: 767px) {
  .admin-nav-row {
    flex-wrap: nowrap !important;      /* keep buttons in single row */
    justify-content: flex-start !important;
    gap: 8px !important;               /* small gap */
    overflow-x: auto;                  /* allow horizontal scroll */
    padding: 6px 4px !important;      /* adjust top/bottom padding */
    align-items: stretch !important; 
    height: 780px;  /* make buttons full height */
  }

  .admin-nav-btn {
    min-width: 50px;                  /* maintain compact width */
    max-width: 50px;
    height: 100%;                      /* full height of parent row */
    padding: 0;
    border-radius: 6px;
    flex-shrink: 0;                    /* prevent shrinking */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .admin-nav-btn span {
    display: none;                     /* hide text on small screens */
  }
}

  `}
        </style>
      </div>
    </div>
  );
};

export default AdminDashboard;
