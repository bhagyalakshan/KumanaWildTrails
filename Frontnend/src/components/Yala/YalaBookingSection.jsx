import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import MirissaBookingForm from '../MirissaBookingForm';

const customImagePaths = [
  "/assets/PackagePhotos/Yala1.jpg",
  "/assets/PackagePhotos/Yala2.jpg",
  "/assets/PackagePhotos/Yala3.jpg",
  "/assets/PackagePhotos/Yala4.jpg",
];
const YalaBookingSection = () => {
  const location = useLocation();
  const packageDetails = location.state || {
    packageName: 'Kumana National Park Safari',
  };

  const isMobile = useMediaQuery({ maxWidth: 576 }); // Detect small screens

  return (
    <div
      className="container-fluid p-0"
      style={{
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
        fontFamily: "'Comic Sans MS', cursive",
      marginTop: "70px" ,
      }}
    >
      {/* Header */}
      <div
        className="row m-0 px-4 justify-content-between align-items-start"
        style={{
          backgroundColor: 'transparent',
          paddingBottom: '2rem',
          marginBottom: '1rem',
        }}
      >
        <div className={`${
    isMobile ? 'col-12 text-center mt-0 ' : 'col-auto me-4'
  }`}>
          <h1 
            
            style={{
              fontSize: isMobile ? '1.4rem' : '2rem',
              fontWeight: 300,
              color: '#01070eff',
              
            }}
          >
            {packageDetails.packageName}
          </h1>
        </div>

        <div
  className={`${
    isMobile ? 'col-12 text-center mt-0' : 'col-auto ms-auto me-4'
  }`}
  style={{ marginTop: isMobile ? '0' : '0.5rem' }}
>
  <a href="PackageList" style={{ textDecoration: 'none' }}>
    <button
      className="adventure-btn"
      style={{
        backgroundColor: '#ccf2d3ff',
        color: 'black',
        fontSize: isMobile ? '0.8rem' : '1rem',
        fontWeight: '500',
        borderRadius: '999px',
        border: 'none',
        padding: '6px 16px',
        transition: 'transform 0.3s ease',
      }}
    >
      Adventure Home
    </button>
  </a>
</div>

      </div>

      {/* Content Section */}
      <div className="row m-0 pb-4 px-2 px-md-3 justify-content-center align-items-stretch">
        {/* Left: Slideshow + Explore */}
        <div className="col-lg-7 col-md-12 d-flex flex-column mb-4">
          <div className="mb-4">
            <Carousel fade interval={3000}>
  {customImagePaths.map((imgPath, index) => (
    <Carousel.Item key={index}>
      <img
        className="d-block w-100"
        src={imgPath}
        alt={`Slide ${index + 1}`}
        style={{
          height: '500px',
          objectFit: 'cover',
          border: '4px solid white',
          borderRadius: '20px',
        }}
      />
    </Carousel.Item>
  ))}
</Carousel>
          </div>

          <div
            className="shadow"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '2rem 1.6rem',
              borderRadius: '20px',
              border: '8px solid whitesmoke',
              letterSpacing: '0.5px',
            }}
          >
            <p className="mb-0">
              Get a head start on your wildlife adventure with our private transfer from Arugam Bay to Yala National Park. Relax in a spacious, air-conditioned vehicle as your professional driver navigates scenic routes, giving you the perfect opportunity to unwind before your safari begins. Choose optional stops along the way for refreshments or quick sightseeing. Ideal for couples, families, and solo travelers, this transfer delivers you to Yala's doorstep rested and ready to dive straight into nature's wild wonders.
              </p>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="col-lg-5 col-md-12 d-flex justify-content-center align-items-center">
          <div className="w-100" style={{ maxWidth: '500px' }}>
            <MirissaBookingForm packageDetails={packageDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default YalaBookingSection;
