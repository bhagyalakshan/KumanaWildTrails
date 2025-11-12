import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Card, Row, Col, Container, Carousel, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './PackageList.css';

const Activities = () => {
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(null);
  const [visibleCards, setVisibleCards] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const cardRefs = useRef([]);
  const navigate = useNavigate();

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch packages of type "activity"
  useEffect(() => {
    axios.get('http://localhost:8080/api/packages')
      .then(res => {
        const activityPackages = res.data.filter(pkg =>
          pkg.type && pkg.type.trim().toLowerCase() === 'activity'
        );
        setPackages(activityPackages);
      })
      .catch(err => {
        console.error("❌ Error loading packages", err);
        setError('Failed to load packages. Please try again later.');
      });
  }, []);

  // IntersectionObserver for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute('data-index');
            setVisibleCards(prev => ({ ...prev, [index]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [packages]);

  // Images, descriptions, links
  const packageImages = {
    1: ["/assets/slides/kumana1.jpg", "/assets/slides/kumana2.jpg", "/assets/slides/kumana3.jpg", "/assets/slides/kumana4.jpg"],
    2: ["/assets/PackagePhotos/Camping1.jpg", "/assets/PackagePhotos/Camping2.jpg", "/assets/PackagePhotos/Camping3.jpg", "/assets/PackagePhotos/Camping4.jpg"],
    3: ["/assets/PackagePhotos/Airport1.jpg", "/assets/PackagePhotos/Airport2.jpg", "/assets/PackagePhotos/Airport3.jpg", "/assets/PackagePhotos/Airport4.jpg"],
    4: ["/assets/PackagePhotos/Ella1.jpg", "/assets/PackagePhotos/Ella2.jpg", "/assets/PackagePhotos/Ella3.jpg", "/assets/PackagePhotos/Ella4.jpg"],
    5: ["/assets/PackagePhotos/Mirissa1.jpg", "/assets/PackagePhotos/Mirissa2.jpg", "/assets/PackagePhotos/Mirissa3.jpg", "/assets/PackagePhotos/Mirissa4.jpg"],
    6: ["/assets/PackagePhotos/Yala1.jpg", "/assets/PackagePhotos/Yala2.jpg", "/assets/PackagePhotos/Yala3.jpg", "/assets/PackagePhotos/Yala4.jpg"],
    7: ["/assets/PackagePhotos/Custom1.jpg", "/assets/PackagePhotos/Custom2.jpg", "/assets/PackagePhotos/Custom3.jpg", "/assets/PackagePhotos/Custom4.jpg"],
    8: ["/assets/PackagePhotos/Tuk1.jpg", "/assets/PackagePhotos/Tuk2.jpg", "/assets/PackagePhotos/Tuk3.jpg", "/assets/PackagePhotos/Tuk4.jpg"],
    9: ["/assets/PackagePhotos/Kudumbigala1.jpg", "/assets/PackagePhotos/Kudumbigala2.jpg", "/assets/PackagePhotos/Kudumbigala3.jpg", "/assets/PackagePhotos/Kudumbigala4.jpg"],
    10: ["/assets/PackagePhotos/Okanda1.jpg", "/assets/PackagePhotos/Okanda2.jpg", "/assets/PackagePhotos/Okanda3.webp", "/assets/PackagePhotos/Okanda4.webp"],
    11: ["/assets/PackagePhotos/Surf1.jpg", "/assets/PackagePhotos/Surf2.jpg", "/assets/PackagePhotos/Surf3.jpg", "/assets/PackagePhotos/Surf4.jpg"],
    12: ["/assets/PackagePhotos/Lagoon1.jpg", "/assets/PackagePhotos/Lagoon2.jpg", "/assets/PackagePhotos/Lagoon3.jpg", "/assets/PackagePhotos/Lagoon4.jpg"],
    13: ["/assets/PackagePhotos/Cooking1.jpg", "/assets/PackagePhotos/Cooking2.jpg", "/assets/PackagePhotos/Cooking3.jpg", "/assets/PackagePhotos/Cooking4.jpg"],
    14: ["/assets/PackagePhotos/Ancient1.jpg", "/assets/PackagePhotos/Ancient2.jpg", "/assets/PackagePhotos/Ancient3.jpg", "/assets/PackagePhotos/Ancient4.jpg"]
  };

  const packageDescriptions = {
    1: ["Discover leopards, elephants, crocodiles, and over 200 species of birds on an exciting safari through Kumana’s unspoiled wilderness."],
    2: ["Camp beneath the stars in Kumana! Experience wild nights with elephants, birds, and nature sounds in the heart of the national park."],
    3: ["Enjoy a safe, private airport transfer to or from Arugam Bay in an air-conditioned car with professional drivers."],
    4: ["Relax with a scenic private transfer from Arugam Bay to Ella. Enjoy countryside views and optional photo or sightseeing stops en route."],
    5: ["Travel in comfort from Arugam Bay to Mirissa. Private, flexible transfer with air-conditioning and sightseeing options on the way."],
    6: ["Take a private transfer from Arugam Bay to Yala National Park. Arrive relaxed and ready for your wildlife safari adventure."],
    7: ["Design your own private tour with expert guide and vehicle. Explore beaches, temples, safaris, and hidden gems of Sri Lanka."],
    8: ["Rent a tuk tuk in Arugam Bay! Self-drive or with driver—perfect for exploring beaches, villages, temples, and the local area."],
    9: ["Visit the ancient Kudumbigala Rock Monastery with scenic views, history, and nature trails. A beautiful cultural experience."],
    10: ["Tour the sacred Okanda Temple on Sri Lanka’s coast. Learn local legends and enjoy the peaceful temple surroundings and views."],
    11: ["Learn to surf at Arugam Bay,Peanut Farm and Panama! Beginner-friendly lessons with expert instructors and quality boards for an unforgettable day."],
    12: ["Cruise through Arugam Bay’s lagoons. Spot exotic birds, wildlife, mangroves, and enjoy a peaceful nature experience by boat."],
    13: ["Join a hands-on Sri Lankan cooking class! Learn to prepare authentic dishes and enjoy your meal with recipes to take home."],
    14: ["Step back in time with the Ancient Temple Visit – a cultural journey through Sri Lanka’s sacred sites. Explore historic shrines, peaceful landscapes, and rich local traditions with a guide who brings the past to life."]
  };

  const packageLinks = {
    1: "/booking/kumana",
    2: "/booking/camping",
    3: "/booking/Airport",
    4: "/booking/Ella",
    5: "/booking/Mirissa",
    6: "/booking/Yala",
    7: "/booking/CustomTours",
    8: "/booking/TukTuk",
    9: "/booking/Kudumbigala",
    10: "/booking/Okanda",
    11: "/booking/Surf",
    12: "/booking/Lagoon",
    13: "/booking/Cooking",
    14: "/booking/Ancient"
  };

  // Sort priority for activities
  const sortedPackages = [...packages].sort((a, b) => {
    const priority = {
      "Surfing Lessons in Arugumbay": 1,
      "Traditional Cooking Classes": 2,
      "Ancient Temple Visit": 3,
      "Kudumbigala Monastery Tour": 4
    };
    return (priority[a.packageName] || 99) - (priority[b.packageName] || 99);
  });

  const headerColor = '#000701ff';

  return (
    <Container
      fluid
      className="py-5"
      style={{
        fontFamily: 'Poppins, sans-serif',
        backgroundImage: 'url(/assets/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        marginTop: "70px"
      }}
    >
      {/* Header */}
      <div className="text-center mb-5">
        <h6 className="text-muted mb-2" style={{ letterSpacing: "2px" }}>KUMANA WILD TRAILS</h6>
        <h1 style={{ fontWeight: 600, fontSize: isMobile ? '1.5rem' : '2.5rem', color: headerColor, letterSpacing: "1px" }}>
          AVAILABLE ACTIVITY PACKAGES
        </h1>
        <div style={{ width: "80px", height: "4px", backgroundColor: "#007BA7", margin: "12px auto 0", borderRadius: "4px" }} />
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {!error && packages.length === 0 && <p className="text-center text-muted">Loading packages...</p>}

      <Row xs={1} md={3} className="g-4 justify-content-center">
        {sortedPackages.map((pkg, index) => {
          const images = packageImages[pkg.packageKey] || packageImages[1];
          const desc = packageDescriptions[pkg.packageKey] || packageDescriptions[1];
          const link = packageLinks[pkg.packageKey] || "/booking";
          const isVisible = visibleCards[index];
          const isCustom = pkg.packageName.includes('Tuk Tuk') || pkg.packageName.includes('Custom');

          return (
            <Col
              key={pkg.packageKey}
              data-index={index}
              ref={el => cardRefs.current[index] = el}
              className={`package-card ${isVisible ? 'visible' : ''}`}
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 0.6s ease-out',
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(0) scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
              onClick={() => navigate(link, { state: { packageName: pkg.packageName, packagePrice: pkg.packagePrice } })}
            >
              <Card className="shadow-lg border-0 rounded-4 overflow-hidden h-100">
                <Carousel interval={isVisible ? 3000 : null} fade onClick={e => e.stopPropagation()}>
                  {images.map((img, idx) => (
                    <Carousel.Item key={idx}>
                      <img src={img} alt={`Slide ${idx + 1}`} className="d-block w-100" style={{ height: '280px', objectFit: 'cover' }} />
                    </Carousel.Item>
                  ))}
                </Carousel>

                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="text-center mb-3" style={{ fontSize: '1.5rem', fontWeight: 600, color: '#002e13' }}>
                      {pkg.packageName}
                    </Card.Title>
                    <Card.Text className="text-center text-muted" style={{ fontSize: '0.95rem', minHeight: '80px' }}>
                      {desc.map((line, i) => <span key={i}>{line}<br /></span>)}
                    </Card.Text>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <div>
                      {isCustom ? (
                        <span className="text-dark fw-semibold">Customisable Prices</span>
                      ) : (
                        <span>
                          <strong style={{ color: '#007BA7' }}>${pkg.packagePrice.toFixed(2)}</strong>
                          <span className="text-muted" style={{ fontSize: '0.85rem' }}> / pax / 07 hrs</span>
                        </span>
                      )}
                    </div>
                    <Button variant="success" className="d-flex align-items-center" style={{ borderRadius: '8px', fontWeight: 500 }}>
                      <i className="bi bi-journal-check me-2"></i> Reserve
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Activities;
