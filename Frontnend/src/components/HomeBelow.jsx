import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Ninja from "./Ninja";

const experiences = [
  { title: "Experiences", image: "/assets/ex.jpg", path: "/PackageList" },
  { title: "Wild Safaris", image: "/assets/wild.jpg", path: "/PackageList" },
  { title: "Day Tours", image: "/assets/ac.jpg", path: "/Taxi" },
  { title: "Activities", image: "/assets/cc.jpg", path: "/Activities" },
];

const HomeBelow = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100%",
        background: "linear-gradient(180deg, #f9fafb 0%, #e8f0ef 100%)",
        padding: "80px 20px",
        borderRadius: "0 0 40px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "60px",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: "inline-block",
            padding: "6px 20px",
            borderRadius: "999px",
            backgroundColor: "#0B3C49",
            color: "white",
            fontWeight: 600,
            fontSize: "0.8rem",
            letterSpacing: "1px",
          }}
        >
          DISCOVER TOP THINGS TO DO
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            fontWeight: 800,
            fontSize: "2.4rem",
            color: "#1A1A1A",
            marginTop: "20px",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Explore Unforgettable Moments
        </motion.h2>
        <p
          style={{
            color: "#4B5563",
            fontSize: "1.1rem",
            maxWidth: "800px",
            margin: "20px auto 0 auto",
            lineHeight: 1.6,
          }}
        >
          Experience the essence of Sri Lanka — from thrilling safaris to cultural discoveries
          and hands-on activities. Every journey is designed to connect you to nature, people,
          and unforgettable memories.
        </p>
      </div>

      {/* Experiences Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "30px",
          justifyItems: "center",
          marginBottom: "60px",
        }}
      >
        {experiences.map((exp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate(exp.path)}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "320px",
              height: "420px",
              borderRadius: "20px",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              background: "#000",
            }}
          >
            <img
              src={exp.image}
              alt={exp.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.85)",
                transition: "0.4s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%)",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(255,255,255,0.8)",
                padding: "12px 30px",
                borderRadius: "999px",
                fontWeight: 600,
                color: "#1A1A1A",
                backdropFilter: "blur(8px)",
                textAlign: "center",
              }}
            >
              {exp.title}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        style={{
          textAlign: "center",
          background:
            "linear-gradient(135deg, rgba(11,60,73,1) 0%, rgba(0,77,64,1) 100%)",
          padding: "50px 20px",
          borderRadius: "20px",
          maxWidth: "900px",
          margin: "0 auto",
          color: "white",
        }}
      >
        <h3
          style={{
            fontSize: "1.8rem",
            fontWeight: 700,
            marginBottom: "15px",
          }}
        >
          Plan Your Dream Adventure Today
        </h3>
        <p
          style={{
            fontSize: "1rem",
            color: "rgba(255,255,255,0.85)",
            marginBottom: "25px",
          }}
        >
          Our team is available 24×7 to help you customize the perfect itinerary.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/ContactUs")}
          style={{
            backgroundColor: "#ff6b35",
            color: "white",
            border: "none",
            padding: "14px 38px",
            borderRadius: "40px",
            fontWeight: "600",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 6px 15px rgba(255,107,53,0.4)",
          }}
        >
          ✨ 24×7 Trip Planner
        </motion.button>
      </motion.div>

      <div style={{ marginTop: "60px" }}>
        <Ninja />
      </div>
    </div>
  );
};

export default HomeBelow;
