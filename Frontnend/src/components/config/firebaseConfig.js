// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // <-- add GoogleAuthProvider

const firebaseConfig = {
  apiKey: "AIzaSyB3tFPR-x7gKC_YjK1Pi73EdqwIaizuEQk",
  authDomain: "kumanawildtrails-83deb.firebaseapp.com",
  projectId: "kumanawildtrails-83deb",
  storageBucket: "kumanawildtrails-83deb.firebasestorage.app",
  messagingSenderId: "795812413983",
  appId: "1:795812413983:web:c92a6a04dbe95ee08d0b2a",
  measurementId: "G-4HXYF5ED3G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Create Google provider
const provider = new GoogleAuthProvider();

export { app, analytics, auth, provider };
