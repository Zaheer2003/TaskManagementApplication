"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Test() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setStatus("User Logged In ✅");
      } else {
        setStatus("No User (Firebase Working) ✅");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Firebase Status</h1>
      <p>{status}</p>
    </div>
  );
}