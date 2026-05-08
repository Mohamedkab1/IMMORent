import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/IMMORent.jpeg';

const PageLoader = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Show loader on route change
    setVisible(true);
    setFading(false);

    const fadeTimer = setTimeout(() => {
      setFading(true); // Start fade out
    }, 1500);

    const hideTimer = setTimeout(() => {
      setVisible(false); // Hide completely
      setFading(false);
    }, 1850);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-main"
      style={{
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.35s ease-in-out',
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      {/* Animated ring */}
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <div
          className="absolute rounded-full border-4 border-transparent"
          style={{
            width: 90,
            height: 90,
            borderTopColor: 'var(--color-primary)',
            borderRightColor: 'var(--color-primary)',
            animation: 'spin 0.9s linear infinite',
          }}
        />
        {/* Inner pulsing ring */}
        <div
          className="absolute rounded-full border-2 border-primary/20"
          style={{ width: 110, height: 110, animation: 'pulse 1.5s ease-in-out infinite' }}
        />
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800">
          <img src={logo} alt="IMMORent" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Brand name below */}
      <div className="absolute mt-36 text-center">
        <p className="text-lg font-black tracking-tight text-text-main">
          IMMO<span className="text-primary dark:text-secondary">Rent</span>
        </p>
        <div className="flex items-center justify-center gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-secondary"
              style={{
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
