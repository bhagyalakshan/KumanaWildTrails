import React from "react";
import { Container, Card } from "react-bootstrap";

export default function CookiePolicy() {
  return (
    <>
      {/* Hero Banner */}
      <div className="py-5 text-white text-center" style={{
        background: "linear-gradient(135deg, #0dcaf0, #6610f2)",
        clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)"
      }}>
        <h1 className="display-4 fw-bold">Cookie Policy</h1>
        <p className="lead">Learn how we use cookies to improve your experience</p>
      </div>

      <Container className="my-5">
        <Card className="p-4 shadow-lg border-0 rounded-4">
          <p className="text-muted text-center mb-4">Last updated: <strong>May 30, 2025</strong></p>

          <h4 className="mt-4">● What are cookies?</h4>
          <p>Cookies are small text files stored on your device that help sites remember information about your visit.</p>

          <h4 className="mt-4">● Types we use?</h4>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li><strong>Essential cookies:</strong> Required for authentication, booking flows, and security.</li>
            <li><strong>Functional cookies:</strong> Remember UI preferences and language choices.</li>
            <li><strong>Analytics cookies:</strong> Aggregate usage data to help improve the site.</li>
            <li><strong>Third-party cookies:</strong> Map providers and analytics platforms may set cookies when their services are used.</li>
          </ul>

          <h4 className="mt-4">● Managing cookies</h4>
          <p>You can control cookies through your browser settings. Blocking some cookies may affect functionality.</p>

          <h4 className="mt-4">● Contact</h4>
          <p><strong>Info@wildtrails.com</strong></p>
        </Card>
      </Container>
    </>
  );
}
