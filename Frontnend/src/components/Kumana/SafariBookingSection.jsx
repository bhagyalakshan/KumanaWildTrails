import React, { useState } from 'react';
import BookingForm from './BookingForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const imagePaths = [
  "/assets/PackagePhotos/Kumana1.jpg",
  "/assets/PackagePhotos/Kumana2.JPG",
  "/assets/PackagePhotos/Camping3.jpg",
  "/assets/PackagePhotos/Kumana4.jpg",
];

const HomeSection = () => {
  const location = useLocation();
  const packageDetails = location.state || {
    packageName: 'Kumana National Park Safari Packages',
    packagePrice:85.0,
  };

  const isMobile = useMediaQuery({ maxWidth: 576 });

  const [hovered, setHovered] = useState(null);

  const cardHoverStyle = (key) => ({
    transform: hovered === key ? 'translateY(-5px)' : 'translateY(0)',
    boxShadow:
      hovered === key
        ? '0 12px 25px rgba(0,0,0,0.15)'
        : '0 4px 15px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    backgroundColor: '#fff',
  });

  return (
    <div
      className="container-fluid p-0 mb-5"
      style={{
        minHeight: '100vh',
        fontFamily: "'Inter', sans-serif",
        marginTop: '50px',
        
      }}
    >
      {/* Header */}
      <div
        className="row m-0 px-3 justify-content-between align-items-start"
        style={{ paddingBottom: '1.5rem', marginBottom: '1rem' }}
      >
        <div className={`${isMobile ? 'col-12 text-center mt-2' : 'col-auto me-4'}`}>
          <h1
            style={{
              fontSize: isMobile ? '1.6rem' : '2.2rem',
              fontWeight: 700,
              color: '#01070e',
              lineHeight: 1.3,
            }}
          >
            🐾 Full-Day Safari at Kumana
          </h1>
        </div>
        <div className={`${isMobile ? 'col-12 text-center mt-2' : 'col-auto ms-auto me-4'}`}>
          <a href="PackageList" style={{ textDecoration: 'none' }}>
            <button
              className="adventure-btn"
              style={{
                backgroundColor: '#ccf2d3ff',
                color: 'black',
                fontSize: isMobile ? '0.85rem' : '1rem',
                fontWeight: 500,
                borderRadius: '999px',
                border: 'none',
                padding: '8px 20px',
                transition: 'transform 0.3s ease',
              }}
            >
              Adventure Home
            </button>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="row m-0 px-2 px-md-3 justify-content-center align-items-stretch">
        {/* Left Column: Modern Safari Info */}
        <div className="col-lg-7 col-md-12 d-flex flex-column gap-4 mb-4">
          {/* Top Collage */}
          <div
            className="d-grid gap-3"
            style={{
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {imagePaths.map((img, idx) => (
              <div
                key={idx}
                style={{
                  overflow: 'hidden',
                  borderRadius: '12px',
                  position: 'relative',
                }}
              >
                <img
                  src={img}
                  alt={`Kumana collage ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: isMobile ? '120px' : '160px',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease, filter 0.4s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.filter = 'brightness(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.filter = 'brightness(1)';
                  }}
                />
              </div>
            ))}
          </div>

          {/* Info Cards */}
          {[
            {
              key: 'overview',
              title: 'About the Safari',
              content: (
                <>
                  Step into the wild with our <strong>Full-Day Safari at Kumana National Park</strong>, perfect for wildlife enthusiasts, photographers, and nature lovers looking to experience Sri Lanka’s eastern wilderness at its finest.
                  <br />
                  Located just an hour from Arugam Bay, Kumana is famous for leopards, elephants, and incredible birdlife. Enjoy a 12–14 hour immersive wildlife experience.
                </>
              ),
            },
            {
              key: 'duration',
              title: '🕓 Tour Duration',
              content: (
                <>
                  5:00 AM – 5:00 PM
                  <br />
                  Complete 12–14 hour journey with pick-up and return from Arugam Bay, Panama, or nearby accommodations.
                </>
              ),
            },
            {
              key: 'included',
              title: '🚙 What’s Included',
              content: (
                <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                  <li>Private open-top safari jeep with wide viewing angles</li>
                  <li>Experienced local driver-guide</li>
                  <li>Pick-up & drop-off from local hotels</li>
                  <li>Complimentary bottled water & refreshments</li>
                  <li>Picnic lunch or scenic rest stop</li>
                  <li>Binoculars & wildlife field guides upon request</li>
                </ul>
              ),
            },
            {
              key: 'wildlife',
              title: '🐘 Wildlife Highlights',
              content: (
                <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                  <li>Sri Lankan leopards (best early morning / late afternoon)</li>
                  <li>Wild elephants feeding or bathing</li>
                  <li>Sloth bears (seasonal & rare)</li>
                  <li>Diverse birds including peacocks & migratory species</li>
                  <li>Lagoons, forests, plains, and waterholes exploration</li>
                </ul>
              ),
            },
          ].map((section) => (
            <div
              key={section.key}
              className="p-4"
              style={{
                borderRadius: '16px',
                border: '5px solid #e0e0e0',
                backgroundColor: '#fff',
                ...cardHoverStyle(section.key),
              }}
              onMouseEnter={() => setHovered(section.key)}
              onMouseLeave={() => setHovered(null)}
            >
              <h5 style={{ fontWeight: 600, marginBottom: '10px', color: '#07540b' }}>
                {section.title}
              </h5>
              <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#333' }}>
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Booking Form */}
        <div className="col-lg-5 col-md-12 d-flex justify-content-center align-items-start">
          <div className="w-100" style={{ maxWidth: '500px' }}>
            <BookingForm packageDetails={packageDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
