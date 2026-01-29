import React from 'react';

export const FloatingOrbs: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {/* Orb 1 - Large */}
      <div 
        className="absolute rounded-full animate-float-1"
        style={{
          width: '80px',
          height: '80px',
          left: '10%',
          bottom: '-100px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
      
      {/* Orb 2 - Medium */}
      <div 
        className="absolute rounded-full animate-float-2"
        style={{
          width: '50px',
          height: '50px',
          left: '25%',
          bottom: '-80px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, transparent 70%)',
          filter: 'blur(6px)',
        }}
      />
      
      {/* Orb 3 - Small */}
      <div 
        className="absolute rounded-full animate-float-3"
        style={{
          width: '30px',
          height: '30px',
          left: '45%',
          bottom: '-60px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 50%, transparent 70%)',
          filter: 'blur(4px)',
        }}
      />
      
      {/* Orb 4 - Large */}
      <div 
        className="absolute rounded-full animate-float-4"
        style={{
          width: '70px',
          height: '70px',
          left: '65%',
          bottom: '-90px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 50%, transparent 70%)',
          filter: 'blur(7px)',
        }}
      />
      
      {/* Orb 5 - Medium */}
      <div 
        className="absolute rounded-full animate-float-5"
        style={{
          width: '45px',
          height: '45px',
          left: '85%',
          bottom: '-70px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 50%, transparent 70%)',
          filter: 'blur(5px)',
        }}
      />
      
      {/* Orb 6 - Small */}
      <div 
        className="absolute rounded-full animate-float-6"
        style={{
          width: '25px',
          height: '25px',
          left: '5%',
          bottom: '-50px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 50%, transparent 70%)',
          filter: 'blur(3px)',
        }}
      />
    </div>
  );
};