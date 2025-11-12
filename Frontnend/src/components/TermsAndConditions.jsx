import React from "react";
import { Container, Card } from "react-bootstrap";

export default function TermsAndConditions() {
  return (
    <>
      {/* Hero Banner */}
      <div className="py-5 text-white text-center" style={{
        background: "linear-gradient(135deg, #198754, #20c997)",
        clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)"
      }}>
        <h1 className="display-4 fw-bold">Terms & Conditions</h1>
        <p className="lead">Rules and guidelines for using Kumana WildTrails</p>
      </div>

      <Container className="my-5">
        <Card className="p-4 shadow-lg border-0 rounded-4">
          <p className="text-muted text-center mb-4">Last updated: <strong>May 30, 2025</strong></p>

          <h4 className="mt-4">● Agreement to Terms</h4>
          <p>By using Kumana WildTrails, you agree to these Terms. If you do not agree, do not use the Service.</p>

          <h4 className="mt-4">● Bookings & Payments</h4>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>Bookings must be made via the platform. Confirmations sent by email after payment or admin approval.</li>
            <li>Third-party payment processors used; check their terms. No full card storage.</li>
            <li>Cancellations and refunds follow checkout policy.</li>
          </ul>

          <h4 className="mt-4">● User Conduct</h4>
          <p>Respect wildlife, follow instructions, and avoid illegal content. Violations may suspend your account.</p>

          <h4 className="mt-4">● Liability</h4>
          <p>Not liable for indirect losses. Safari carries inherent risks.</p>

          <h4 className="mt-4">● Intellectual Property</h4>
          <p>Platform content is owned or licensed. Uploading photos grants a non-exclusive display license.</p>

          <h4 className="mt-4">● Changes to Terms</h4>
          <p>We may update Terms; continued use implies acceptance.</p>

          <h4 className="mt-4">● Governing Law</h4>
          <p>These Terms are governed by Sri Lankan law.</p>

          <h4 className="mt-4">● Contact</h4>
          <p><strong>Info@wildtrails.com</strong></p>
        </Card>
      </Container>
    </>
  );
}
