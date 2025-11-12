import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import TripAdvisorWidget from "./TripAdvisorWidget";

const Footer = () => {
  return (
    <footer className="footer-wrapper px-4">
      <style>{`
        .footer-wrapper {
          background-color: #738678;
          border-top: 10px solid rgb(43, 78, 36);
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: white;
        }

        .footer-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding-left: 20px;
          padding-right: 20px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .tripadvisor-logo {
          max-width: 140px;
          height: auto;
          border-radius: 0;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        }

        .dotted-divider {
          border-top: 2px dotted #ddd;
          opacity: 0.8;
        }

        .footer-top-row .nav-link,
        .footer-top-row a {
          color: white;
          text-decoration: none;
        }

        .footer-top-row .nav-link:hover {
          text-decoration: underline;
          color: #bff0c0;
        }

        @media (max-width: 768px) {
          .text-md-end,
          .text-md-start {
            text-align: center !important;
          }

          .footer-top-row > div,
          .footer-bottom-row > div {
            margin-bottom: 1rem;
            margin-top: 1rem;
          }

          .tripadvisor-logo {
            max-width: 100px;
          }
        }

        .social-icon {
          background-color: #d1f5d3;
          border-radius: 50%;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .social-icon i {
          font-size: 1.25rem;
          color: #0a0a0a;
        }

        .social-icon:hover {
          transform: scale(1.1);
          background-color: #bff0c0;
        }

        .tripadvisor-widget-container {
          max-width: 140px;
          height: auto;
          overflow: hidden;
          margin: 0 auto;
        }

        .tripadvisor-widget-container img {
          max-width: 100%;
          height: auto;
          display: block;
        }

        .footer-logo {
          max-width: 180px;
          height: auto;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .footer-logo:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(43, 78, 36, 0.5);
        }

        .logo-col {
          padding-left: 1.5rem;
        }

        .footer-slogan {
          font-style: italic;
          font-size: 1rem;
          color: white;
          margin-top: 8px;
          text-align: center;
        }

        @media (min-width: 768px) {
          .footer-slogan {
            text-align: left;
          }
        }
      `}</style>

      <Container fluid className="footer-inner px-md-5 d-flex flex-column justify-content-between">
        <Row className="footer-top-row align-items-center text-center text-md-start justify-content-between mt-5 mb-5">
          <Col
            xs={12}
            md={4}
            className="d-flex flex-column justify-content-center justify-content-md-start mb-4 mb-md-0 align-items-center align-items-md-start"
          >
            <img
              src="/assets/logo.png"
              alt="Kumana Wild Trails Logo"
              className="footer-logo"
            />
            <em className="footer-slogan mt-2">
              Experience the wild like never before
            </em>
          </Col>

          <Col
            xs={12}
            md={4}
            className="d-flex justify-content-center align-items-center mb-4 mb-md-0"
          >
            <div id="ta-widget-container" className="tripadvisor-widget-container">
              <TripAdvisorWidget />
            </div>
          </Col>

          <Col
            xs={12}
            md={4}
            className="d-flex flex-column align-items-center align-items-md-end justify-content-center"
          >
            <Nav className="flex-column text-center text-md-end gap-1">
              <Nav.Link href="PrivacyPolicy">Privacy Policy</Nav.Link>
              <Nav.Link href="TermsAndConditions">Terms and Conditions</Nav.Link>
              <Nav.Link href="CookiePolicy">Cookie Policy</Nav.Link>
              <Nav.Link href="SiteMap">Site Map</Nav.Link>
            </Nav>
          </Col>
        </Row>

        <hr className="my-4 dotted-divider" />

        <div>
          <Row className="footer-bottom-row text-center text-md-start justify-content-between mt-2 mb-2">
            <Col
              xs={12}
              md={4}
              className="mb-3 mb-md-0 d-flex justify-content-between align-items-center"
            >
              <a href="https://www.facebook.com/kumanawildtrails" className="social-icon">
                <i className="bi bi-facebook" />
              </a>
              <a href="https://www.instagram.com/kumana_wild_trails" className="social-icon">
                <i className="bi bi-instagram" />
              </a>
              <a href="mailto:info@kumanawildtrails.com" className="social-icon">
                <i className="bi bi-envelope" />
              </a>
              <a href="https://youtube.com/@kumanawildtrails" className="social-icon">
                <i className="fab fa-youtube text-danger" />
              </a>
              <a href="https://www.tiktok.com/@kumanawildtrails" className="social-icon">
                <i className="fab fa-tiktok" />
              </a>
            </Col>

            <Col xs={12} md={4} className="text-center">
              <p className="mb-1 fw-bold">LOCATION</p>
              <small>
                No.33, Panama West,
                <br />
                Panama, 32508 Panama,
                <br />
                Sri Lanka
              </small>
            </Col>

            <Col xs={12} md={4} className="text-center text-md-end">
              <p className="mb-1 fw-bold">CONTACT</p>
              <small>
                info@kumanawildtrails.com
                <br />
                +94 77 794 6022
                <br />
                +94 71 910 9308
              </small>
            </Col>
          </Row>

          <p
            className="text-center small mt-2 mb-2"
            style={{ color: "#e2e8e5" }}
          >
            © {new Date().getFullYear()} Kumana Wild Trails. Built by{" "}
            <strong>InnoOraX</strong>
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
