import React, { useEffect, useRef, useState } from "react";
import {
  FaCar,
  FaClock,
  FaUtensils,
  FaRoute,
  FaLandmark,
} from "react-icons/fa";
import { motion } from "framer-motion";

const stats = [
  { icon: <FaCar />, label: "Half Day Wild Safaris", value: 500 },
  { icon: <FaClock />, label: "Full Day Wild Safaris", value: 350 },
  { icon: <FaUtensils />, label: "Cooking Classes", value: 100 },
  { icon: <FaRoute />, label: "Day Trips", value: 120 },
  { icon: <FaLandmark />, label: "Cultural & Heritage Visits", value: 100 },
];

const CounterCard = ({ icon, label, value, inView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || count === value) return;
    const step = Math.ceil(value / 60);
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev + step >= value) {
          clearInterval(interval);
          return value;
        }
        return prev + step;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [inView, value, count]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="shadow-sm text-center d-flex flex-column align-items-center justify-content-center"
      style={{
        borderRadius: "16px",
        backgroundColor: "#ffffffcc",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "default",
        width: "180px",
        height: "160px",
        margin: "12px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
    >
      <div
        aria-label={label}
        style={{ color: "#0b3c49", fontSize: "2rem", marginBottom: "8px" }}
      >
        {icon}
      </div>
      <h4 style={{ fontWeight: 700, color: "#212529", marginBottom: "4px" }}>
        {count}
        <span style={{ color: "#e67e22" }}>+</span>
      </h4>
      <p
        style={{
          color: "#6c757d",
          fontSize: "0.85rem",
          marginBottom: 0,
          lineHeight: 1.2,
          padding: "0 6px",
        }}
      >
        {label}
      </p>
    </motion.div>
  );
};

const HomeBottom = () => {
  const sectionRef = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "linear-gradient(120deg, #275a42 0%, #20a860 100%)",
        color: "whitesmoke",
        padding: "60px 0",
        borderTopLeftRadius: "30px",
        borderBottomRightRadius: "30px",
      }}
    >
      <div className="container text-center">
        <p
          style={{
            display: "inline-block",
            padding: "6px 20px",
            borderRadius: "999px",
            backgroundColor: "#0b3c49",
            color: "white",
            fontWeight: 600,
            fontSize: "0.8rem",
            letterSpacing: "1px",
            marginBottom: "10px",
          }}
        >
          Excellency
        </p>

        <h2
          style={{
            fontWeight: 800,
            fontSize: "2.2rem",
            textShadow: "1px 1px 4px rgba(0,0,0,0.4)",
            marginBottom: "40px",
          }}
        >
          Offered So Far
        </h2>

        <div className="row justify-content-center g-3 g-md-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center"
            >
              <CounterCard
                icon={s.icon}
                label={s.label}
                value={s.value}
                inView={inView}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBottom;
