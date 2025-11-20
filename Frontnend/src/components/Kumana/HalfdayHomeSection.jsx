import React, { useState } from 'react';
import BookingForm from './BookingForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const imagePaths = [
  "/assets/PackagePhotos/Yala1.jpg",
  "/assets/PackagePhotos/Kumana2.JPG",
  "/assets/PackagePhotos/Yala3.jpg",
  "/assets/PackagePhotos/Kumana1.jpg",
];

const HalfDaySection = () => {
  const location = useLocation();
  const packageDetails = location.state || {
    packageName: 'Kumana National Park Half-Day Safari',
    packagePrice: 85.0,
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
            🐾 Half-Day Safari at Kumana National Park
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
        {/* Left Column: Safari Info */}
        <div className="col-lg-7 col-md-12 d-flex flex-column gap-4 mb-4">
          {/* Image Collage */}
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
                  Embark on an unforgettable <strong>Half-Day Safari at Kumana National Park</strong>, one of Sri Lanka’s most serene and wildlife-rich destinations. Perfect for nature lovers, photographers, birdwatchers, and travelers with limited time, this safari lets you experience the best of Sri Lanka's wildlife without committing to a full day.
                  <br />
                  Whether you're drawn by the golden light of morning or the magic of a sunset safari, Kumana offers raw wilderness, peaceful surroundings, and exciting wildlife sightings — all just a short drive from Arugam Bay.
                </>
              ),
            },
            {
              key: 'duration',
              title: '🕓 Tour Duration',
              content: (
                <>
                  <strong>Morning Safari:</strong> 5:00 AM – 11:00 AM
                  <br />
                  <strong>Evening Safari:</strong> 1:00 PM – 7:00 PM
                  <br />
                  Timings may vary slightly depending on your accommodation location in Arugam Bay, Panama, or surrounding areas.
                </>
              ),
            },
            {
              key: 'included',
              title: '🚙 What’s Included',
              content: (
                <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                  <li>Private open safari jeep for unobstructed wildlife viewing</li>
                  <li>Friendly and experienced local driver-guide</li>
                  <li>Pick-up and drop-off from your hotel or guesthouse in Arugam Bay, Panama, or nearby</li>
                  <li>Complimentary bottled drinking water</li>
                  <li>Binoculars and wildlife field guides available upon request</li>
                </ul>
              ),
            },
            {
              key: 'wildlife',
              title: '🐘 What You’ll See',
              content: (
                <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                  <li>Sri Lankan elephants, spotted deer, wild boars, and jackals</li>
                  <li>The Sri Lankan leopard (rare, requires patience!)</li>
                  <li>Variety of birds – painted storks, pelicans, hornbills, eagles, migratory birds, flamingos (seasonal)</li>
                  <li>Crocodiles, water buffalo, and playful macaques along riverbanks and lagoons</li>
                  <li>Ideal for birdwatchers, as Kumana is a top birding destination</li>
                </ul>
              ),
            },
            {
              key: 'why',
              title: '🌿 Why Choose Our Half-Day Safari?',
              content: (
                <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                  <li>Great for visitors with limited time in Arugam Bay</li>
                  <li>Less tiring than a full-day tour, but still packed with wildlife sightings</li>
                  <li>Morning and evening light offer ideal conditions for photography</li>
                  <li>Family-friendly, safe, and educational for children</li>
                  <li>Led by passionate local guides committed to responsible tourism</li>
                </ul>
              ),
            },
            {
              key: 'bring',
              title: '🎒 What to Bring',
              content: (
                <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                  <li>Sunscreen, sunglasses, and a hat</li>
                  <li>Insect repellent</li>
                  <li>Camera or smartphone for wildlife photos</li>
                  <li>Comfortable shoes and light, breathable clothing (earth-tone recommended)</li>
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

export default HalfDaySection;
