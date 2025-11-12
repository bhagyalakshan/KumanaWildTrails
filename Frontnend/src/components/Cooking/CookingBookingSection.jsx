import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import CookingBookingForm from './CookingBookingForm';





const CookingBookingSection = () => {
  const location = useLocation();
  const packageDetails = location.state || {
    packageName: 'Okanda Temple Visit',
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
  <a href="Activities" style={{ textDecoration: 'none' }}>
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
              {[1, 2, 3, 4].map((imgNum) => (
                <Carousel.Item key={imgNum}>
                  <img
                    className="d-block w-100"
                    src={`/assets/PackagePhotos/Cooking${imgNum}.jpg`}
                    alt={`Slide ${imgNum}`}
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
             Delve into the rich culinary heritage of Sri Lanka with a hands-on cooking class in Panama. Under the guidance of a skilled local chef, learn to prepare authentic dishes using fresh spices, vegetables, and traditional techniques. From fragrant curries to sweet desserts, gain insight into the flavors that define Sri Lankan cuisine. Afterward, sit down to enjoy your creations and take home recipes to recreate the magic. A perfect experience for foodies and culture lovers alike.
             </p>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="col-lg-5 col-md-12 d-flex justify-content-center align-items-center">
          <div className="w-100" style={{ maxWidth: '500px' }}>
            <CookingBookingForm packageDetails={packageDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookingBookingSection;
