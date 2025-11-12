import React from "react";
import Avatar from "react-avatar";
import { getAuth, signOut } from "firebase/auth";

export default function Header({ user, onLogout }) {
  async function handleLogoutClick() {
    const auth = getAuth();
    try {
      await signOut(auth);

      localStorage.removeItem("user");
      if (onLogout) {
        onLogout();
      }
      window.location.href = "/"; 
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <header className="w-100 d-flex justify-content-between align-items-center py-3 px-4 bg-light shadow-sm">
      <div className="d-flex align-items-center">
        {/* Logo */}
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="me-3"
          style={{ width: "auto", height: "48px", maxWidth: "150px" }}
        />
        <div>
          <h5 className="mb-0 text-success">Welcome, {user?.name || "Guest"}</h5>
          <div className="text-muted small">{user?.email || "you@domain.com"}</div>
        </div>
      </div>

      <div className="d-flex align-items-center">
        {/* Avatar from react-avatar */}
        <Avatar
          name={user?.name || "Guest"}
          src={user?.avatar || undefined}
          size="48"
          round={true}
          className="me-3 border"
        />
        <button
          className="btn btn-outline-success btn-sm"
          onClick={handleLogoutClick}
          title="Logout"
        >
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </header>
  );
}
