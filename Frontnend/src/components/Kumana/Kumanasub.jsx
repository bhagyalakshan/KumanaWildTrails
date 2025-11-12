import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaCar, FaStar, FaHandsHelping, FaAward, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Safari package data
const safariPackages = [
  {
    title: 'Full Day Safari  (12 Hours)',
    image: '/assets/PackagePhotos/Kumana1.jpg',
    points: [
      'With/Without Local Foods',
      'Expert Drivers',
      'Excellent User Reviews',
      'Service Beyond the Price',
      '500+ safaris Completed',
    ],
    link: '/FullDay',
  },
  {
    title: 'Half Day Safari(6 Hours)',
    image: '/assets/PackagePhotos/Kumana4.jpg',
    points: [
      'Without Local Foods',
      'Expert Drivers',
      'Excellent User Reviews',
      'Service Beyond the Price',
      '500+ Safaris Completed',
    ],
    link: '/HalfDay',
  },
  {
    title: 'Half Day Safari with Sri Lankan Traditional Meal (6 Hours)',
    image: '/assets/PackagePhotos/Kumana3.jpg',
    points: [
      'With Local Foods',
      'Expert Drivers',
      'Excellent User Reviews',
      'Service Beyond the Price',
      '200+ Half Day Safari with Sri Lankan Traditional Meal Tours Completed',
    ],
    link: '/Birdwatching',
  },
];

// Feature buttons with colors


const Kumanasub = () => {
  return (
    <section className="py-5  min-vh-100">
      <div className="container">
        

        

        {/* Safari Cards */}
        <div className="row g-4 justify-content-center">
          {safariPackages.map((pkg, idx) => (
            <motion.div
              key={idx}
              className="col-12 col-sm-6 col-md-4"
              whileHover={{ y: -10 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="card h-100 shadow-lg border-0 rounded-4 overflow-hidden position-relative">
                <div className="overflow-hidden" style={{ height: '220px' }}>
                  <motion.img
                    src={pkg.image}
                    alt={pkg.title}
                    className="card-img-top"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold text-center mb-3">{pkg.title}</h5>
                  <ul className="list-unstyled mb-4">
                    {pkg.points.map((point, i) => (
                      <li key={i} className="d-flex align-items-center mb-2">
                        <span
                          className="me-2"
                          style={{
                            width: '10px',
                            height: '10px',
                            backgroundColor: '#003366', // dark blue
                            borderRadius: '50%',
                            display: 'inline-block',
                          }}
                        ></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={pkg.link}
                    className="btn btn-dark mt-auto d-flex align-items-center justify-content-center gap-2"
                    style={{
                      borderRadius: '50px',
                      padding: '0.5rem 1.5rem',
                      fontWeight: '500',
                      fontSize: '0.95rem',
                      backgroundColor: '#003366',
                      border: 'none',
                    }}
                  >
                    <FaCalendarAlt /> Reserve
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Kumanasub;
