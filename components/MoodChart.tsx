
import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis } from 'recharts';
import { useWellness } from '../contexts/WellnessContext';
import { Mood } from '../types';

const moodToValue = (mood: Mood) => {
  switch (mood) {
    case Mood.Happy: return 5;
    case Mood.Neutral: return 3;
    case Mood.Stress: return 2;
    case Mood.Anxiety: return 1.5;
    case Mood.Sad: return 1;
    case Mood.Angry: return 1;
    default: return 3;
  }
};

export const MoodChart: React.FC = () => {
  const { moodLogs } = useWellness();

  // Process data: Take last 7 days or last 10 entries
  const data = moodLogs.slice(-10).map((log, i) => ({
    index: i,
    value: moodToValue(log.mood),
    mood: log.mood
  }));

  if (data.length < 2) {
    return (
      <div className="h-32 flex flex-col items-center justify-center text-gray-400 bg-white/10 rounded-3xl border border-white/20 border-dashed">
        <p className="text-[10px] font-bold uppercase tracking-widest">Logging Data...</p>
      </div>
    );
  }

  return (
    <div className="h-24 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="index" hide />
          <YAxis domain={[0, 6]} hide />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#6366f1" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorMood)" 
            isAnimationActive={true}
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
