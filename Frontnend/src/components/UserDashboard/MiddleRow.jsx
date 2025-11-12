import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../components/SafariTour';
import SafariTour from "../../components/SafariTour";

function BookingsPanel({ bookings }) {
  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });
  const [loyaltyData, setLoyaltyData] = useState({ currentPoints: 0, dollarRate: 1 });

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const customerEmail = user.email || null;

  // Fetch loyalty points when payment modal is opened
  useEffect(() => {
    if (showPaymentModal && customerEmail) {
      const fetchLoyaltyData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/customer/loyalty/${encodeURIComponent(customerEmail)}`);
          if (response.ok) {
            const data = await response.json();
            setLoyaltyData({ currentPoints: data.currentPoints, dollarRate: data.dollarRate });
            localStorage.setItem('user', JSON.stringify({ ...user, loyaltyPoints: data.currentPoints }));
          } else {
            setLoyaltyData({ currentPoints: user.loyaltyPoints || 0, dollarRate: 1 });
          }
        } catch (err) {
          console.error("Error fetching loyalty data:", err);
          setLoyaltyData({ currentPoints: user.loyaltyPoints || 0, dollarRate: 1 });
        }
      };
      fetchLoyaltyData();
    }
  }, [showPaymentModal, customerEmail, user]);

  const handleAction = (booking) => {
    const safariDate = new Date(booking.safariDate);
    safariDate.setHours(0, 0, 0, 0);

    if (booking.status === "assigned") {
      if (safariDate > today) {
        setSelectedBooking(booking);
        setShowPaymentModal(true);
      } else if (safariDate < today) {
        setSelectedBooking(booking);
        setShowReviewModal(true);
      } else {
        navigate(`/safari/tracking/${booking.id}`);
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      bookingId: selectedBooking.id,
      rating: reviewData.rating,
      comment: reviewData.comment,
    };

    try {
      const response = await fetch("http://localhost:8080/api/reviews/createReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Review submitted successfully!");
        setShowReviewModal(false);
        setReviewData({ rating: 0, comment: "" });
      } else {
        alert("Failed to submit review.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Error while submitting review.");
    }
  };

  return (
    <div className="p-4 rounded-4 shadow-sm h-100 bookings-panel">
      <style>
        {`
          .bookings-panel {
            background: linear-gradient(135deg, #f8fff8, #eafbea);
            border: 1px solid #d4f0d4;
          }
          .booking-card {
            background: #fff;
            border: 1px solid #e0e0e0;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .booking-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.1);
          }
          .booking-title {
            font-weight: 600;
            color: #2d572c;
          }
          .booking-info {
            color: #666;
          }

          /* Buttons */
          .btn-payment { background-color: #0d6efd; color: white; }
          .btn-review { background-color: #fd7e14; color: white; }
          .btn-track { background-color: #198754; color: white; }

          /* Responsive button & font sizes */
          @media (max-width: 576px) {
            .btn-action { font-size: 0.75rem; padding: 4px 10px; }
            .booking-title { font-size: 0.9rem; }
            .booking-info { font-size: 0.75rem; }
          }
          @media (min-width: 577px) and (max-width: 768px) {
            .btn-action { font-size: 0.85rem; padding: 6px 12px; }
            .booking-title { font-size: 1rem; }
            .booking-info { font-size: 0.8rem; }
          }
          @media (min-width: 769px) and (max-width: 992px) {
            .btn-action { font-size: 0.9rem; padding: 6px 14px; }
            .booking-title { font-size: 1.05rem; }
            .booking-info { font-size: 0.85rem; }
          }
          @media (min-width: 993px) {
            .btn-action { font-size: 0.85rem; padding: 5px 12px; }
            .booking-title { font-size: 1.1rem; }
            .booking-info { font-size: 0.9rem; }
          }
        `}
      </style>

      <h5 className="fw-bold text-success mb-3">Your Bookings</h5>

      {bookings.length === 0 && (
        <div className="text-muted text-center py-3">No bookings yet.</div>
      )}

      <div className="d-flex flex-column gap-3">
        {bookings.map((b) => {
          const safariDate = new Date(b.safariDate);
          safariDate.setHours(0, 0, 0, 0);

          const isUpcoming = safariDate > today && b.status === "assigned";
          const isPast = safariDate < today && b.status === "assigned";
          const isToday = safariDate.getTime() === today.getTime() && b.status === "assigned";

          let buttonLabel = null;
          let buttonClass = "";
          if (isUpcoming) {
            buttonLabel = "Proceed to Payment";
            buttonClass = "btn-payment";
          }
          if (isPast) {
            buttonLabel = "Add Review";
            buttonClass = "btn-review";
          }
          if (isToday) {
            buttonLabel = "Track Safari";
            buttonClass = "btn-track";
          }

          return (
            <div key={b.id} className="booking-card p-3 rounded-3">
              <div className="row align-items-center g-2">
                <div className="col-12 col-md-3">
                  <div className="booking-title">{b.safariPackageName}</div>
                  <div className="booking-info">{new Date(b.safariDate).toLocaleDateString()}</div>
                </div>
                <div className="col-6 col-md-3 booking-info"><strong>Pickup:</strong> {b.pickupLocation}</div>
                <div className="col-6 col-md-2 booking-info"><strong>Amount:</strong> ${b.totalAmount.toLocaleString()}</div>
                <div className="col-6 col-md-2 booking-info"><strong>Driver:</strong> {b.assignedDriver || "Not assigned"}</div>
                <div className="col-6 col-md-2 text-md-end text-start">
                  {buttonLabel ? (
                    <button
                      className={`btn btn-action rounded-pill ${buttonClass}`}
                      onClick={() => handleAction(b)}
                    >
                      {buttonLabel}
                    </button>
                  ) : (
                    <span className="badge bg-secondary">{b.status}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Review Modal --- */}
      {showReviewModal && selectedBooking && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title text-success">Add Review</h5>
                <button type="button" className="btn-close" onClick={() => setShowReviewModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Rating</label>
                    <select
                      className="form-select"
                      value={reviewData.rating}
                      onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                      required
                    >
                      <option value="">Select rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Comment</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => setShowReviewModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-success">Submit Review</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Payment Summary Modal --- */}
      {showPaymentModal && selectedBooking && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title text-success">Booking Summary</h5>
                <button type="button" className="btn-close" onClick={() => setShowPaymentModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Package:</strong> {selectedBooking.safariPackageName}</p>
                <p><strong>Date:</strong> {new Date(selectedBooking.safariDate).toLocaleDateString()}</p>
                <p><strong>Pickup Location:</strong> {selectedBooking.pickupLocation}</p>
                <p><strong>Total Amount:</strong> ${selectedBooking.totalAmount.toLocaleString()}</p>
                <p><strong>Assigned Driver:</strong> {selectedBooking.assignedDriver || "Not assigned"}</p>
                <p><strong>Current Loyalty Points:</strong> {loyaltyData.currentPoints}</p>

                {/* Auto apply loyalty reduction */}
                <p>
                  <strong>Loyalty Reduction:</strong> ${Math.min(loyaltyData.currentPoints / 1000, selectedBooking.totalAmount).toLocaleString()}
                </p>
                <p>
                  <strong>Net Amount:</strong> ${(
                    selectedBooking.totalAmount -
                    Math.min(loyaltyData.currentPoints / 1000, selectedBooking.totalAmount)
                  ).toLocaleString()}
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                <button
  type="button"
  className="btn btn-primary"
  onClick={async () => {
    try {
      const payload = {
        amount: selectedBooking.totalAmount * 100, // convert dollars to cents
        quantity: 1,
        currency: "usd",
        name: selectedBooking.safariPackageName || "Safari Booking",
      };

      const response = await fetch("http://localhost:8080/api/pay/safari/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status === "SUCCESS" && data.sessionUrl) {
        // Navigate to Stripe checkout
        window.location.href = data.sessionUrl;
      } else {
        alert("Failed to create payment session: " + data.message);
      }
    } catch (err) {
      console.error("Error creating payment session:", err);
      alert("Error while initiating payment.");
    }
  }}
>
  Proceed to Payment
</button>         
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiddleRow({ bookings }) {
  return (
    <div className="row g-4 mb-5">
      <div className="col-12">
        <BookingsPanel bookings={bookings} />
      </div>
      <div className="col-12">
        <SafariTour />
      </div>
    </div>
  );
}

export default MiddleRow;
