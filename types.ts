
export enum Mood {
  Happy = 'Happy',
  Excited = 'Excited',
  Calm = 'Calm',
  Neutral = 'Neutral',
  Confused = 'Confused',
  Sad = 'Sad',
  Tired = 'Tired',
  Lonely = 'Lonely',
  Stress = 'Stress',
  Anxiety = 'Anxiety',
  Angry = 'Angry',
  Depressed = 'Depressed',
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  relatedMood?: Mood;
  groundingLinks?: Array<{uri: string, title: string}>;
}

export interface MoodLog {
  id: string;
  timestamp: number;
  mood: Mood;
  note?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
}
