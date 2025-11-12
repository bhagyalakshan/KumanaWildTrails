import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaUserFriends,
  FaLeaf,
  FaMoneyBillWave,
  FaRecycle,
  FaCar,
  FaLanguage,
  FaStar,
} from "react-icons/fa";

const isMobile = () => window.innerWidth <= 768;

const HomeRest = () => {
  const [mobile, setMobile] = useState(isMobile());

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const handleResize = () => setMobile(isMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const items = [
    {
      title: "Local Expertise",
      description:
        "Born and raised near Kumana, we know every trail, animal behavior, and secret spot in the park.",
      icon: <FaMapMarkerAlt size={34} color="#0b8ea3" />,
    },
    {
      title: "Personalized Safari Experience",
      description:
        "Private and small-group safaris tailored to your interests, with flexible timing and customized service.",
      icon: <FaUserFriends size={34} color="#0b8ea3" />,
    },
    {
      title: "Passionate Wildlife-Loving Guide",
      description:
        "Your safari is led by a true nature lover who doesn’t just drive — he shares stories, tracks animals, and respects the wild.",
      icon: <FaLeaf size={34} color="#0b8ea3" />,
    },
    {
      title: "Honest & Transparent Pricing",
      description:
        "Affordable, all-inclusive rates with no hidden costs — just great value and peace of mind.",
      icon: <FaMoneyBillWave size={34} color="#0b8ea3" />,
    },
    {
      title: "Responsible & Ethical Safaris",
      description:
        "We follow eco-friendly practices and ensure a safe, respectful experience for both you and the animals.",
      icon: <FaRecycle size={34} color="#0b8ea3" />,
    },
    {
      title: "Comfortable & Safe Vehicles",
      description:
        "Enjoy a smooth ride in our well-maintained, fully-equipped safari jeeps.",
      icon: <FaCar size={34} color="#0b8ea3" />,
    },
    {
      title: "English-Speaking Assistance",
      description:
        "Basic English support by our driver, plus Rushan available to guide you if needed for better understanding.",
      icon: <FaLanguage size={34} color="#0b8ea3" />,
    },
    {
      title: "Highly Rated by Real Travelers",
      description:
        "Top reviews on TripAdvisor, Google & Instagram — our guests return with unforgettable memories.",
      icon: <FaStar size={34} color="#0b8ea3" />,
    },
  ];

  return (
    <section
      style={{
        marginTop: mobile ? "60px" : "90px",
        marginBottom: "80px",
        padding: "0 20px",
        maxWidth: "1400px",
        marginInline: "auto",
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Section Tagline */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "12px" }}
      >
        <p
          style={{
            display: "inline-block",
            backgroundColor: "#0B3C49",
            color: "white",
            fontWeight: "600",
            letterSpacing: "1.5px",
            fontSize: "0.85rem",
            padding: "6px 20px",
            borderRadius: "999px",
            textTransform: "uppercase",
          }}
        >
          Why Choose Us
        </p>
      </motion.div>

      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          fontWeight: 700,
          fontSize: mobile ? "1.8rem" : "2.3rem",
          color: "#1A1A1A",
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        See Why Kumana Wild Trails Stands Out
      </motion.h2>

      {/* Grid Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "repeat(4, 1fr)",
          gap: "25px",
          alignItems: "stretch",
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            data-aos="fade-up"
            whileHover={{ y: -6, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{
              background: "white",
              borderRadius: "18px",
              boxShadow:
                "0 6px 20px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)",
              padding: "28px 20px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: mobile ? "auto" : "300px",
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(11, 142, 163, 0.12)",
                borderRadius: "14px",
                padding: "10px",
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </div>

            <h4
              style={{
                fontSize: mobile ? "1.1rem" : "1.25rem",
                fontWeight: 600,
                color: "#0B3C49",
                marginBottom: "10px",
              }}
            >
              {item.title}
            </h4>

            <p
              style={{
                fontSize: mobile ? "0.9rem" : "1rem",
                color: "#4B5563",
                lineHeight: 1.5,
              }}
            >
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Subtle Background Accent */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          left: "-40px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(11,60,73,0.15) 0%, transparent 70%)",
          zIndex: -1,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          right: "-60px",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(11,60,73,0.1) 0%, transparent 70%)",
          zIndex: -1,
        }}
      ></div>
    </section>
  );
};

export default HomeRest;
