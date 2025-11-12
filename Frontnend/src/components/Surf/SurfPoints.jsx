import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faBoxOpen,
  faFileAlt,
  faSuitcase,
  faBan,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';

const SurfPoints = () => {
  const location = useLocation();
  const packageDetails = location.state || { packageName: 'Beginner Surf Experience' };
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const fontFamily = '"Poppins", sans-serif';

  // Refs for scroll animations
  const headerRef = useRef(null);
  const locationsRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const revealElements = [headerRef.current, locationsRef.current, infoRef.current];
      revealElements.forEach(el => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          el.style.opacity = 1;
          el.style.transform = 'translateY(0)';
          el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectionStyle = {
    backgroundColor: 'rgba(250, 250, 250, 0.9)',
    margin: '40px 1rem 60px',
    borderRadius: '16px',
    padding: isMobile ? '1rem' : '2rem',
    fontFamily: 'Comic Sans MS, cursive, sans-serif',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
  };

  const topContainerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '24px',
    marginBottom: '20px',
  };

  const topSectionStyle = {
    backgroundColor: '#fff',
    padding: isMobile ? '1rem' : '1.5rem',
    borderRadius: '16px',
    border:" 5px solid #d4f2efff",
          
    textAlign: 'center',
    flex: 1,
    height: '75vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  };

  const imageStyle = {
    width: '100%',
    height: isMobile ? '25vh' : '30vh',
    objectFit: 'cover',
    borderRadius: '12px',
  };

  const mapStyle = {
    width: '100%',
    height: isMobile ? '20vh' : '25vh',
    border: '0',
    borderRadius: '12px',
  };

  const headerStyle = {
    fontSize: isMobile ? '1.3rem' : '1.7rem',
    fontWeight: 600,
    color: '#222',
    margin: '10px 0 20px',
  };

  const descriptionStyle = {
    fontSize: isMobile ? '0.9rem' : '1rem',
    color: '#555',
    marginBottom: '15px',
    textAlign: 'center',
  };

  const infoRowStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '20px',
    marginTop: '30px',
    justifyContent: 'center',
  };

  const infoColumnStyle = {
    flex: 1,
    backgroundColor: '#fdfdfd',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
    transition: 'transform 0.3s ease',
  };

  const detailHeaderStyle = {
    fontSize: isMobile ? '1rem' : '1.2rem',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#111',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const detailItemStyle = {
    fontSize: isMobile ? '0.85rem' : '1rem',
    marginBottom: '10px',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  return (
    <div style={sectionStyle}>
      <style>
        {`
          @keyframes zoomIn {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .zoom-hover:hover {
            transform: scale(1.02);
            transition: transform 0.3s ease;
          }
        `}
      </style>

      {/* Header */}
      <div
        ref={headerRef}
        className="row m-0 px-4 justify-content-between align-items-start"
        style={{
          backgroundColor: 'transparent',
          paddingBottom: '2rem',
          marginBottom: '1rem',
          opacity: 0,
          transform: 'translateY(40px)',
        }}
      >
        <div className={`${isMobile ? 'col-12 text-center mt-0' : 'col-auto me-4'}`}>
          <h1
            style={{
              fontSize: isMobile ? '1.4rem' : '2rem',
              fontWeight: 500,
              color: '#121212',
              marginBottom: 0,
            }}
          >
            {packageDetails.packageName}
          </h1>
        </div>

        <div
          className={`${isMobile ? 'col-12 text-center mt-2' : 'col-auto ms-auto me-4'}`}
          style={{ marginTop: isMobile ? '0.5rem' : '0.8rem' }}
        >
          <a href="/Activities" style={{ textDecoration: 'none' }}>
            <button
              className="adventure-btn"
              style={{
                backgroundColor: '#ccf2d3ff',
                color: '#111',
                fontSize: isMobile ? '0.8rem' : '1rem',
                fontWeight: 500,
                borderRadius: '999px',
                border: 'none',
                padding: '8px 20px',
              }}
            >
              Adventure Home
            </button>
          </a>
        </div>
      </div>

      {/* Surf Locations */}
      <div
        ref={locationsRef}
        style={{
          ...topContainerStyle,
          opacity: 0,
          
          transform: 'translateY(40px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
        className="zoom-hover"
      >
        <div style={topSectionStyle}>
          <img src="/assets/baby.jpg" alt="Baby Point" style={imageStyle} />
          <div>
            <h2 style={headerStyle}>Baby Point</h2>
            <p style={descriptionStyle}>Known for soft, rolling waves—perfect for beginner surfers.</p>
          </div>
          <iframe
            style={mapStyle}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63382.76818704665!2d81.83607093755762!3d6.839782229320438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae5bd7dd165e151%3A0x795bc835f3a5237f!2sBaby%20Surf%20Point!5e0!3m2!1sen!2slk!4v1753095074680!5m2!1sen!2slk"
            allowFullScreen
            loading="lazy"
            title="Map - Baby Point"
          ></iframe>
        </div>

        <div style={topSectionStyle}>
          <img src="/assets/peanut.jpg" alt="Peanut Farm" style={imageStyle} />
          <div>
            <h2 style={headerStyle}>Peanut Farm</h2>
            <p style={descriptionStyle}>Scenic beach with long waves—ideal for improving your skills.</p>
          </div>
          <iframe
            style={mapStyle}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5699.57633381353!2d81.82055185774794!3d6.78389730120788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae5bd0015344c85%3A0xe4edf091d1671986!2sPeanut%20Farm%20Surf%20Point!5e0!3m2!1sen!2slk!4v1753095161122!5m2!1sen!2slk"
            allowFullScreen
            loading="lazy"
            title="Map - Peanut Farm"
          ></iframe>
        </div>
      </div>

      {/* Information Sections */}
      <div
        ref={infoRef}
        style={{
          opacity: 0,
          transform: 'translateY(40px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
      >
        <div style={infoRowStyle}>
          <div style={infoColumnStyle}>
            <h3 style={detailHeaderStyle}><FontAwesomeIcon icon={faStar} /> Surf Lesson Highlights</h3>
            <ul>
              <li style={detailItemStyle}>🏖️ Lessons at Baby Point & Peanut Farm</li>
              <li style={detailItemStyle}>👨‍🏫 ISA-certified instructors</li>
              <li style={detailItemStyle}>✅ Safe, fun environment</li>
              <li style={detailItemStyle}>🛹 Soft-top boards provided</li>
              <li style={detailItemStyle}>🌴 Relaxed beach vibe</li>
            </ul>
          </div>

          <div style={infoColumnStyle}>
            <h3 style={detailHeaderStyle}><FontAwesomeIcon icon={faBoxOpen} /> What's Included</h3>
            <ul>
              <li style={detailItemStyle}>🕒 1.5–2 hr lesson</li>
              <li style={detailItemStyle}>👨‍🏄 ISA-certified instructor</li>
              <li style={detailItemStyle}>🛹 Beginner surfboard</li>
              <li style={detailItemStyle}>👕 Rash guard</li>
              <li style={detailItemStyle}>📚 Safety tips</li>
              <li style={detailItemStyle}>🚐 Pickup in Arugam Bay</li>
              <li style={detailItemStyle}>🥥 Refreshment</li>
            </ul>
          </div>

          <div style={infoColumnStyle}>
            <h3 style={detailHeaderStyle}><FontAwesomeIcon icon={faFileAlt} /> Full Description</h3>
            <p style={descriptionStyle}>
              Learn to surf at Baby Point & Peanut Farm with certified instructors. This comprehensive beginner-friendly experience provides soft-top boards, safety guidance, and personalized coaching to build your confidence on the waves. Enjoy the serene beach environment, perfect wave conditions, and an unforgettable adventure that combines skill-building with relaxation. Whether you’re catching your first wave or improving your technique, this package ensures a safe, fun, and supportive atmosphere every step of the way.
            </p>
          </div>
        </div>

        <div style={infoRowStyle}>
          <div style={infoColumnStyle}>
            <h3 style={detailHeaderStyle}><FontAwesomeIcon icon={faSuitcase} /> What to Bring</h3>
            <ul>
              <li style={detailItemStyle}>👙 Swimwear</li>
              <li style={detailItemStyle}>🧴 Sunscreen & towel</li>
              <li style={detailItemStyle}>💧 Water bottle</li>
              <li style={detailItemStyle}>👡 Beach slippers</li>
            </ul>
          </div>

          <div style={infoColumnStyle}>
            <h3 style={detailHeaderStyle}><FontAwesomeIcon icon={faBan} /> Not Suitable For</h3>
            <ul>
              <li style={detailItemStyle}>❌ Children under 6</li>
              <li style={detailItemStyle}>❌ Serious injuries/mobility issues</li>
            </ul>
          </div>

          <div style={infoColumnStyle}>
            <h3 style={detailHeaderStyle}><FontAwesomeIcon icon={faLightbulb} /> Good to Know</h3>
            <ul>
              <li style={detailItemStyle}>⏰ Morning or afternoon lessons</li>
              <li style={detailItemStyle}>🌊 Tide/weather dependent</li>
              <li style={detailItemStyle}>👥 Group & private options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurfPoints;
