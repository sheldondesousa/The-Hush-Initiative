import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVoMeezFRzRu8QgvyA_2wunxr_71qfqWY",
  authDomain: "the-hum-app.firebaseapp.com",
  projectId: "the-hum-app",
  storageBucket: "the-hum-app.firebasestorage.app",
  messagingSenderId: "790880877636",
  appId: "1:790880877636:web:9b36811d33a4756fd4d011",
  measurementId: "G-K425SV6BDD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Set up authentication providers
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

export default app;
