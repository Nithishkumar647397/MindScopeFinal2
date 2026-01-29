import React from 'react';
import { Mood } from '../types';

interface MoodAvatarProps {
  mood: Mood;
  isThinking?: boolean;
  size?: number;
}

export const MoodAvatar: React.FC<MoodAvatarProps> = ({ 
  mood, 
  isThinking = false,
  size = 60 
}) => {
  
  // Get expression based on mood
  const getExpression = () => {
    switch (mood) {
      case Mood.Happy:
        return { eyes: 'happy', mouth: 'big-smile', extras: 'blush' };
      case Mood.Excited:
        return { eyes: 'wide', mouth: 'grin', extras: 'sparkles' };
      case Mood.Calm:
        return { eyes: 'peaceful', mouth: 'gentle-smile', extras: 'none' };
      case Mood.Neutral:
        return { eyes: 'normal', mouth: 'slight-smile', extras: 'none' };
      case Mood.Confused:
        return { eyes: 'confused', mouth: 'wavy', extras: 'question' };
      case Mood.Sad:
        return { eyes: 'sad', mouth: 'frown', extras: 'tear' };
      case Mood.Tired:
        return { eyes: 'tired', mouth: 'yawn', extras: 'zzz' };
      case Mood.Lonely:
        return { eyes: 'lonely', mouth: 'small-frown', extras: 'none' };
      case Mood.Stress:
        return { eyes: 'worried', mouth: 'tight', extras: 'sweat' };
      case Mood.Anxiety:
        return { eyes: 'anxious', mouth: 'shaky', extras: 'none' };
      case Mood.Angry:
        return { eyes: 'angry', mouth: 'gritted', extras: 'none' };
      case Mood.Depressed:
        return { eyes: 'downcast', mouth: 'flat', extras: 'none' };
      default:
        return { eyes: 'normal', mouth: 'slight-smile', extras: 'none' };
    }
  };

  const expression = getExpression();

  // Eye components based on expression
  const renderEyes = () => {
    const eyeClass = isThinking ? 'animate-thinking-eyes' : 'animate-blink';
    
    switch (expression.eyes) {
      case 'happy':
        return (
          <g className={eyeClass}>
            <path d="M18 22 Q22 18 26 22" stroke="#4A5568" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M38 22 Q42 18 46 22" stroke="#4A5568" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </g>
        );
      case 'wide':
        return (
          <g className={eyeClass}>
            <circle cx="22" cy="22" r="5" fill="#4A5568"/>
            <circle cx="42" cy="22" r="5" fill="#4A5568"/>
            <circle cx="23" cy="20" r="1.5" fill="white"/>
            <circle cx="43" cy="20" r="1.5" fill="white"/>
          </g>
        );
      case 'peaceful':
        return (
          <g className={eyeClass}>
            <path d="M17 24 Q22 20 27 24" stroke="#4A5568" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M37 24 Q42 20 47 24" stroke="#4A5568" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </g>
        );
      case 'sad':
        return (
          <g className={eyeClass}>
            <ellipse cx="22" cy="24" rx="4" ry="5" fill="#4A5568"/>
            <ellipse cx="42" cy="24" rx="4" ry="5" fill="#4A5568"/>
            <path d="M16 18 Q22 22 28 18" stroke="#4A5568" strokeWidth="1.5" fill="none"/>
            <path d="M36 18 Q42 22 48 18" stroke="#4A5568" strokeWidth="1.5" fill="none"/>
          </g>
        );
      case 'tired':
        return (
          <g className={eyeClass}>
            <path d="M17 24 L27 24" stroke="#4A5568" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M37 24 L47 24" stroke="#4A5568" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M17 21 L27 23" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M37 23 L47 21" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
          </g>
        );
      case 'worried':
      case 'anxious':
        return (
          <g className={eyeClass}>
            <ellipse cx="22" cy="24" rx="4" ry="5" fill="#4A5568"/>
            <ellipse cx="42" cy="24" rx="4" ry="5" fill="#4A5568"/>
            <path d="M16 16 L28 20" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/>
            <path d="M48 16 L36 20" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/>
          </g>
        );
      case 'angry':
        return (
          <g className={eyeClass}>
            <ellipse cx="22" cy="24" rx="3.5" ry="4" fill="#4A5568"/>
            <ellipse cx="42" cy="24" rx="3.5" ry="4" fill="#4A5568"/>
            <path d="M14 17 L28 22" stroke="#4A5568" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M50 17 L36 22" stroke="#4A5568" strokeWidth="2.5" strokeLinecap="round"/>
          </g>
        );
      case 'confused':
        return (
          <g className={eyeClass}>
            <ellipse cx="22" cy="24" rx="4" ry="5" fill="#4A5568"/>
            <ellipse cx="42" cy="22" rx="4" ry="5" fill="#4A5568"/>
            <path d="M16 18 L28 20" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M36 16 L48 18" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
          </g>
        );
      case 'lonely':
      case 'downcast':
        return (
          <g className={eyeClass}>
            <ellipse cx="22" cy="26" rx="3.5" ry="4" fill="#4A5568"/>
            <ellipse cx="42" cy="26" rx="3.5" ry="4" fill="#4A5568"/>
          </g>
        );
      default:
        return (
          <g className={eyeClass}>
            <ellipse cx="22" cy="24" rx="4" ry="5" fill="#4A5568"/>
            <ellipse cx="42" cy="24" rx="4" ry="5" fill="#4A5568"/>
            <circle cx="23" cy="22" r="1.5" fill="white"/>
            <circle cx="43" cy="22" r="1.5" fill="white"/>
          </g>
        );
    }
  };

  // Mouth components based on expression
  const renderMouth = () => {
    switch (expression.mouth) {
      case 'big-smile':
        return <path d="M22 42 Q32 52 42 42" stroke="#4A5568" strokeWidth="2.5" fill="none" strokeLinecap="round"/>;
      case 'grin':
        return (
          <>
            <path d="M20 40 Q32 54 44 40" stroke="#4A5568" strokeWidth="2.5" fill="#FECACA" strokeLinecap="round"/>
          </>
        );
      case 'gentle-smile':
        return <path d="M25 42 Q32 48 39 42" stroke="#4A5568" strokeWidth="2" fill="none" strokeLinecap="round"/>;
      case 'slight-smile':
        return <path d="M26 42 Q32 46 38 42" stroke="#4A5568" strokeWidth="2" fill="none" strokeLinecap="round"/>;
      case 'frown':
        return <path d="M24 46 Q32 40 40 46" stroke="#4A5568" strokeWidth="2.5" fill="none" strokeLinecap="round"/>;
      case 'small-frown':
        return <path d="M26 44 Q32 40 38 44" stroke="#4A5568" strokeWidth="2" fill="none" strokeLinecap="round"/>;
      case 'wavy':
        return <path d="M24 44 Q28 42 32 44 Q36 46 40 44" stroke="#4A5568" strokeWidth="2" fill="none" strokeLinecap="round"/>;
      case 'yawn':
        return <ellipse cx="32" cy="44" rx="6" ry="8" fill="#4A5568" opacity="0.8"/>;
      case 'tight':
        return <path d="M26 44 L38 44" stroke="#4A5568" strokeWidth="2.5" strokeLinecap="round"/>;
      case 'shaky':
        return <path d="M24 44 Q26 42 28 44 Q30 46 32 44 Q34 42 36 44 Q38 46 40 44" stroke="#4A5568" strokeWidth="1.5" fill="none" strokeLinecap="round"/>;
      case 'gritted':
        return (
          <>
            <path d="M24 44 L40 44" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/>
            <path d="M26 44 L26 48" stroke="#4A5568" strokeWidth="1" strokeLinecap="round"/>
            <path d="M30 44 L30 48" stroke="#4A5568" strokeWidth="1" strokeLinecap="round"/>
            <path d="M34 44 L34 48" stroke="#4A5568" strokeWidth="1" strokeLinecap="round"/>
            <path d="M38 44 L38 48" stroke="#4A5568" strokeWidth="1" strokeLinecap="round"/>
          </>
        );
      case 'flat':
        return <path d="M26 44 L38 44" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/>;
      default:
        return <path d="M26 42 Q32 46 38 42" stroke="#4A5568" strokeWidth="2" fill="none" strokeLinecap="round"/>;
    }
  };

  // Extra elements (blush, tears, sparkles, etc.)
  const renderExtras = () => {
    switch (expression.extras) {
      case 'blush':
        return (
          <>
            <ellipse cx="14" cy="32" rx="5" ry="3" fill="#FEB2B2" opacity="0.6"/>
            <ellipse cx="50" cy="32" rx="5" ry="3" fill="#FEB2B2" opacity="0.6"/>
          </>
        );
      case 'sparkles':
        return (
          <>
            <text x="52" y="12" fontSize="8" fill="#F6E05E">✦</text>
            <text x="6" y="16" fontSize="6" fill="#F6E05E">✦</text>
            <text x="56" y="28" fontSize="5" fill="#F6E05E">✦</text>
          </>
        );
      case 'tear':
        return (
          <ellipse cx="28" cy="32" rx="2" ry="4" fill="#90CDF4" opacity="0.8"/>
        );
      case 'sweat':
        return (
          <ellipse cx="52" cy="20" rx="2" ry="3" fill="#90CDF4" opacity="0.7"/>
        );
      case 'zzz':
        return (
          <text x="50" y="14" fontSize="10" fill="#A0AEC0" fontWeight="bold">z</text>
        );
      case 'question':
        return (
          <text x="50" y="14" fontSize="12" fill="#9F7AEA" fontWeight="bold">?</text>
        );
      default:
        return null;
    }
  };

  // Face color based on mood
  const getFaceColor = () => {
    switch (mood) {
      case Mood.Happy:
      case Mood.Excited:
        return '#FFF5E6';
      case Mood.Calm:
        return '#F0FFF4';
      case Mood.Angry:
        return '#FFF0F0';
      case Mood.Sad:
      case Mood.Depressed:
        return '#F0F4FF';
      default:
        return '#FFFBF0';
    }
  };

  return (
    <div 
      className="animate-breathe"
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 64 64" 
        width={size} 
        height={size}
      >
        {/* Face Background */}
        <circle 
          cx="32" 
          cy="32" 
          r="30" 
          fill={getFaceColor()}
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />
        
        {/* Eyes */}
        {renderEyes()}
        
        {/* Mouth */}
        {renderMouth()}
        
        {/* Extras */}
        {renderExtras()}
        
        {/* Thinking indicator */}
        {isThinking && (
          <g>
            <circle cx="20" cy="54" r="2" fill="#A0AEC0" className="animate-bounce"/>
            <circle cx="32" cy="54" r="2" fill="#A0AEC0" className="animate-bounce" style={{ animationDelay: '0.2s' }}/>
            <circle cx="44" cy="54" r="2" fill="#A0AEC0" className="animate-bounce" style={{ animationDelay: '0.4s' }}/>
          </g>
        )}
      </svg>
    </div>
  );
};