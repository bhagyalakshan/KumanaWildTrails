import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import "bootstrap/dist/css/bootstrap.min.css";

// Import your pages
import Home from "./components/Home";
import PackageList from "./components/PackageList/PackageList";
import Kumana from "./components/Kumana/Kumana";
import Camping from "./components/Camping/Camping";
import Airport from "./components/AirportTransport/Airport";
import Ella from "./components/Ella/Ella";
import Yala from "./components/Yala/Yala";
import Mirissa from "./components/Mirissa/Mirissa";
import Kudumbigala from "./components/Kudumbigala/Kudumbigala";
import Okanda from "./components/Okanda/Okanda";
import Lagoon from "./components/Lagoon/Lagoon";
import CustomTours from "./components/CustomTors/CustomTours";
import TukTuk from "./components/TukTuk/TukTuk";
import Surf from "./components/Surf/Surf";
import Cooking from "./components/Cooking/Cooking";
import AboutUS from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Blog from "./components/Blog";
import Activities from "./components/PackageList/Activities";
import Taxi from "./components/PackageList/Tours";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import CookiePolicy from "./components/CookiePolicy";
import SiteMap from "./components/SiteMap";
import Ancient from "./components/Ancient/Ancient";
import Agenda from "./components/Agenda";
import AdminDashboard from "./components/AdminDashboard";
import DriverDashboard from "./components/DriverDashboard";
import Admin_Booking_Check from "./components/Admin_Booking_check";
import Admin_Add_Driver from "./components/Admin_Add_Driver";
import Admin_Edit_Packages from "./components/Admin_Edit_Packages";
import ContactMessages from "./components/ContactMessages";
import AdminBlogAdd from "./components/AdminBlogAdd";
import BookingStatsDashboard from "./components/BookingStats";
import Dashboard from "./components/Dashboard";
import Successpage from "./components/SuccessPage";
import Fullday from "./components/Kumana/Fullday";
import Halfday from "./components/Kumana/Halfday";
import BirdSection from "./components/Kumana/BirdwatchingHomeSection";

const AppWrapper = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAdmin = location.pathname.startsWith("/AdminDashboard");
  const isUser = location.pathname.startsWith("/Dashboard");
  const isSuccess = location.pathname === "/SuccessPage";
  const isDriver = location.pathname === "/DriverDashboard";

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  return (
    <>
      <ScrollToTop />

      {/* Show Header only if not Home, Admin, or Driver */}
      {!isHome && !isAdmin && !isDriver && !isUser && !isSuccess && <Header />}

      <div
        className="container-fluid px-0"
        style={{
          backgroundImage: !isAdmin ? "url('/assets/back.jpeg')" : "url('/assets/admin.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          minHeight: "100vh",
          overflowX: "hidden",
          overflowAnchor: "none",
          paddingTop: !isHome && !isAdmin && !isUser && !isDriver && !isSuccess ? "80px" : "0",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking/PackageList" element={<PackageList />} />
          <Route path="/booking/Kumana" element={<Kumana />} />
          <Route path="/booking/Camping" element={<Camping />} />
          <Route path="/booking/Airport" element={<Airport />} />
          <Route path="/booking/Ella" element={<Ella />} />
          <Route path="/booking/Yala" element={<Yala />} />
          <Route path="/booking/Mirissa" element={<Mirissa />} />
          <Route path="/booking/Kudumbigala" element={<Kudumbigala />} />
          <Route path="/booking/Okanda" element={<Okanda />} />
          <Route path="/booking/Lagoon" element={<Lagoon />} />
          <Route path="/booking/CustomTours" element={<CustomTours />} />
          <Route path="/booking/TukTuk" element={<TukTuk />} />
          <Route path="/booking/Surf" element={<Surf />} />
          <Route path="/booking/Cooking" element={<Cooking />} />
          <Route path="/AboutUs" element={<AboutUS />} />
          <Route path="/PackageList" element={<PackageList />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/booking/AboutUs" element={<AboutUS />} />
          <Route path="/booking/ContactUs" element={<ContactUs />} />
          <Route path="/booking/Blog" element={<Blog />} />
          <Route path="/Blog" element={<Blog />} />
          <Route path="/Activities" element={<Activities />} />
          <Route path="/Taxi" element={<Taxi />} />
          <Route path="/booking/Taxi" element={<Taxi />} />
          <Route path="/booking/Activities" element={<Activities />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
          <Route path="/CookiePolicy" element={<CookiePolicy />} />
          <Route path="/SiteMap" element={<SiteMap />} />
          <Route path="/booking/Ancient" element={<Ancient />} />
          <Route path="/Agenda" element={<Agenda />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/DriverDashboard" element={<DriverDashboard />} />
          <Route path="/AdminDashboard/CheckBookings" element={<Admin_Booking_Check />} />
          <Route path="/AdminDashboard/AddDriver" element={<Admin_Add_Driver/>} />
          <Route path="/AdminDashboard/EditPackages" element={<Admin_Edit_Packages/>} />
          <Route path="/AdminDashboard/ViewMessages" element={<ContactMessages/>} />
          <Route path="/AdminDashboard/BlogAdd" element={<AdminBlogAdd/>} />
          <Route path="/AdminDashboard/Stats" element={<BookingStatsDashboard/>} />
           <Route path="/booking/CookiePolicy" element={<CookiePolicy />} />
          <Route path="/booking/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/booking/TermsAndConditions" element={<TermsAndConditions />} />
          <Route path="/booking/SiteMap" element={<SiteMap />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Successpage" element={<Successpage />} />
           <Route path="/Fullday" element={<Fullday />} />
            <Route path="/HalfDay" element={<Halfday />} />
             <Route path="/Birdwatching" element={<BirdSection />} />
        </Routes>
      </div>

      {/* Show Footer only if not Admin */}
      {!isAdmin && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppWrapper />
    </Router>
  );
};

export default App;
