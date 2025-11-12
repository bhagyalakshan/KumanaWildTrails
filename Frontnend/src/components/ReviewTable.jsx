import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ReviewWidget() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [filters, setFilters] = useState({ rating: "all", driver: "all" });
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/reviews/getAll")
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => b.rating - a.rating);
        setReviews(sorted);
        setFilteredReviews(sorted);
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  }, []);

  const drivers = ["all", ...new Set(reviews.map((r) => r.driverName).filter(Boolean))];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    let temp = [...reviews];
    if (name === "rating" && value !== "all") temp = temp.filter((r) => r.rating === parseInt(value));
    if (name === "driver" && value !== "all") temp = temp.filter((r) => r.driverName === value);
    setFilteredReviews(temp);
  };

  const sanitizeName = (name) => {
    if (!name) return "Anonymous";
    return name.replace(/[-\s]?\d{7,}/g, "").trim();
  };

  const reviewsToShow = showAll ? filteredReviews : filteredReviews.slice(0, 6);

  return (
    <div className="container py-5">
      <style>{`
        .review-section {
          max-width: 1200px;
          margin: 0 auto;
          background: linear-gradient(180deg, #ffffff 0%, #f6f6f6 100%);
          border-radius: 20px;
          box-shadow: 0 4px 25px rgba(0,0,0,0.08);
          padding: 3rem 2rem;
          transition: all 0.3s ease;
        }

        .header-row {
          text-align: center;
          font-size: 2.4rem;
          font-weight: 800;
          color: #1a2b0f;
          letter-spacing: 0.5px;
          margin-bottom: 2.5rem;
          position: relative;
        }

        .header-row::after {
          content: "";
          display: block;
          width: 80px;
          height: 4px;
          background: linear-gradient(to right, #07540b, #a58e00);
          margin: 0.8rem auto 0;
          border-radius: 2px;
        }

        .main-row {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .left-col {
          flex: 1 1 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          background: #fafaf8;
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: inset 0 0 8px rgba(0,0,0,0.05);
        }

        .left-col img {
          max-width: 140px;
          border-radius: 16px;
          transition: transform 0.3s ease;
        }

        .left-col img:hover {
          transform: scale(1.05);
        }

        .filter-bar {
          display: flex;
          gap: 1rem;
          width: 100%;
        }

        .filter-bar select {
          height: 48px;
          border-radius: 12px;
          border: 1px solid #cbd5c0;
          background-color: #fff;
          font-size: 1rem;
          font-weight: 500;
          color: #333;
          padding-left: 0.8rem;
          transition: all 0.3s ease;
        }

        .filter-bar select:focus {
          border-color: #07540b;
          box-shadow: 0 0 6px rgba(7,84,11,0.25);
        }

        .right-col {
          flex: 3 1 600px;
        }

        .review-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.8rem;
        }

        .review-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 25px 22px;
          text-align: center;
          border: 1px solid #e4e4e4;
          box-shadow: 0 4px 14px rgba(0,0,0,0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .review-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.1);
        }

        .review-card .stars {
          display: flex;
          justify-content: center;
          gap: 4px;
          font-size: 1.4rem;
          margin-bottom: 10px;
        }

        .star-filled { color: #f4c20d; }
        .star-empty { color: #dcdcdc; }

        .review-card strong {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 6px;
          display: block;
        }

        .review-card .driver-name {
          font-size: 0.95rem;
          font-weight: 500;
          color: #07540b;
          margin-top: 10px;
        }

        .review-card p {
          font-size: 0.98rem;
          line-height: 1.5;
          color: #444;
          margin: 0;
          padding: 0 5px;
        }

        .show-more-btn {
          margin-top: 2rem;
          background: linear-gradient(to right, #07540b, #a58e00);
          border: none;
          padding: 0.8rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .show-more-btn:hover {
          background: linear-gradient(to right, #063f0a, #8a7700);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.2);
        }

        @media(max-width: 992px){
          .header-row { font-size: 2rem; }
          .left-col img { max-width: 120px; }
        }

        @media(max-width: 768px){
          .review-section { margin: 0 10px; padding: 2rem 1.5rem; }
          .main-row { flex-direction: column; }
          .header-row { font-size: 1.8rem; }
        }

        @media(max-width: 576px){
          .review-card { padding: 20px 15px; }
        }
      `}</style>

      <div className="review-section">
        <div className="header-row">Kumana Wild Trails Reviews</div>

        <div className="main-row">
          <div className="left-col">
            <img src="/assets/logo.png" alt="Wild Trails Logo" />
            <div className="filter-bar">
              <select className="form-select" name="rating" value={filters.rating} onChange={handleFilterChange}>
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <select className="form-select" name="driver" value={filters.driver} onChange={handleFilterChange}>
                {drivers.map((d, idx) => (
                  <option key={idx} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="right-col">
            <div className="review-grid">
              {reviewsToShow.length > 0 ? (
                reviewsToShow.map((review, idx) => {
                  const fullStars = Math.floor(review.rating);
                  const emptyStars = 5 - fullStars;
                  return (
                    <div key={idx} className="review-card">
                      <div className="stars">
                        {[...Array(fullStars)].map((_, i) => <span key={i} className="star-filled">★</span>)}
                        {[...Array(emptyStars)].map((_, i) => <span key={i} className="star-empty">★</span>)}
                      </div>
                      <strong>{sanitizeName(review.customerName)}</strong>
                      <p>{review.comment}</p>
                      <span className="driver-name">Driver: {sanitizeName(review.driverName)}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted">No reviews available.</p>
              )}
            </div>

            {filteredReviews.length > 6 && (
              <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Show Less" : "Show More Reviews"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
