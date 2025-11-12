import React, { useState, useEffect } from "react";
import Header from "./UserDashboard/Hd"; 
import TopRow from "./UserDashboard/TopRow";
import MiddleRow from "./UserDashboard/MiddleRow";

export default function Dashboard({ user: initialUser }) {
  // Load user from localStorage if exists, otherwise use initialUser
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user] = useState(
    storedUser || initialUser || { name: "Lahiru Lakshan", email: "cst21084@std.uwu.ac.lk", avatar: "" }
  );

  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch bookings by email
    fetch(`http://localhost:8080/api/bookings/by-email?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error(err));

    // Fetch loyalty points
    fetch(`http://localhost:8080/api/loyalty?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => setLoyaltyPoints(data.points || 0))
      .catch((err) => console.error(err));
  }, [user.email]);

  function handleLogout() {
    console.log("logout");
    localStorage.removeItem("user"); // clear user on logout
    // optional: redirect to login page
    // window.location.href = "/login";
  }

  function handleAddReview(bookingId) {
    alert("Open review modal for booking " + bookingId);
  }

  return (
    <div className="container-fluid p-0">
      <Header user={user} onLogout={handleLogout} />
      <div className="container-fluid mt-4">
        <TopRow user={user} loyaltyPoints={loyaltyPoints} />
      </div>
      <div className="container">
        <MiddleRow bookings={bookings} onAddReview={handleAddReview} />
      </div>
    </div>
  );
}
