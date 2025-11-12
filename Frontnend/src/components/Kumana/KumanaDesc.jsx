import React from "react";

const KumanaDesc = () => {
  return (
    <div className="kumana-section">
      <div className="left-column">
        <h1 className="section-title">Kumana National Park</h1>
        <p className="section-description">
          Kumana National Park, located on the southeastern coast of Sri Lanka,
          is a paradise for wildlife lovers and birdwatchers. Famous for its
          wetlands and lagoons, the park is home to over 200 species of birds,
          including pelicans, painted storks, and spoonbills. Beyond the vibrant
          birdlife, Kumana also offers encounters with elephants, leopards,
          crocodiles, and a variety of other fascinating species. The tranquil
          landscapes of Kumana provide an unforgettable safari experience that
          blends nature, serenity, and adventure.
        </p>
      </div>

      <div className="right-column">
        <div className="photo-collage">
          <div className="collage-item tall">
            <img src="/assets/PackagePhotos/Kumana1.jpg" alt="Kumana Safari 1" />
          </div>
          <div className="collage-item">
            <img src="/assets/PackagePhotos/Kumana2.JPG" alt="Kumana Safari 2" />
          </div>
          <div className="collage-item wide">
            <img src="/assets/PackagePhotos/local4.JPG" alt="Kumana Safari 3" />
          </div>
          <div className="collage-item">
            <img src="/assets/PackagePhotos/Yala1.jpg" alt="Kumana Safari 4" />
          </div>
          <div className="collage-item tall">
            <img src="/assets/PackagePhotos/Yala4.jpg" alt="Kumana Safari 5" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .kumana-section {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100%;
          padding: 3rem 6rem;
          box-sizing: border-box;
          
          gap: 3rem;
          overflow: hidden;
        }

        .left-column {
          flex: 1;
          max-width: 48%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .section-title {
          font-family: "Poppins", sans-serif;
          font-size: 3rem;
          color: #1a3e2e;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .section-description {
          font-family: "Roboto", sans-serif;
          font-size: 1.1rem;
          color: #444;
          line-height: 1.8;
          text-align: justify;
        }

        .right-column {
          flex: 1;
          max-width: 52%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .photo-collage {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 150px; /* ✅ Reduced height for desktop */
          gap: 10px;
          width: 100%;
          height: 100%;
        }

        .collage-item {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .collage-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease, opacity 0.3s ease;
        }

        .collage-item:hover img {
          transform: scale(1.1);
          opacity: 0.9;
        }

        .tall {
          grid-row: span 2;
        }

        .wide {
          grid-column: span 2;
        }

        /* ✅ Responsive adjustments */
        @media (max-width: 1024px) {
          .section-title {
            font-size: 2.4rem;
          }

          .section-description {
            font-size: 1rem;
          }

          .photo-collage {
            grid-auto-rows: 130px; /* Slightly reduced for tablets */
          }
        }

        @media (max-width: 768px) {
          .kumana-section {
            flex-direction: column;
            height: auto;
            padding: 2rem;
          }

          .left-column,
          .right-column {
            max-width: 100%;
          }

          .section-title {
            font-size: 2rem;
            text-align: center;
          }

          .section-description {
            text-align: center;
            font-size: 0.95rem;
          }

          /* ✅ Keep collage same as before in mobile */
          .photo-collage {
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: 120px;
            gap: 8px;
          }
        }

        @media (max-width: 480px) {
          .section-title {
            font-size: 1.6rem;
          }

          .section-description {
            font-size: 0.9rem;
          }

          /* ✅ Keep same beautiful collage style */
          .photo-collage {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 130px;
          }
        }
      `}</style>
    </div>
  );
};

export default KumanaDesc;
