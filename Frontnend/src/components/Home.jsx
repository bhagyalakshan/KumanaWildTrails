import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HomeBelow from "./HomeBelow";
import HomeRest from "./HomeRest";
import HomeBottom from "./HomeBottom";
import CEOMessage from "./CEOMessage";
import Header from "./Header";
import { FiArrowRight } from "react-icons/fi";

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "/assets/PackagePhotos/Kumana2.JPG",
    "/assets/PackagePhotos/Kumana1.jpg",
    "/assets/PackagePhotos/Kumana3.jpg",
    "/assets/PackagePhotos/KK.JPG",
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          background: "linear-gradient(135deg, #1b3c32, #3a6b46)",
          color: "#fff",
        }}
      >
        {/* Decorative Jungle Layer */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: isMobile ? "120px" : "200px",
            background:
              "url('/assets/green-trees-layer.svg') repeat-x bottom / cover",
            opacity: 0.4,
            zIndex: 1,
          }}
        />

        {/* LEFT SIDE - Slideshow */}
        <div
          style={{
            flex: 1,
            position: "relative",
            width: "100%",
            height: isMobile ? "50vh" : "100%",
            minHeight: isMobile ? "300px" : "100%",
            overflow: "hidden",
            clipPath: isMobile
              ? "none"
              : "polygon(0 0, 85% 0, 100% 100%, 0% 100%)",
          }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "opacity 1s ease-in-out",
                opacity: index === currentImage ? 1 : 0,
                filter: "brightness(0.9)",
              }}
            />
          ))}

          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.2))",
            }}
          />
        </div>

        {/* RIGHT SIDE - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          style={{
            flex: 1,
            padding: isMobile ? "20px 25px" : "0 60px",
            zIndex: 2,
            textAlign: isMobile ? "center" : "left",
            marginTop: isMobile ? "20px" : "0",
          }}
        >
          <h4
            style={{
              color: "#a8e6b5",
              letterSpacing: "3px",
              marginBottom: "10px",
              fontSize: isMobile ? "1rem" : "1.2rem",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Unparalleled Wildlife Expertise
          </h4>

          <h1
            style={{
              fontSize: isMobile ? "2rem" : "3.5rem",
              lineHeight: 1.3,
              fontWeight: 700,
              color: "#e9ffe7",
              marginBottom: "20px",
            }}
          >
            Kumana Wild Trails
          </h1>

          <p
            style={{
              fontSize: isMobile ? "0.95rem" : "1.1rem",
              lineHeight: 1.8,
              color: "#d4f5dc",
              maxWidth: "480px",
              margin: isMobile ? "0 auto" : "0",
            }}
          >
            Experience the raw beauty of Sri Lanka’s wildlife. From majestic
            elephants and rare leopards to the soothing greenery of Kumana’s
            wetlands, immerse yourself in nature’s finest symphony.
          </p>

          <div
            style={{
              marginTop: "30px",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "15px",
              justifyContent: isMobile ? "center" : "flex-start",
              alignItems: "center",
            }}
          >
            <a
  href="/PackageList"
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 36px",
    backgroundColor: "#e07b39",       // burnt orange
    borderRadius: "50px",
    color: "#ffffff",                 // white text
    textDecoration: "none",
    fontWeight: 600,
    letterSpacing: "1px",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)", // subtle shadow
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = "#ff944d";  // hover orange
    e.target.style.transform = "scale(1.05)";    // slight zoom
    e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = "#e07b39";
    e.target.style.transform = "scale(1)";
    e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
  }}
>
  Explore Now <FiArrowRight size={20} />
</a>
          </div>
        </motion.div>
      </section>

      {/* OTHER SECTIONS */}
      <div style={{ backgroundColor: "#f7fff9" }}>
        <HomeBelow />
        <HomeRest />
        <HomeBottom />
        <CEOMessage />
      </div>
    </>
  );
};

export default Home;
