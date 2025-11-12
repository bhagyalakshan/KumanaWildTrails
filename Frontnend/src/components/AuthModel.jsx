import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, provider } from "./config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export default function AuthModal({ onClose, isLogin, switchToLogin, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      await fetch(`${BASE_URL}/api/auth/firebase/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Auth-Type": "Firebase",
        },
      });

      localStorage.setItem(
        "user",
        JSON.stringify({ email: user.email, name: user.displayName, role: "CUSTOMER" })
      );

      navigate(`/Dashboard`);
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Google Login failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isLogin) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        await fetch(`${BASE_URL}/api/auth/firebase/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Auth-Type": "Firebase",
          },
        });

        localStorage.setItem(
          "user",
          JSON.stringify({ email: userCredential.user.email, name, role: "CUSTOMER" })
        );

        navigate(`/Dashboard`);
      } else {
        const res = await fetch(`${BASE_URL}/api/auth/lookup?email=${email}`);
        if (!res.ok) throw new Error("User not found.");
        const { role } = await res.json();

        if (role === "CUSTOMER") {
          await signInWithEmailAndPassword(auth, email, password);
          const token = await auth.currentUser.getIdToken();

          await fetch(`${BASE_URL}/api/auth/firebase`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          localStorage.setItem(
            "user",
            JSON.stringify({
              email,
              name: auth.currentUser.displayName || name,
              role: "CUSTOMER",
            })
          );

          navigate(`/Dashboard`);
        } else {
          const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!loginRes.ok) throw new Error("Incorrect credentials.");
          const data = await loginRes.json();

          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data));
          const decoded = jwtDecode(data.token);

          if (decoded.role === "ADMIN") navigate("/AdminDashboard");
          else if (decoded.role === "DRIVER") navigate("/DriverDashboard");
        }
      }
    } catch (err) {
      alert("Login failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`modal show d-block bg-dark bg-opacity-50 transition-opacity`}
      tabIndex="-1"
      role="dialog"
      onClick={onClose}
      style={{ transition: "opacity 0.4s ease" }}
    >
      <div
        className={`modal-dialog modal-dialog-centered modal-md transform transition-transform ${
          animate ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
        role="document"
        onClick={(e) => e.stopPropagation()}
        style={{ transition: "all 0.5s ease", maxHeight: "90vh" }}
      >
        <div
          className="modal-content border-0 rounded-4 overflow-hidden shadow-lg"
          style={{
            border: "2px solid rgba(34, 77, 34, 0.3)",
            background: "rgba(22, 33, 22, 0.95)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            className="modal-header py-3 px-4"
            style={{
              background: "linear-gradient(90deg, #1b3a1b, #276627)",
              color: "#eaf4ea",
              minHeight: "70px",
            }}
          >
            <h5 className="modal-title fw-bold fs-5">
              {isLogin ? "Login to KUMANA WILD TRAILS" : "Create an Account"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-5" style={{ minHeight: "500px" }}>
            {isLoading && (
              <div className="text-center mb-3">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control form-control-md rounded-3 shadow-sm border border-success text-white bg-transparent placeholder-white"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ fontSize: "0.95rem" }}
                  />
                </div>
              )}

              <div className="mb-3">
                <input
                  type="email"
                  className="form-control form-control-md rounded-3 shadow-sm border border-success text-white bg-transparent placeholder-white"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ fontSize: "0.95rem" }}
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control form-control-md rounded-3 shadow-sm border border-success text-white bg-transparent placeholder-white"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ fontSize: "0.95rem" }}
                />
              </div>

              <button
                type="submit"
                className="btn w-100 btn-md text-white fw-bold mb-3"
                disabled={isLoading}
                style={{
                  background: "linear-gradient(135deg, #28a745, #19692c)",
                  border: "2px solid #19692c",
                  borderRadius: "0.8rem",
                  boxShadow: "0 4px 12px rgba(40,167,69,0.2)",
                  transition: "all 0.3s ease",
                  fontSize: "0.95rem",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-white my-3" style={{ fontSize: "0.85rem" }}>
              Or continue with
            </p>

            <div className="d-flex flex-column gap-2 mb-3">
              <button
                className="btn btn-dark border shadow-sm d-flex align-items-center justify-content-center rounded-3 btn-md"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                style={{
                  gap: "0.5rem",
                  borderColor: "#28a745",
                  color: "#28a745",
                  fontWeight: "500",
                  background: "rgba(0,0,0,0.55)",
                  transition: "all 0.3s ease",
                  fontSize: "0.9rem",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <FcGoogle className="fs-5" /> Continue with Google
              </button>
            </div>

            <p className="text-center mt-2 text-success" style={{ fontSize: "0.85rem" }}>
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="btn btn-link p-0 text-success fw-semibold"
                    onClick={switchToSignup}
                    disabled={isLoading}
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="btn btn-link p-0 text-success fw-semibold"
                    onClick={switchToLogin}
                    disabled={isLoading}
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </div>

          <style>
            {`
              .placeholder-white::placeholder {
                color: #c8e6c9 !important;
                opacity: 1;
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
}
