import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import ContactForm from './ContactForm';
import SafariTour from './SafariTour';

const ContactUs = () => {
  const iconColor = '#0a3d62';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div style={{ marginTop: '60px', fontFamily: 'Poppins, sans-serif' }}>
      {/* Hero Section */}
      <section
        style={{
          backgroundImage: `url('/assets/background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          color: 'white',
          padding: isMobile ? '60px 20px' : '100px 80px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1,
          }}
        ></div>

        <div style={{ position: 'relative', zIndex: 2 }} className="container text-center">
          <h5
            style={{
              letterSpacing: '3px',
              color: '#d1d8e0',
              fontWeight: 500,
              marginBottom: '15px',
            }}
          >
            CONTACT US
          </h5>
          <h1
            style={{
              fontSize: isMobile ? '2.2rem' : '3.2rem',
              fontWeight: '600',
              color: 'white',
              marginBottom: '20px',
            }}
          >
            We're Here to Help Your Journey
          </h1>
          <p
            style={{
              fontSize: isMobile ? '1rem' : '1.1rem',
              lineHeight: '1.8',
              maxWidth: '700px',
              margin: '0 auto',
              color: '#f1f2f6',
            }}
          >
            Whether you have a question, need support, or want to collaborate — our team is ready to
            connect with you. Reach out via email, WhatsApp, or a quick phone call.
          </p>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section
        className="container py-5"
        style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          marginTop: '-60px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: 3,
        }}
      >
        <div className="row justify-content-center text-center ">
          {/* Email */}
          <div className="col-md-4 mb-4">
            <a href="mailto:rushanme@gmail.com" className="text-decoration-none">
              <div className="contact-card p-4 h-100">
                <FontAwesomeIcon icon={faEnvelope} size="3x" className="mb-3" style={{ color: iconColor }} />
                <h4>Email Us</h4>
                <p>
                  Send us an email — we’ll get back to you promptly with the information you need.
                </p>
              </div>
            </a>
          </div>

          {/* WhatsApp */}
          <div className="col-md-4 mb-4">
            <a href="https://wa.me/94777946022" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
              <div className="contact-card p-4 h-100">
                <FontAwesomeIcon icon={faWhatsapp} size="3x" className="mb-3" style={{ color: '#25D366' }} />
                <h4>Chat on WhatsApp</h4>
                <p>Start a conversation with us for fast and convenient support.</p>
              </div>
            </a>
          </div>

          {/* Phone */}
          <div className="col-md-4 mb-4">
            <a href="tel:+94777946022" className="text-decoration-none">
              <div className="contact-card p-4 h-100">
                <FontAwesomeIcon icon={faPhoneAlt} size="3x" className="mb-3" style={{ color: iconColor }} />
                <h4>Call Us</h4>
                <p>Connect with our support team directly to discuss your inquiries.</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section
        style={{
          
          padding: isMobile ? '60px 20px' : '100px 80px',
        }}
      >
        
        <ContactForm />
      </section>

      {/* Custom CSS */}
      <style jsx>{`
        .contact-card {
          background: white;
          border-radius: 15px;
          border: 1px solid #e0e0e0;
          transition: all 0.3s ease;
          color: #2f3640;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
        }
        .contact-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
        }
        .contact-card h4 {
          color: #0a3d62;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .contact-card p {
          font-size: 1rem;
          color: #555;
        }
        @media (max-width: 768px) {
          .contact-card {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactUs;
