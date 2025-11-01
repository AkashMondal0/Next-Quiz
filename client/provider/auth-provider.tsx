'use client';

import { useEffect, useState } from "react";
import SplashScreen from "@/components/splashScreen";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return <>
    {showSplash ? <SplashScreen /> : null}
    {children}</>;
};

export default AuthProvider;
