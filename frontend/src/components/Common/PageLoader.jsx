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

    // Total duration 3s
    const fadeTimer = setTimeout(() => {
      setFading(true); 
    }, 3000);

    const hideTimer = setTimeout(() => {
      setVisible(false); 
      setFading(false);
    }, 3400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-main"
      style={{
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      <style>{`
        .reveal-container {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
        }

        .center-logo {
          position: absolute;
          width: 75px;
          height: 75px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 30px rgba(0,0,0,0.3);
          z-index: 10;
          /* Continuous fluid animation */
          animation: logo-reveal 1.5s cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
        }

        @keyframes logo-reveal {
          0%, 100% { transform: scale(0) rotate(-15deg); opacity: 0; }
          50% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .cube-3d {
          position: absolute;
          width: 32px;
          height: 32px;
          transform-style: preserve-3d;
          /* Continuous fluid animation */
          animation: cubes-explode 1.5s cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
        }

        /* Diagonal positions */
        .c1 { --tx: -80px; --ty: -80px; transform: translate(-16px, -16px); }
        .c2 { --tx: 80px; --ty: -80px; transform: translate(16px, -16px); }
        .c3 { --tx: 80px; --ty: 80px; transform: translate(16px, 16px); }
        .c4 { --tx: -80px; --ty: 80px; transform: translate(-16px, 16px); }

        @keyframes cubes-explode {
          0%, 100% { 
            transform: translate(0, 0) rotateX(0deg) rotateY(0deg); 
          }
          50% { 
            transform: translate(var(--tx), var(--ty)) rotateX(90deg) rotateY(90deg) scale(0.8); 
          }
        }

        .cube-face {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .blue .cube-face   { background: #0f2b4d; }
        .blue .front       { transform: translateZ(16px); filter: brightness(1.2); }
        .blue .back        { transform: rotateY(180deg) translateZ(16px); filter: brightness(0.8); }
        .blue .top         { transform: rotateX(90deg) translateZ(16px); filter: brightness(1.1); }
        .blue .bottom      { transform: rotateX(-90deg) translateZ(16px); filter: brightness(0.6); }

        .yellow .cube-face { background: #d4af37; }
        .yellow .front     { transform: translateZ(16px); filter: brightness(1.2); }
        .yellow .back      { transform: rotateY(180deg) translateZ(16px); filter: brightness(0.8); }
        .yellow .top       { transform: rotateX(90deg) translateZ(16px); filter: brightness(1.1); }
        .yellow .bottom    { transform: rotateX(-90deg) translateZ(16px); filter: brightness(0.6); }

        .floor-glow {
          position: absolute;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, var(--color-primary) 0%, transparent 70%);
          opacity: 0.1;
          filter: blur(25px);
          animation: glow-pulse 1.5s cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { transform: scale(0.5); opacity: 0.02; }
          50% { transform: scale(1.5); opacity: 0.2; }
        }
      `}</style>

      <div className="reveal-container">
        <div className="floor-glow" />
        
        <div className="center-logo">
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>

        <div className="cube-3d c1 blue">
          <div className="cube-face front"></div><div className="cube-face back"></div>
          <div className="cube-face top"></div><div className="cube-face bottom"></div>
        </div>
        <div className="cube-3d c2 yellow">
          <div className="cube-face front"></div><div className="cube-face back"></div>
          <div className="cube-face top"></div><div className="cube-face bottom"></div>
        </div>
        <div className="cube-3d c3 blue">
          <div className="cube-face front"></div><div className="cube-face back"></div>
          <div className="cube-face top"></div><div className="cube-face bottom"></div>
        </div>
        <div className="cube-3d c4 yellow">
          <div className="cube-face front"></div><div className="cube-face back"></div>
          <div className="cube-face top"></div><div className="cube-face bottom"></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
