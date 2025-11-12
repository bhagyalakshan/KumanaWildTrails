import React from "react";
import { Container, Card } from "react-bootstrap";

export default function PrivacyPolicy() {
  return (
    <>
      {/* Hero Banner */}
      <div className="py-5 text-white text-center" style={{
        background: "linear-gradient(135deg, #0d6efd, #6f42c1)",
        clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)"
      }}>
        <h1 className="display-4 fw-bold">Privacy Policy</h1>
        <p className="lead">Kumana WildTrails — Protecting your personal data</p>
      </div>

      {/* Content */}
      <Container className="my-5">
        <Card className="p-4 shadow-lg border-0 rounded-4">
          <p className="text-muted text-center mb-4">Last updated: <strong>May 30, 2025</strong></p>

          <h4 className="mt-4">● Introduction</h4>
          <p>Kumana WildTrails ("we", "us", "our") is committed to protecting your privacy...</p>

          <h4 className="mt-4">● Data We Collect</h4>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li><strong>Account info:</strong> name, email, password (hashed), contact details.</li>
            <li><strong>Booking data:</strong> booking dates, vehicle/package, payment status.</li>
            <li><strong>Location data:</strong> GPS from driver sighting reports and SOS alerts.</li>
            <li><strong>Content you create:</strong> photos, reviews, memory uploads.</li>
            <li><strong>Usage data:</strong> pages visited, timestamps, device type.</li>
            <li><strong>Payment data:</strong> transaction IDs (no full card storage).</li>
          </ul>

          <h4 className="mt-4">● How We Use Your Data</h4>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>Provide & operate booking/safari services</li>
            <li>Process payments & send receipts</li>
            <li>Display wildlife sightings, SOS alerts, and map views</li>
            <li>Generate AI-assisted memory summaries</li>
            <li>Send confirmations, updates & support messages</li>
            <li>Improve & secure services through analytics</li>
          </ul>

          <h4 className="mt-4">● Legal Basis</h4>
          <p>We process data for contracts, legal obligations, or legitimate interests...</p>

          <h4 className="mt-4">● Sharing & Third Parties</h4>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>Payment processors</li>
            <li>Map providers (Google Maps)</li>
            <li>Authorized admin staff & drivers</li>
            <li>Law enforcement when required</li>
          </ul>

          <h4 className="mt-4">● Data Retention</h4>
          <p>Data kept as long as necessary. Photos remain until deletion.</p>

          <h4 className="mt-4">● Security</h4>
          <p>Industry-standard measures used. Report concerns immediately.</p>

          <h4 className="mt-4">● Your Rights</h4>
          <p>Access, correct, or request deletion via <a href="mailto:Info@wildtrails.com">Info@wildtrails.com</a>.</p>

          <h4 className="mt-4">● Children</h4>
          <p>Not intended for children under 13.</p>

          <h4 className="mt-4">● Contact</h4>
          <p><strong>Info@wildtrails.com</strong></p>
        </Card>
      </Container>
    </>
  );
}
