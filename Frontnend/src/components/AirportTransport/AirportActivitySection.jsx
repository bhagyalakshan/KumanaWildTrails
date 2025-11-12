import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  Container,
  Row,
  Col,
  Carousel,
  Card,
  Button,
} from "react-bootstrap";
import {
  BsCheckCircle,
  BsStar,
  BsInfoCircle,
  BsExclamationCircle,
  BsArrowRightCircle,
  BsWhatsapp,
} from "react-icons/bs";
import {
  FaCalendarCheck,
  FaCreditCard,
  FaCarSide,
  FaMapMarkerAlt,
  FaLeaf,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "animate.css/animate.min.css";


function useScrollAnimation(animationClass = "animate__slideInUp") {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node); 
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, []);

  return {
    ref,
    className: isVisible ? `animate__animated ${animationClass}` : "",
  };
}

const AirportActivitySection = () => {
  const navigate = useNavigate();

  const aboutAnimation = useScrollAnimation("animate__slideInUp");
  const locationTitleAnimation = useScrollAnimation("animate__slideInUp");
  const locationMapAnimation = useScrollAnimation("animate__slideInUp");
  const discoverAnimation = useScrollAnimation("animate__slideInUp");
  const moreAdventuresAnimation = useScrollAnimation("animate__slideInUp");
  const youMightLikeAnimation = useScrollAnimation("animate__slideInUp");

  
  const aboutItems = [
    { label: "FLEXIBLE BOOKING", icon: <FaCalendarCheck /> },
    { label: "RESERVE NOW & PAY LATER", icon: <FaCreditCard /> },
    { label: "EXPERT DRIVER", icon: <FaCarSide /> },
    { label: "CONVENIENT PICKUP", icon: <FaMapMarkerAlt /> },
    { label: "ECO-CONSCIOUS TOURS", icon: <FaLeaf /> },
  ];

  const discoverContent = {
    Included: [
      "Hotel pickup and drop-off",
      "Bottled water",
      "Professional guide",
      "Wildlife spotting",
      "All entrance fees",
    ],
    Highlights: [
      "See rare wildlife",
      "Scenic jeep ride",
      "Guided nature walk",
      "Photography stops",
      "Sunset viewpoint",
    ],
    "Full Description": [
      "Explore Sri Lanka’s biodiversity",
      "Drive through scenic trails",
      "Guided commentary included",
      "Visit popular landmarks",
      "Experience local culture",
    ],
    "Important Information": [
      "Bring valid ID",
      "Wear comfortable shoes",
      "No littering allowed",
      "Tour subject to weather",
      "Children must be accompanied",
    ],
  };

  const icons = {
    Included: <BsCheckCircle className="text-success" />,
    Highlights: <BsStar className="text-warning" />,
    "Full Description": <BsInfoCircle className="text-info" />,
    "Important Information": <BsExclamationCircle className="text-danger" />,
  };

  
  const tripData = [
    {
      title: "Kumana National Park Safari Tour",
      description: "Wildlife Wonders & Untamed Beauty",
      images: [
        "/assets/PackagePhotos/Kumana1.jpg",
        "/assets/PackagePhotos/Kumana2.JPG",
        "/assets/PackagePhotos/Kumana3.jpg",
      ],
     
    },
    {
      title: "Camping In Kumana",
      description: "Stars Above, Wilderness Beyond",
      images: [
       "/assets/PackagePhotos/Camping1.jpg",
        "/assets/PackagePhotos/Camping2.jpg",
        "/assets/PackagePhotos/Camping3.jpg",
      ],
     
    },
    {
      title: "Custom Private Tour",
      description: "Your Trip, Your Way",
      images: [
        "/assets/PackagePhotos/Custom1.jpg",
        "/assets/PackagePhotos/Custom2.png",
        "/assets/PackagePhotos/Custom3.webp",
      ],
      
    },
    {
      title: "Surf Lessons in Arugambay",
      description: "Ride the Waves, Live the Vibe",
      images: [
        "/assets/PackagePhotos/Surf1.jpg",
        "/assets/PackagePhotos/Surf2.jpg",
        "/assets/PackagePhotos/Surf3.jpg",
      ],
      
    },
  ];



  const sectionNavLink = "/PackageList";

  return (
    <div
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "0px",
        paddingBottom: "40px",
      }}
    >
      <Container fluid style={{ paddingLeft: "2%", paddingRight: "5%" }}>
        <Row>
          <Col xs={12} lg={10}>
            {}
            <div
              ref={aboutAnimation.ref}
              className={aboutAnimation.className + " shadow"}
              style={{
                padding: "20px 30px 30px 30px",
                borderRadius: "20px",
                marginBottom: "40px",
                border: "6px solid whitesmoke",
              }}
            >
              <h3 className="mb-3" style={{ fontFamily: "Comic Sans MS" }}>
                About this activity
              </h3>
              <Row>
                {aboutItems.map((item, index) => (
                  <Col xs={12} md={6} lg={4} key={index} className="mb-3">
                    <div
                      className="shadow-sm"
                      style={{
                        backgroundColor: "white",
                        border: "6px solid whitesmoke",
                        borderRadius: "12px",
                        padding: "15px 20px",
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        fontFamily: "Comic Sans MS",
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        className: "me-2",
                        color: "#007BA7",
                        size: "1.3rem",
                      })}
                      <span style={{ fontWeight: "500" }}>{item.label}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            {}
            <h3
              ref={locationTitleAnimation.ref}
              className={locationTitleAnimation.className + " mb-3"}
              style={{ fontFamily: "Comic Sans MS" }}
            >
              Location
            </h3>
            <div
              ref={locationMapAnimation.ref}
              className={locationMapAnimation.className + " rounded shadow mb-5"}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "6px solid whitesmoke",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <iframe
                title="Google Map Preview"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.530379821128!2d79.8842495!3d7.1801543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2efb735f22d5d%3A0x6ebd702103828b37!2sColombo%20Bandaranaike%20International%20Airport!5e0!3m2!1sen!2slk!4v1750162293763!5m2!1sen!2slk"
                width="100%"
                height="600"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {}
            <div
              ref={discoverAnimation.ref}
              className={discoverAnimation.className + " mb-5 shadow"}
              style={{
                border: "6px solid whitesmoke",
                borderRadius: "16px",
                padding: "20px",
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h3 className="mb-4" style={{ fontFamily: "Comic Sans MS" }}>
                DISCOVER
              </h3>
              <Accordion defaultActiveKey="">
                {Object.keys(discoverContent).map((sectionTitle, idx) => (
                  <Accordion.Item
                    eventKey={String(idx)}
                    key={sectionTitle}
                    style={{
                      border: "none",
                      borderBottom:
                        idx < Object.keys(discoverContent).length - 1
                          ? "2px dotted #ccc"
                          : "none",
                      paddingBottom: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <Accordion.Header
                      style={{
                        fontSize: "1.4rem",
                        fontFamily: "Comic Sans MS",
                        paddingTop: "0.6rem",
                        paddingBottom: "0.6rem",
                      }}
                    >
                      {sectionTitle}
                    </Accordion.Header>
                    <Accordion.Body
                      style={{
                        fontFamily: "Comic Sans MS",
                        fontSize: "1.1rem",
                        padding: "20px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <ul className="list-unstyled mb-0">
                        {discoverContent[sectionTitle].map((point, i) => (
                          <li
                            key={i}
                            className="d-flex align-items-center gap-2 mb-2"
                            style={{ fontFamily: "Comic Sans MS" }}
                          >
                            <span>
                              {icons[sectionTitle] || (
                                <BsArrowRightCircle className="text-primary" />
                              )}
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </Col>
        </Row>

        {}
        <Row className="mt-4">
          <Col xs={12}>
            <div
              ref={moreAdventuresAnimation.ref}
              className={
                moreAdventuresAnimation.className +
                " mb-5 w-100 d-flex flex-column align-items-center justify-content-center"
              }
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                padding: "60px 20px",
                borderRadius: "20px",
                textAlign: "center",
                minHeight: "280px",
              }}
            >
              <h3 style={{ fontFamily: "Comic Sans MS", marginBottom: "20px" }}>
                Looking for more adventures?
              </h3>
              <p
                style={{
                  fontFamily: "Comic Sans MS",
                  fontSize: "1.1rem",
                  maxWidth: "700px",
                }}
              >
                Discover curated tours based on your interests.
              </p>
              <a
                href="https://wa.me/+94777946022"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Button
                  style={{
                    backgroundColor: "#007BA7",
                    border: "none",
                    color: "white",
                    fontFamily: "Comic Sans MS",
                    fontSize: "1rem",
                    padding: "14px 24px",
                    marginTop: "20px",
                  }}
                  className="d-flex align-items-center gap-2 rounded-pill"
                >
                  <BsWhatsapp size={20} /> Support me Rushan
                </Button>
              </a>
            </div>
          </Col>
        </Row>

        {}
       {}
               <Row
                 className="mt-4 shadow"
                 style={{
                   borderRadius: "10px",
                   border: "10px solid whitesmoke",
                   padding: "20px",
                   cursor: "pointer",
                 }}
                 onClick={() => navigate(sectionNavLink)}
               >
                 <Col xs={12}>
                   <div
                     ref={youMightLikeAnimation.ref}
                     className={youMightLikeAnimation.className + " mb-4 w-100 text-center"}
                   >
                     <h3
                       className="mb-4"
                       style={{
                         fontFamily: "Comic Sans MS",
                         
                         fontSize: "2rem",
                         marginBottom: "20px",
                       }}
                     >
                       You might also like...
                     </h3>
                     <Row>
                       {tripData.map((trip, index) => (
                         <Col key={index} md={3} sm={6} xs={12} className="mb-4">
                           <Card
                             className="shadow-sm h-100"
                             style={{
                               borderRadius: "12px",
                               border: "8px solid whitesmoke",
                               cursor: "default", 
                               transition: "transform 0.3s ease",
                             }}
                             onMouseEnter={(e) =>
                               (e.currentTarget.style.transform = "scale(1.02)")
                             }
                             onMouseLeave={(e) =>
                               (e.currentTarget.style.transform = "scale(1)")
                             }
                           >
                             <Carousel indicators={false} interval={3000}>
                               {trip.images.map((img, idx) => (
                                 <Carousel.Item key={idx}>
                                   <img
                                     src={img}
                                     className="d-block w-100"
                                     style={{
                                       borderRadius: "12px 12px 0 0",
                                       height: "180px",
                                       objectFit: "cover",
                                     }}
                                     alt={`Slide ${idx + 1}`}
                                   />
                                 </Carousel.Item>
                               ))}
                             </Carousel>
                             <Card.Body>
                               <Card.Title
                                 style={{
                                   fontFamily: "Comic Sans MS",
                                   fontSize: "1.3rem",
                                   marginBottom:"15px",
                                   fontWeight: "600",
                                 }}
                               >
                                 {trip.title}
                               </Card.Title>
                               <Card.Text
                                 style={{
                                   fontFamily: "Comic Sans MS",
                                   fontSize: "0.9rem",
                                   fontWeight: "400",
                                 }}
                               >
                                 {trip.description}
                               </Card.Text>
                               <Card.Text
                                 className="text-muted"
                                 style={{ fontSize: "0.85rem" }}
                               >
                             
                               </Card.Text>
                             </Card.Body>
                           </Card>
                         </Col>
                       ))}
                     </Row>
                     <Button
                       onClick={(e) => {
                         e.stopPropagation();
                         navigate(sectionNavLink);
                       }}
                       style={{
                         borderRadius: "20px",
                         backgroundColor: "#ff8000ff", 
                         color: "white",
                        
                         fontFamily: "Comic Sans MS",
                         fontWeight: "600",
                         padding: "8px 30px",
                         fontSize: "1rem",
                         marginTop: "10px",
                       }}
                     >
                       See Other Packages..
                     </Button>
                   </div>
                 </Col>
               </Row>
             </Container>
           </div>
         );
       };

export default AirportActivitySection;
