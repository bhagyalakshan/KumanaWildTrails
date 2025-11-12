import React, { useEffect, useState } from "react";

const CEOMessage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="py-5"
      style={{
      
        borderRadius: "20px",
        margin: "40px 10px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
         borderTopRightRadius: "30px",
        borderBottomLeftRadius: "30px",
      }}
    >
      <div className="container">
        <div className="text-center mb-4">
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
            CEO Message
          </p>
          <h2
            style={{
              fontWeight: 800,
              fontSize: isMobile ? "1.8rem" : "2.5rem",
              color: "#212529",
            }}
          >
            Message from Rushan
          </h2>
        </div>

        <div className="row align-items-center justify-content-center">
          {/* CEO Image */}
          <div className="col-md-4 text-center mb-4 mb-md-0">
            <img
              src="/assets/CEO.jpg"
              alt="CEO Rushan"
              className="img-fluid rounded-circle shadow"
              style={{
                width: isMobile ? "200px" : "260px",
                height: isMobile ? "200px" : "260px",
                objectFit: "cover",
                
              }}
            />
          </div>

          {/* Message */}
          <div className="col-md-8">
            <p
              style={{
                fontSize: isMobile ? "0.95rem" : "1.1rem",
                lineHeight: 1.7,
                color: "#495057",
                fontWeight: 400,
                backgroundColor: "rgba(255,255,255,0.8)",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              “As someone born and raised near Kumana, guiding safaris isn’t just
              my job — it’s a way of life. I know every trail, animal sign, and
              hidden corner of the park. With a deep love for nature and a
              commitment to eco-friendly practices, my team and I offer
              personalized safaris designed for adventure seekers and peace
              lovers alike. Expect honest pricing, safe vehicles, and heartfelt
              service — we’ll ensure your journey into the wild is
              unforgettable.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CEOMessage;
