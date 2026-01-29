import React from 'react';

export const FloatingOrbs: React.FC = () => {
  const orbStyles = [
    { size: 100, left: '10%', delay: '0s', duration: '18s' },
    { size: 70, left: '25%', delay: '3s', duration: '22s' },
    { size: 50, left: '45%', delay: '6s', duration: '16s' },
    { size: 90, left: '65%', delay: '2s', duration: '20s' },
    { size: 60, left: '80%', delay: '5s', duration: '24s' },
    { size: 40, left: '5%', delay: '4s', duration: '17s' },
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
      {orbStyles.map((orb, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            left: orb.left,
            bottom: '-120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 40%, transparent 70%)',
            filter: 'blur(2px)',
            animation: `floatUp ${orb.duration} ease-in-out infinite`,
            animationDelay: orb.delay,
          }}
        />
      ))}
    </div>
  );
};