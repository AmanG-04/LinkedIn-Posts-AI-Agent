"use client";
import { useEffect } from "react";

export default function BackendPing() {
  useEffect(() => {
    fetch("https://linkedin-agent-backend.onrender.com/").catch(() => {});
  }, []);

  return null; // This component doesn't render anything
}
