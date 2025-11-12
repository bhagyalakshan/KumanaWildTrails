import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import SurfBookingForm from './SurfBookingForm';


const SurfBookingSection = () => {
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
                    src={`/assets/PackagePhotos/Surf${imgNum}.jpg`}
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
             Ride the waves with confidence at Baby Point or Peanut Farm Beach with beginner-friendly surfing lessons led by expert instructors. Whether it's your first time on a board or you're looking to improve your skills, our hands-on sessions are tailored to your pace and comfort. Learn techniques on land before hitting the water, and surf in safe, fun environments with top-quality boards provided. It’s a thrilling, empowering experience that blends adventure, skill, and the joy of the ocean.
              </p>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="col-lg-5 col-md-12 d-flex justify-content-center align-items-center">
          <div className="w-100" style={{ maxWidth: '500px' }}>
            <SurfBookingForm packageDetails={packageDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurfBookingSection;
