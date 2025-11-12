import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";

export default function SiteMap() {
  const routes = [
    { path: "", label: "Home" },
    { path: "", label: "About Us" },
    { path: "", label: "Tour Packages" },
    { path: "", label: "My Bookings" },
    { path: "", label: "Booking Details" },
    { path: "", label: "Driver Dashboard" },
    { path: "", label: "Admin Dashboard" },
    { path: "", label: "Sightings Map" },
    { path: "", label: "Memory Album" },
    { path: "", label: "Blog" },
    { path: "", label: "Contact Us" },
    { path: "", label: "Privacy Policy" },
    { path: "", label: "Cookie Policy" },
    { path: "", label: "Terms & Conditions" },
  ];

  return (
    <>
      {/* Hero Banner */}
      <div className="py-5 text-white text-center" style={{
        background: "linear-gradient(135deg, #fd7e14, #ffc107)",
        clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)"
      }}>
        <h1 className="display-4 fw-bold">Site Map</h1>
        <p className="lead">Quick links to all pages of Kumana WildTrails</p>
      </div>

      {/* Site Map Cards */}
      <Container className="my-5">
        <Row>
          {routes.map((r) => (
            <Col sm={6} md={4} className="mb-3" key={r.path}>
              <Card className="shadow-lg rounded-4 p-3 h-100 border-0">
                <Link to={r.path} className="fw-semibold text-decoration-none text-dark fs-5">
                  {r.label}
                </Link>
                <div className="small text-muted mt-1">{r.path}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
