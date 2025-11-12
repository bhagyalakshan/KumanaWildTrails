import React, { useEffect, useRef, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import WhatsAppButton from "./WhatsAppButton";
import "./Header.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect"; // <-- Import isMobile
import AuthModal from "./AuthModel";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const collapseRef = useRef();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (collapseRef.current && !collapseRef.current.contains(event.target)) {
        setShowMobileDropdown(false);
        setExpanded(false); // collapse navbar on outside click
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openLoginModal = () => {
    setIsLoginView(true);
    setShowAuthModal(true);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const openSignupModal = () => {
    setIsLoginView(false);
    setShowAuthModal(true);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const isActive = (path) => location.pathname === path;

  const renderNavLink = (to, label) => (
    <Nav.Link
      as={Link}
      to={to}
      className="nav-item-with-dot"
      onClick={() => {
        setShowMobileDropdown(false);
        setExpanded(false); // collapse navbar when clicking nav link
      }}
    >
      {label}
      {isActive(to) && <span className="active-dot" />}
    </Nav.Link>
  );

  const titleClass = isMobile
    ? "text-success head small-head"
    : "text-success head";

  return (
    <>
      <Navbar
        expand="lg"
        sticky="top"
        expanded={expanded}
        onToggle={setExpanded}
        className={`blur-background shadow-sm rounded-pill mx-3 mt-2 px-3 header-nav ${
          scrolled ? "scrolled" : ""
        }`}
      >
        <Container fluid className="p-0">
          {/* Small Devices */}
          <div className="d-flex d-lg-none justify-content-between align-items-center w-100 px-2">
            <div className="d-flex align-items-center">
              <img
                alt="Kumana Logo"
                src="/assets/logo.png"
                height={scrolled ? "50" : "70"}
                className="d-inline-block align-top me-2 transition-all"
              />
              
            </div>
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className="border-0"
              style={{ boxShadow: "none" }}
            />
          </div>

          {/* Large Devices */}
          <div className="d-none d-lg-flex w-100 align-items-center justify-content-between">
            <Navbar.Brand href="/" className="d-flex align-items-center">
              <img
                alt="Kumana Logo"
                src="/assets/logo.png"
                height={scrolled ? "50" : "70"}
                className="d-inline-block align-top me-2 transition-all"
              />
              <span className={titleClass}>KUMANA WILD TRAILS</span>
            </Navbar.Brand>
          </div>

          <Navbar.Collapse id="basic-navbar-nav" ref={collapseRef}>
            <Nav className="ms-auto align-items-center nav-gap">
              {renderNavLink("/", "Home")}

              {/* Desktop Dropdown */}
              <div className="d-none d-lg-block nav-item dropdown nav-item-with-dot">
                <span
                  className="nav-link dropdown-toggle"
                  id="desktopDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Safari Tours & Taxiservices
                </span>
                <ul className="dropdown-menu" aria-labelledby="desktopDropdown">
                  <li>
                    <Link className="dropdown-item" to="/PackageList">
                      Safari Tours
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/Taxi">
                      Taxi Services
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/Activities">
                      Activities
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Mobile Dropdown Toggle */}
              <div className="d-lg-none">
                <span
                  className="nav-link"
                  onClick={() => setShowMobileDropdown(!showMobileDropdown)}
                >
                  Safari Tours & Taxiservices ▾
                </span>
              </div>

              {renderNavLink("/Blog", "Blog")}
              {renderNavLink("/AboutUs", "About Us")}
              {renderNavLink("/ContactUs", "Contact Us")}

              <Nav.Link
                className="ms-2 nav-item-with-dot"
                onClick={openLoginModal} // ✅ call your modal function here
              >
                <FontAwesomeIcon
                  icon={faUser}
                  size="lg"
                  className="cursor-pointer" // makes the cursor a pointer on hover
                />
                {isActive("/login") && <span className="active-dot" />}
              </Nav.Link>

              <WhatsAppButton scrolled={scrolled} />
            </Nav>

            {showMobileDropdown && (
              <div className="mobile-popup-dropdown">
                <Link
                  to="/PackageList"
                  className="dropdown-link"
                  onClick={() => {
                    setShowMobileDropdown(false);
                    setExpanded(false);
                  }}
                >
                  Safari Tours
                </Link>
                <Link
                  to="/Taxi"
                  className="dropdown-link"
                  onClick={() => {
                    setShowMobileDropdown(false);
                    setExpanded(false);
                  }}
                >
                  Taxi Services
                </Link>
                <Link
                  to="/Activities"
                  className="dropdown-link"
                  onClick={() => {
                    setShowMobileDropdown(false);
                    setExpanded(false);
                  }}
                >
                  Activities
                </Link>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          isLogin={isLoginView}
          switchToLogin={() => setIsLoginView(true)}
          switchToSignup={() => setIsLoginView(false)}
        />
      )}
    </>
  );
};

export default Header;
