import React from 'react';
import { isMobile } from 'react-device-detect';

// Font size utility
const getFontSize = (desktop, mobile) => (isMobile ? mobile : desktop);

const Agenda = () => {
  const itinerary = [
    '5:00 AM – Pickup from your accommodation in Arugam Bay',
    '6:00 AM – Enter Kumana National Park',
    '6:00–8:30 AM – Morning game drive through prime wildlife viewing areas',
    '8:30–9:00 AM – Enjoy breakfast at a safe and scenic location inside the park',
    '9:00–12:30 PM – Continue game drive across lagoons, forests, and birdwatching zones',
    '12:30–2:30 PM – Lunch break and rest at a safe and scenic location inside the park',
    '2:30–6:00 PM – Afternoon game drive exploring different parts of the park',
    '6:00 PM – Exit the park',
    '7:00 PM – Drop-off at your accommodation in Arugam Bay',
  ];

  return (
    <div
      style={{
        position: 'relative',
        fontFamily: "'Comic Sans MS', cursive",
        minHeight: '100vh',
        overflow: 'hidden',
        top:60,
        marginBottom:100,
        
      }}
    >
      {/* Background Image Layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url('/assets/PackagePhotos/Kumana3.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity:0.7,
          zIndex: 0,
          borderRadius:"20px",
          
          
        }}
      ></div>

      {/* Content Layer */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '3rem 1rem',
        }}
      >
        <h2
          style={{
            fontSize: getFontSize('2rem', '1.5rem'),
            textAlign: 'center',
            color: '#222',
            marginBottom: '2.5rem',
            color:"white",
            fontWeight:"600",
          }}
        >
          Full Day Safari Agenda
        </h2>

        <div
          style={{
            maxWidth: '750px',
            margin: '0 auto',
            borderLeft: '4px solid #edfaf9ff',
            paddingLeft: '1rem',
          }}
        >
          {itinerary.map((item, index) => (
            <div
              key={index}
              style={{
                marginBottom: '1.5rem',
                position: 'relative',
                paddingLeft: '1.5rem',
              }}
            >
              {/* Timeline Dot */}
              <div
                style={{
                  position: 'absolute',
                  left: '-14px',
                  top: '4px',
                  backgroundColor: '#cffefbff',
                  borderRadius: '50%',
                  width: '12px',
                  height: '12px',
                }}
              ></div>

              <div
                style={{
                  background: '#ffffffcc',
                  padding: '1rem',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span
                  style={{
                    fontSize: getFontSize('1.1rem', '1rem'),
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  🕒 {item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agenda;
