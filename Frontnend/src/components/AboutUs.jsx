import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ReviewWidget from "./ReviewTable";

const AboutUS = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: isMobile ? 0 : 120,
      anchorPlacement: "top-bottom",
    });
  }, [isMobile]);

  const cardData = [
    {
      title: "Unmatched Safari Experience",
      text: "Embark on unforgettable journeys deep into Sri Lanka’s wildest landscapes. With expert naturalists and experienced trackers, every safari is a chance to witness nature’s raw beauty — up close and personal.",
      image: "/assets/Unmatched.jpg",
    },
    {
      title: "Built on a Legacy of Trust",
      text: "With over 15 years of leading safari expeditions, our story is rooted in passion, professionalism, and a deep respect for wildlife. We’ve grown from a single jeep to a trusted brand that thousands rely on.",
      image: "/assets/baby.jpg",
    },
    {
      title: "Value Beyond the Price Tag",
      text: "We believe a great safari isn’t just about cost — it’s about quality. Our tours combine comfort, safety, and insight to deliver exceptional value, so every rupee you spend brings more than just a ride — it brings a memory.",
      image: "/assets/peanut.jpg",
    },
    {
      title: "Why Wild Trails Stands Out",
      text: "Unlike generic tour operators, we focus solely on wildlife. From customized itineraries to ethical practices and local expertise, we offer an authentic, responsible safari experience you won’t find anywhere else.",
      image: "/assets/logo.png",
    },
  ];

  const socialLinks = [
    { name: "YouTube", url: "https://youtube.com/@kumanawildtrails?si=tIq5GK2S9Fmz7R_B", icon: "/assets/social/youtube.png" },
    { name: "Facebook", url: "https://www.facebook.com/kumanawildtrails", icon: "/assets/social/facebook.png" },
    { name: "Instagram", url: "https://www.instagram.com/kumana_wild_trails?igsh=cWZwMnhjNWw0Zmg1", icon: "/assets/social/instagram.png" },
    { name: "TikTok", url: "https://www.tiktok.com/@kumanawildtrails?_t=ZS-8vx5CTt5OER&_r=1", icon: "/assets/social/tiktok.png" },
    { name: "TripAdvisor", url: "https://www.tripadvisor.co.uk/Attraction_Review-g3348959-d16701196-Reviews-Kumana_Wild_Trails-Arugam_Bay_Eastern_Province.html", icon: "/assets/social/tripadvisor.png" },
  ];

  return (
    <div
      style={{
        fontFamily: "Comic Sans MS, cursive, sans-serif",
        paddingRight: "20px",
        paddingBottom: "20px",
        paddingLeft: "20px",
        backgroundImage: "url('/assets/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#333",
        marginTop: "60px" ,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "0px 10px" : "60px 30px",
        }}
      >
        <div style={{ flex: "1 1 55%", minWidth: "300px", padding: "20px" }}>
          <h5 style={{ letterSpacing: "2px", color: "#888", marginBottom: "15px",fontSize: isMobile ? "1rem" : "1rem", }} data-aos="zoom-in">
            ABOUT US
          </h5>
          <h1
            data-aos="zoom-in"
            style={{
              fontSize: isMobile ? "1.8rem" : "2.8rem",
              marginBottom: "20px",
              lineHeight: "1.3",
            }}
          >
            Exploring the wild with{" "}
            <span style={{ backgroundColor: "#ccf4e6", borderRadius: "10px", padding: "0 8px" }}>
              purpose
            </span>{" "}
            and passion.
          </h1>
          <p style={{ fontSize: "16px", color: "#444", lineHeight: "1.7" }}>
            Wild Trails is Sri Lanka's premier safari experience, offering immersive wildlife
            adventures in natural habitats. With a strong focus on sustainability and ethical
            tourism, we connect guests with the breathtaking beauty of our national parks, guided
            by passionate experts.
          </p>
          <a
            href="PackageList"
            className="animated-button"
            style={{
              marginTop: "30px",
              display: "inline-block",
              backgroundColor: "#4c63f0",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            Book Your Safari
          </a>
        </div>

        <div
          data-aos="zoom-in"
          style={{
            flex: "1 1 40%",
            display: "flex",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <img
            src="/assets/logo.png"
            alt="Wild Trails Safari Jeep"
            style={{
              width: "100%",
              maxWidth: "400px",
              borderRadius: "10%",
            }}
          />
        </div>
      </div>

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          padding: isMobile ? "20px" : "50px",
          borderRadius: "20px",
          maxWidth: "1100px",
          margin: "0 auto",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            letterSpacing: "2px",
            fontWeight: "500",
            fontSize: isMobile ? "1.8rem" : "1.8rem",
            lineHeight: "1.3",
            textAlign: "center",
            marginBottom: isMobile ? "20px" : "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          OUR STORY
        </h2>

        <div
          data-aos="fade-up"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            padding: isMobile ? "20px" : "40px",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            lineHeight: "1.8",
            fontSize: isMobile ? "1rem" : "1.1rem",
            color: "#333",
            textAlign: "justify",
            marginBottom: "40px",
            position: "relative",
            paddingLeft: "45px",
          }}
        >
          <i
            className="fas fa-quote-left"
            style={{
              position: "absolute",
              left: "15px",
              top: "20px",
              color: "#4c63f0",
              opacity: 0.3,
              fontSize: "2em",
            }}
          ></i>
          <p>
            Our journey began with a simple idea — to bring people closer to nature while promoting sustainable exploration. Over the years, we’ve grown from a small team of enthusiasts to a community-driven platform dedicated to providing unforgettable wildlife experiences.
          </p>
          <p>
            Every step of our path has been shaped by passion, purpose, and the belief that adventure should be accessible to all. We take pride in creating moments that matter, offering tailored safari journeys, and inspiring deeper connections with the wild.
          </p>
          <p>
            As we continue to evolve, our mission remains the same: to guide, to inspire, and to explore — together with nature.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "25px",
          }}
        >
          <div
            style={{
              width: "260px",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
            data-aos="fade-up"
            data-aos-delay={isMobile ? "0" : "100"}
          >
            <i className="fas fa-eye" style={{ fontSize: "2em", color: "#4c63f0", marginBottom: "12px" }}></i>
            <h4>Our Vision</h4>
            <p style={{ fontSize: "14px", color: "#555" }}>
              To be the most trusted wildlife tour operator in Sri Lanka, recognized for quality, integrity, and sustainable tourism.
            </p>
          </div>

          <div
            style={{
              width: "260px",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
            data-aos="fade-up"
            data-aos-delay={isMobile ? "0" : "200"}
          >
            <i className="fas fa-bullseye" style={{ fontSize: "2em", color: "#4c63f0", marginBottom: "12px" }}></i>
            <h4>Our Mission</h4>
            <p style={{ fontSize: "14px", color: "#555" }}>
              To offer immersive safari experiences that respect wildlife and local communities, fostering education and conservation.
            </p>
          </div>

          <div
            style={{
              width: "260px",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
            data-aos="fade-up"
            data-aos-delay={isMobile ? "0" : "300"}
          >
            <i className="fas fa-handshake" style={{ fontSize: "2em", color: "#4c63f0", marginBottom: "12px" }}></i>
            <h4>Our Values</h4>
            <p style={{ fontSize: "14px", color: "#555" }}>
              Integrity, passion for nature, community involvement, and commitment to delivering exceptional safari journeys.
            </p>
          </div>
        </div>
      </div>

      <section
        style={{
          marginTop: "60px",
          maxWidth: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: "700",
            letterSpacing: "1.5px",
            fontSize: isMobile ? "2rem" : "2.5rem",
            marginBottom: "40px",
            color: "#333",
          }}
        >
          Why Choose Wild Trails?
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "30px",
            justifyContent: "center",
          }}
        >
          {cardData.map((card, idx) => (
            <div
              key={idx}
              data-aos="fade-up"
              data-aos-delay={isMobile ? "0" : idx * 200}
              style={{
                width: isMobile ? "90%" : "calc(50% - 30px)",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <img
                src={card.image}
                alt={card.title}
                style={{
                  width: isMobile ? "100%" : "160px",
                  borderRadius: "12px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div>
                <h4 style={{ marginBottom: "12px", color: "#1f2a56" }}>{card.title}</h4>
                <p style={{ fontSize: "14px", color: "#444", lineHeight: "1.5" }}>{card.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      

      <div
        style={{
          marginTop: "60px",
          textAlign: "center",
          fontSize: "14px",
          color: "#666",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
          paddingBottom: "40px",
        }}
      >
        {socialLinks.map(({ name, url, icon }, i) => (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            style={{ display: "inline-block", width: "32px", height: "32px" }}
          >
            <img src={icon} alt={name} style={{ width: "100%", height: "100%" }} />
          </a>
        ))}
      </div>
      <div>
        <ReviewWidget/>
      </div>
    </div>
  );
};

export default AboutUS;
