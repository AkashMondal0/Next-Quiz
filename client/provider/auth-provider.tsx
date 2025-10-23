'use client';

import { useEffect, useState } from "react";
import SplashScreen from "@/components/splashScreen";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;
  return <>{children}</>;
};

export default AuthProvider;
