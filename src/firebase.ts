import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrRNHmLUpHHbT1L_kJeIxxuPtnjZITdmEI",
  authDomain: "carwashcompanion.firebaseapp.com",
  projectId: "carwashcompanion",
  storageBucket: "carwashcompanion.appspot.com",  // ✅ fixed
  messagingSenderId: "800189380712",
  appId: "1:800189380712:web:1bac799af9ba51e52963dd",
  measurementId: "G-9R0VRK4W93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
