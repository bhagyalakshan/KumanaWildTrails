import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export default function TopRow() {
  const [loyaltyData, setLoyaltyData] = useState({ currentPoints: 0, dollarRate: 1 }); // Store full object
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const email = user.email;
          if (!email) {
            throw new Error("User email not found");
          }

          const token = await user.getIdToken();
          console.log("Firebase Token:", token);

          const res = await fetch(`${BASE_URL}/api/customer/loyalty/${email}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error(`Failed to fetch points: ${res.status} ${res.statusText}`);
          }

          const data = await res.json();
          // Validate response structure
          if (typeof data.currentPoints === "number" && typeof data.dollarRate === "number") {
            setLoyaltyData(data); // Store the full object
            setError(null);
          } else {
            throw new Error("Invalid loyalty data structure");
          }
        } catch (err) {
          console.error("Error fetching loyalty points:", err);
          setError("Failed to load loyalty points. Please try again.");
          setLoyaltyData({ currentPoints: 0, dollarRate: 1 }); // Fallback
        }
      } else {
        console.error("No user is logged in");
        setError("Please log in to view loyalty points.");
        setLoyaltyData({ currentPoints: 0, dollarRate: 1 }); // Fallback
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="row my-5">
      <div className="col-12">
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center text-white rounded-3"
          style={{
            backgroundImage: "url('/assets/PackagePhotos/Kumana1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "5rem 2rem",
            minHeight: "250px",
          }}
        >
          <h2 className="fw-bold mb-3">Ready for Your Next Adventure?</h2>
          <p className="lead fw-semibold mb-4">
            Discover breathtaking wildlife experiences in Sri Lanka&apos;s most iconic parks
          </p>
          <div className="bg-dark bg-opacity-50 px-4 py-3 rounded-3">
            <h4 className="mb-1 fw-bold">Loyalty Points</h4>
            <div className="display-5 fw-bold">{loyaltyData.currentPoints}</div>
            <small>Points Available</small>
          </div>
          {error && <p className="text-danger mt-3">{error}</p>}
        </div>
      </div>
    </div>
  );
}