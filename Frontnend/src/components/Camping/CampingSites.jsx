import React from 'react';
import { isMobile } from 'react-device-detect';

const sites = [
  {
    name: 'Eda Kumbuka 1',
    image: '/assets/PackagePhotos/Eda1.jpg',
    description:
      'Situated at the edge of Kumbukkan Oya, Eda Kumbuka 1 offers a tranquil riverside camping experience. The site is ideal for wildlife spotting, especially elephants crossing the river at dawn and dusk. Perfect for those seeking serenity in raw wilderness.',
  },
  {
    name: 'Eda Kumbuka 2',
    image: '/assets/PackagePhotos/Eda2.jpg',
    description:
      'Just a short distance upstream from Eda Kumbuka 1, this site is shaded by dense forest and frequented by wild boar, deer, and birdlife. It’s a secluded area that offers an immersive, back-to-nature feel for seasoned campers and nature photographers.',
  },
  {
    name: 'Gal Amuna',
    image: '/assets/PackagePhotos/Gal.jpg',
    description:
      'Nestled near ancient stone structures, Gal Amuna is one of the most scenic camping sites inside Kumana National Park. Known for its rugged charm and nearby rock pools, this location is rich in history, ideal for night skies and sunrise hikes.',
  },
];

// Utility function for responsive font sizing
const getResponsiveFontSize = (desktopSize, mobileSize) =>
  isMobile ? mobileSize : desktopSize;

const CampingSites = () => {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        fontFamily: "'Comic Sans MS', cursive",
        padding: '3rem 1rem',
      }}
    >
      <h2
        style={{
          fontSize: getResponsiveFontSize('2rem', '1.5rem'),
          color: '#000',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        Explore Our Scenic Camping Sites
      </h2>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
        }}
      >
        {sites.map((site, index) => (
          <div
            key={index}
            style={{
              width: isMobile ? '95%' : '340px',
              backgroundColor: '#ffffffaa',
              borderRadius: '20px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              transition: 'transform 0.3s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            <img
              src={site.image}
              alt={site.name}
              style={{
                width: '100%',
                height: getResponsiveFontSize('260px', '200px'),
                objectFit: 'cover',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
              }}
            />
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <h5
                style={{
                  fontSize: getResponsiveFontSize('1.4rem', '1.1rem'),
                  color: '#000',
                  marginBottom: '0.5rem',
                }}
              >
                {site.name}
              </h5>
              <p
                style={{
                  fontSize: getResponsiveFontSize('1rem', '0.9rem'),
                  color: '#333',
                }}
              >
                {site.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampingSites;
