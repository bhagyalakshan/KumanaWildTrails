import React, { useState } from 'react';
import BookingForm from './BookingForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const imagePaths = [
  "/assets/PackagePhotos/local1.JPG",
  "/assets/PackagePhotos/local2.jpg",
  "/assets/PackagePhotos/local3.JPG",
  "/assets/PackagePhotos/local4.JPG",
];

const HalfDaySafariSection = () => {
  const location = useLocation();
  const packageDetails = location.state || {
    packageName: 'Half Day Safari with Sri Lankan Traditional Meal',
    packagePrice: 120.0,
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

  const sections = [
    {
      key: 'overview',
      title: '📖 Full Description',
      content: (
        <>
          Get ready for an unforgettable half-day adventure into the heart of <strong>Kumana National Park</strong> — a haven for wildlife lovers and birdwatchers. This guided safari tour not only offers the chance to see wild animals in their natural habitat but also lets you experience the warm flavors of Sri Lanka through a freshly prepared traditional meal.
          <br /><br />
          After a comfortable pickup from Arugam Bay, you'll travel by jeep into the park's rich landscapes: lagoons, grasslands, forest, and rocky outcrops. As you explore, keep an eye out for elephants, crocodiles, deer, wild boar, peacocks, and even the elusive leopard.
          <br /><br />
          Midway through the safari, we’ll stop at a local village house, where you’ll enjoy a delicious Sri Lankan rice and curry meal — a truly unique and authentic cultural experience surrounded by nature.
          <br /><br />
          This tour is perfect for those who want a deeper connection with Sri Lankan nature and culture in just a few hours.
        </>
      ),
    },
    {
      key: 'included',
      title: '✅ What’s Included',
      content: (
        <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
          <li>Private Safari Jeep</li>
          <li>Experienced local driver/guide</li>
          <li>All park entrance fees & taxes</li>
          <li>Bottled water during the safari</li>
          <li>Authentic Sri Lankan meal (vegetarian/non-vegetarian options)</li>
          <li>Pickup & drop-off in Arugam Bay area</li>
          <li>Binoculars</li>
        </ul>
      ),
    },
    {
      key: 'highlights',
      title: '🌟 Highlights',
      content: (
        <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
          <li>Discover the hidden beauty of Kumana National Park</li>
          <li>Spot elephants, crocodiles, leopards, and exotic birds</li>
          <li>Enjoy a freshly cooked traditional Sri Lankan meal</li>
          <li>Capture stunning sunrise or sunset safari views</li>
          <li>Relax in a peaceful, off-the-beaten-track setting</li>
        </ul>
      ),
    },
    {
      key: 'important',
      title: '⚠ Important Information',
      content: (
        <>
          <strong>Duration:</strong> Approx. 5–7 hours<br />
          <strong>Best Time:</strong> Early morning (5:00 AM) or afternoon (12:30 PM)<br /><br />
          <strong>What to Bring:</strong>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Sunscreen & hat</li>
            <li>Insect repellent</li>
            <li>Camera or smartphone</li>
            <li>Reusable water bottle (we provide bottled water too)</li>
          </ul>
          <strong>Dietary Needs:</strong> Please inform us in advance if you have allergies or dietary restrictions.
        </>
      ),
    },
    {
      key: 'itinerary',
      title: '📅 Itinerary',
      content: (
        <>
          <strong>Morning Safari</strong>
          <ul style={{ paddingLeft: '20px' }}>
            <li>5:00 AM – Pickup from your accommodation in Arugam Bay</li>
            <li>6:00 AM – Enter Kumana National Park</li>
            <li>6:00–10:00 AM – Game drive through major wildlife hotspots</li>
            <li>10:15 AM – Stop at local village house for traditional Sri Lankan breakfast</li>
            <li>11:30 AM – Drop-off at your hotel</li>
          </ul>
          <strong>Afternoon Safari</strong>
          <ul style={{ paddingLeft: '20px' }}>
            <li>12:30 PM – Pickup from your accommodation in Arugam Bay</li>
            <li>12:45 PM – Stop at local village house for traditional Sri Lankan lunch</li>
            <li>2:00 PM – Enter Kumana National Park</li>
            <li>2:00–6:00 PM – Game drive through major wildlife hotspots</li>
            <li>6:30 PM – Exit the park</li>
            <li>7:15 PM – Drop-off at your hotel</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div
      className="container-fluid p-0 mb-5"
      style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif", marginTop: '50px' }}
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
            🐘 Half Day Safari with Sri Lankan Traditional Meal 🇱🇰
          </h1>
          <p style={{ fontSize: isMobile ? '0.85rem' : '1rem', color: '#333', marginTop: '8px' }}>
            Explore the wild – Taste the culture!
          </p>
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
              <div key={idx} style={{ overflow: 'hidden', borderRadius: '12px', position: 'relative' }}>
                <img
                  src={img}
                  alt={`Safari collage ${idx + 1}`}
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
          {sections.map((section) => (
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

export default HalfDaySafariSection;
