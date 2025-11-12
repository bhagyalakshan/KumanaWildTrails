import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ActivityIcon,
  AlertCircleIcon,
  CalendarCheckIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CoinsIcon,
  HomeIcon,
  LayersIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
} from "lucide-react";

// Reusable SidebarItem component
const SidebarItem = ({ icon, label, to, collapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-link d-flex align-items-center py-2 px-3 mb-1 rounded ${isActive ? "bg-primary text-white" : "text-dark"}`
      }
      aria-current={({ isActive }) => (isActive ? "page" : undefined)}
    >
      {/* Icon */}
      <div>{icon}</div>

      {/* Label (hidden when sidebar is collapsed) */}
      {!collapsed && <span className="ms-2">{label}</span>}
    </NavLink>
  );
};

// Main AdminSidebar component
const AdminSidebar = () => {
  // State to manage sidebar collapse/expand
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`d-flex flex-column h-100 bg-white border-end ${collapsed ? "w-100px" : "w-250px"} fixed-top z-3 transition-all duration-300`}
      style={{ width: collapsed ? '100px' : '250px' }}
      aria-label="Sidebar navigation"
    >
      {/* Top header section */}
      <div className="p-3 d-flex align-items-center justify-content-between border-bottom">
        {/* Brand title (shown only when expanded) */}
        {!collapsed && (
          <div className="d-flex align-items-center">
            <span className="h5 mb-0 fw-bold">Kumana</span>
            <span className="ms-1 fw-medium text-primary">TrailMate</span>
          </div>
        )}

        {/* Collapse/Expand toggle button */}
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "32px", height: "32px" }}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRightIcon size={16} />
          ) : (
            <ChevronLeftIcon size={16} />
          )}
        </button>
      </div>

      {/* Navigation links */}
      <nav className="p-2 flex-grow-1 overflow-auto" aria-label="Main navigation">
        <SidebarItem icon={<HomeIcon size={20} />} label="Overview" to="/admin/dashboard#overview" collapsed={collapsed} />
        <SidebarItem icon={<LayersIcon size={20} />} label="Animal Sightings" to="/admin/dashboard#sightings" collapsed={collapsed} />
        <SidebarItem icon={<CalendarCheckIcon size={20} />} label="Booking Management" to="/admin/dashboard#bookings" collapsed={collapsed} />
        <SidebarItem icon={<StarIcon size={20} />} label="Reviews & Ratings" to="/admin/dashboard#reviews" collapsed={collapsed} />
        <SidebarItem icon={<CoinsIcon size={20} />} label="Loyalty Program" to="/admin/dashboard#loyalty" collapsed={collapsed} />
        <SidebarItem icon={<ChartBarIcon size={20} />} label="Sighting Summary" to="/admin/dashboard#summary" collapsed={collapsed} />
        <SidebarItem icon={<AlertCircleIcon size={20} />} label="SOS Alerts" to="/admin/dashboard#alerts" collapsed={collapsed} />
        <SidebarItem icon={<ActivityIcon size={20} />} label="Analytics" to="/admin/dashboard#analytics" collapsed={collapsed} />
        <SidebarItem icon={<SettingsIcon size={20} />} label="Settings" to="/admin/dashboard#settings" collapsed={collapsed} />
      </nav>

      {/* Search input (at bottom of sidebar) */}
      <div className="p-3 border-top">
        <div className="position-relative">
          <SearchIcon className="position-absolute top-50 translate-middle-y ms-2 text-muted" size={16} />
          <input
            type="text"
            placeholder={collapsed ? "" : "Search..."}
            className="form-control form-control-sm ps-5"
            aria-label="Search"
          />
        </div>
      </div>
    </aside>
  );
};

// Exporting the component
export default AdminSidebar;