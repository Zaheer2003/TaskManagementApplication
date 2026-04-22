// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBlmZjaoqhzQJmV1UIGXcmleZ77iZ7Rt6c",
  authDomain: "mini-task-management-app.firebaseapp.com",
  projectId: "mini-task-management-app",
  storageBucket: "mini-task-management-app.firebasestorage.app",
  messagingSenderId: "517208456745",
  appId: "1:517208456745:web:fb4c9df47dd05347222638",
  measurementId: "G-K33GTDSJP8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);