
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, Mood, MoodLog } from '../types';
import { useAuth } from './AuthContext';
import { analyzeMood, getMoodQuote, generateWeeklyReport } from '../services/geminiService';

interface WellnessContextType {
  currentMood: Mood;
  moodLogs: MoodLog[];
  chatHistory: ChatMessage[];
  currentQuote: string;
  weeklyReport: string;
  addMessage: (content: string, role: 'user' | 'model', links?: any[]) => Promise<void>;
  addMoodLog: (mood: Mood) => void;
  isLoadingAI: boolean;
  refreshInsights: () => Promise<void>;
  clearChat: () => void;  // ADD THIS LINE
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export const WellnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentMood, setCurrentMood] = useState<Mood>(Mood.Neutral);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentQuote, setCurrentQuote] = useState('Welcome to MindScope.');
  const [weeklyReport, setWeeklyReport] = useState('Loading your insights...');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    if (user) {
      const storedLogs = localStorage.getItem(`moods_${user.id}`);
      const storedChats = localStorage.getItem(`chats_${user.id}`);
      
      const logs = storedLogs ? JSON.parse(storedLogs) : [];
      setMoodLogs(logs);
      
      const chats = storedChats ? JSON.parse(storedChats) : [];
      setChatHistory(chats);

      if (logs.length > 0) {
        const lastMood = logs[logs.length - 1].mood;
        setCurrentMood(lastMood);
        updateMoodBasedFeatures(lastMood, logs);
      }
    }
  }, [user]);

  const updateMoodBasedFeatures = async (mood: Mood, logs: MoodLog[]) => {
    try {
      const quote = await getMoodQuote(mood);
      setCurrentQuote(quote);
      const report = await generateWeeklyReport(logs);
      setWeeklyReport(report);
    } catch (e) {
      console.error(e);
    }
  };

  const addMoodLog = (mood: Mood) => {
    if (!user) return;
    const newLog: MoodLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      mood
    };
    const updatedLogs = [...moodLogs, newLog];
    setMoodLogs(updatedLogs);
    setCurrentMood(mood);
    localStorage.setItem(`moods_${user.id}`, JSON.stringify(updatedLogs));
    updateMoodBasedFeatures(mood, updatedLogs);
  };

  const refreshInsights = async () => {
    if (user) {
      const report = await generateWeeklyReport(moodLogs);
      setWeeklyReport(report);
    }
  };

  const clearChat = () => {
    if (user) {
      setChatHistory([]);
      localStorage.removeItem(`chats_${user.id}`);
    }
  };

  const addMessage = async (content: string, role: 'user' | 'model', links?: any[]) => {
    if (!user) return;

    if (role === 'user') {
        setIsLoadingAI(true);
        analyzeMood(content).then(mood => {
            if (mood !== Mood.Neutral && mood !== currentMood) {
                addMoodLog(mood);
            }
        }).finally(() => setIsLoadingAI(false));
    }

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: Date.now(),
      relatedMood: currentMood,
      groundingLinks: links
    };

    // Use functional update to get latest state
    setChatHistory(prevHistory => {
      const updatedChats = [...prevHistory, newMessage];
      localStorage.setItem(`chats_${user.id}`, JSON.stringify(updatedChats));
      return updatedChats;
    });
  };

  return (
    <WellnessContext.Provider value={{
      currentMood,
      moodLogs,
      chatHistory,
      currentQuote,
      weeklyReport,
      addMessage,
      addMoodLog,
      isLoadingAI,
      refreshInsights,
      clearChat
    }}>
      {children}
    </WellnessContext.Provider>
  );
};

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) throw new Error("useWellness must be used within a WellnessProvider");
  return context;
};
