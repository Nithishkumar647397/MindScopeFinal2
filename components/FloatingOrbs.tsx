import React from 'react';

export const FloatingOrbs: React.FC = () => {
  const bubbles = [
    // Original 6
    { size: 100, left: '10%', delay: '0s', duration: '18s' },
    { size: 65, left: '25%', delay: '3s', duration: '22s' },
    { size: 45, left: '45%', delay: '6s', duration: '16s' },
    { size: 85, left: '65%', delay: '2s', duration: '20s' },
    { size: 55, left: '82%', delay: '5s', duration: '24s' },
    { size: 35, left: '5%', delay: '4s', duration: '17s' },
    
    // New additions
    { size: 70, left: '15%', delay: '1s', duration: '25s' },
    { size: 40, left: '35%', delay: '7s', duration: '19s' },
    { size: 90, left: '55%', delay: '2s', duration: '28s' },
    { size: 30, left: '75%', delay: '5s', duration: '23s' },
    { size: 60, left: '92%', delay: '8s', duration: '21s' },
    { size: 50, left: '2%', delay: '9s', duration: '26s' },
    { size: 80, left: '30%', delay: '4s', duration: '29s' },
    { size: 25, left: '60%', delay: '1s', duration: '15s' },
    { size: 75, left: '95%', delay: '6s', duration: '24s' },
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {bubbles.map((bubble, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: bubble.left,
            bottom: '-120px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.18)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            animation: `floatUp ${bubble.duration} ease-in-out infinite`,
            animationDelay: bubble.delay,
          }}
        />
      ))}
    </div>
  );
};
