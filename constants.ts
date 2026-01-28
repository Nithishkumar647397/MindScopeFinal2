
import { Mood } from "./types";
import { Smile, Frown, Meh, AlertCircle, Zap, CloudLightning, Coffee, Moon, Ghost, Heart, Sparkles, HelpCircle } from 'lucide-react';

export const MOOD_COLORS: Record<Mood, string> = {
  [Mood.Happy]: '#E6F4EA',
  [Mood.Excited]: '#FFF9C4',
  [Mood.Calm]: '#E0F7FA',
  [Mood.Neutral]: '#F5F5F5',
  [Mood.Confused]: '#F3E5F5',
  [Mood.Sad]: '#E3F2FD',
  [Mood.Tired]: '#ECEFF1',
  [Mood.Lonely]: '#E8EAF6',
  [Mood.Stress]: '#FFF3E0',
  [Mood.Anxiety]: '#FFF8E1',
  [Mood.Angry]: '#FDECEA',
  [Mood.Depressed]: '#ECEFF4',
};

export const MOOD_ICONS: Record<Mood, any> = {
  [Mood.Happy]: Smile,
  [Mood.Excited]: Sparkles,
  [Mood.Calm]: Coffee,
  [Mood.Neutral]: Meh,
  [Mood.Confused]: HelpCircle,
  [Mood.Sad]: Frown,
  [Mood.Tired]: Moon,
  [Mood.Lonely]: Ghost,
  [Mood.Stress]: AlertCircle,
  [Mood.Anxiety]: CloudLightning,
  [Mood.Angry]: Zap,
  [Mood.Depressed]: Heart,
};

export const MOOD_SUPPORT_LINES: Record<Mood, string> = {
  [Mood.Happy]: "Your happiness is a beacon. Let's keep this momentum going together.",
  [Mood.Excited]: "The world is full of possibilities! Use this energy to create something beautiful.",
  [Mood.Calm]: "Peace is the highest form of success. Savor this tranquility.",
  [Mood.Neutral]: "Welcome back. Let's chat to understand your heart and mind today.",
  [Mood.Confused]: "It's okay to not have all the answers. Clarity comes in its own time.",
  [Mood.Sad]: "Remember that setbacks are often stepping stones to growth and new opportunities.",
  [Mood.Tired]: "Rest is not a luxury, it's a necessity. Listen to your body and recharge.",
  [Mood.Lonely]: "You are connected in ways you might not feel right now. I am here with you.",
  [Mood.Stress]: "The weight you're carrying is heavy. One exam or moment doesn't define your whole story.",
  [Mood.Anxiety]: "The storm in your mind is just a story. You are safe, right here, right now.",
  [Mood.Angry]: "Heat can be transformed into light. Breathe through the fire until clarity remains.",
  [Mood.Depressed]: "Even in the deepest winter, there is an invincible summer. We'll find it together.",
};
