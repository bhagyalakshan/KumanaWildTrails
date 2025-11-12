import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Badge } from "react-bootstrap";
import { Bell as BellIcon, LogOut as LogOutIcon, User as UserIcon } from "lucide-react";

const Header = ({ adminName }) => {
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="bg-light border-bottom px-4 py-3 mt-3">
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        {/* Left: Admin Dashboard Title */}
        <div>
          <h1 className="fw-bold mb-0 admin-dashboard-title">
            Admin Dashboard
          </h1>
        </div>

        {/* Right: Notifications, Avatar, Logout */}
        <div className="d-flex align-items-center gap-3 mt-2 mt-md-0">
          {/* Notifications */}
          <div className="position-relative">
            <Button variant="link" className="p-0">
              <BellIcon size={20} />
              {notifications > 0 && (
                <Badge
                  bg="danger"
                  className="position-absolute top-0 end-0 d-flex align-items-center justify-content-center"
                  style={{ width: "20px", height: "20px", fontSize: "0.7rem" }}
                >
                  {notifications}
                </Badge>
              )}
            </Button>
          </div>

          {/* Avatar */}
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
            >
              <UserIcon size={20} />
            </div>
            <div className="d-none d-md-block">
              <p className="small fw-medium mb-0">{adminName || "Park Admin"}</p>
              <p className="small text-muted mb-0">admin@kumanapark.com</p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="link"
            className="p-0"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOutIcon size={20} />
          </Button>
        </div>
      </div>

      <style>
        {`
          .admin-dashboard-title {
            font-size: 1.3rem;
          }

          @media (min-width: 576px) {
            .admin-dashboard-title {
              font-size: 1.5rem;
            }
          }

          @media (min-width: 768px) {
            .admin-dashboard-title {
              font-size: 1.75rem;
            }
          }

          @media (min-width: 1200px) {
            .admin-dashboard-title {
              font-size: 2rem;
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;
