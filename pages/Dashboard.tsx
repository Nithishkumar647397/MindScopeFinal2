
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWellness } from '../contexts/WellnessContext';
import { ChatInterface } from '../components/ChatInterface';
import { MoodChart } from '../components/MoodChart';
import { MOOD_COLORS, MOOD_ICONS, MOOD_SUPPORT_LINES } from '../constants.ts';
import { findPeacefulPlaces, getMusicRecommendations } from '../services/geminiService';
import { LogOut, Sparkles, Calendar, X, Music, MapPin, ExternalLink, RefreshCw, User as UserIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentMood, currentQuote, weeklyReport, refreshInsights } = useWellness();
  const [showReport, setShowReport] = useState(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [isRefreshingRecs, setIsRefreshingRecs] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const CurrentMoodIcon = MOOD_ICONS[currentMood];
  const bgColor = MOOD_COLORS[currentMood];
  const supportLine = MOOD_SUPPORT_LINES[currentMood];

  const fetchRecommendations = async () => {
    setIsRefreshingRecs(true);
    try {
        const musicRes = await getMusicRecommendations(currentMood);
        setSongs(musicRes.links.slice(0, 2));
    } catch (e) { console.error("Music fetch failed", e); }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const placeRes = await findPeacefulPlaces({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setPlaces(placeRes.links.slice(0, 2));
            } catch (e) { console.error("Places fetch failed", e); }
        }, (err) => {
            console.warn("Location permission denied", err);
        });
    }
    setIsRefreshingRecs(false);
  };

  useEffect(() => {
    fetchRecommendations();
  }, [currentMood]);

  const handleOpenReport = () => {
    refreshInsights();
    setShowReport(true);
    setProfileOpen(false);
  };

  return (
    <div style={{ backgroundColor: bgColor }} className="min-h-screen transition-all duration-[1000ms] ease-in-out selection:bg-indigo-100/30 overflow-x-hidden pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6">
        
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-3 rounded-[1.2rem] shadow-2xl shadow-indigo-200">
                <span className="font-black text-white text-xl">M</span>
             </div>
             <h1 className="text-2xl font-black text-gray-900 tracking-tight sm:block hidden">MindScope AI</h1>
          </div>
          
          <div className="flex items-center gap-4 relative">
             <div className="text-right hidden sm:block">
                 <p className="text-sm font-black text-gray-900 leading-none">{user?.username}</p>
                 <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1.5 opacity-60">Companion Active</p>
             </div>
             <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-12 h-12 bg-white border-4 border-white shadow-xl rounded-full flex items-center justify-center text-indigo-700 font-black hover:scale-105 transition-all text-lg"
             >
                {user?.username.substring(0, 2).toUpperCase()}
             </button>

             {profileOpen && (
                <div className="absolute right-0 top-16 w-64 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-[60] animate-in fade-in zoom-in duration-200">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                        <p className="font-black text-gray-900 text-lg">{user?.username}</p>
                        <p className="text-[12px] text-gray-400 font-bold truncate mt-0.5">{user?.email}</p>
                    </div>
                    <div className="p-3">
                        <button onClick={handleOpenReport} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-indigo-50 rounded-2xl transition-colors text-sm font-bold text-gray-700">
                           <Calendar size={18} className="text-indigo-600" /> Weekly Report
                        </button>
                        <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 text-red-600 rounded-2xl transition-colors text-sm font-bold mt-1">
                           <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
             )}
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column: Mood Card & Chat */}
          <div className="lg:col-span-8 space-y-8">
             
             {/* Dynamic Mood Card */}
             <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between group overflow-hidden relative transition-transform hover:-translate-y-1">
                <div className="relative z-10 space-y-4">
                   <div className="flex items-center gap-6">
                      <div className="p-5 bg-gray-50 rounded-[2rem] shadow-inner border border-gray-100">
                         <CurrentMoodIcon className="w-14 h-14 text-gray-900" />
                      </div>
                      <div>
                        <h2 className="text-4xl font-black text-gray-900 leading-none tracking-tight">{currentMood}</h2>
                        <p className="text-[13px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2.5">Atmosphere Mirror</p>
                      </div>
                   </div>
                   <p className="text-xl md:text-2xl font-bold text-gray-800 italic leading-relaxed pt-4 max-w-2xl">
                      "{supportLine}"
                   </p>
                </div>
                <div className="hidden md:block w-56 h-32 opacity-10 absolute right-10 top-1/2 -translate-y-1/2">
                   <svg viewBox="0 0 100 40" className="w-full h-full stroke-current stroke-[4] fill-none text-indigo-900">
                      <path d="M0 30 Q 25 10, 50 30 T 100 20" strokeLinecap="round" />
                   </svg>
                </div>
             </div>

             <ChatInterface />
          </div>

          {/* Sidebar Column: Trends & Real Grounding */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* Mood History Trend */}
             <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                      <Sparkles size={20} />
                   </div>
                   <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Weekly Trend</h3>
                </div>
                <div className="mt-4">
                   <MoodChart />
                </div>
                <div className="flex justify-between items-end mt-8 pt-6 border-t border-gray-50">
                    <div>
                        <p className="text-3xl font-black text-gray-900">{currentMood}</p>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Avg Pulse</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-black text-indigo-600">Stable</p>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Balance</p>
                    </div>
                </div>
             </div>

             {/* Nearby Serene Spots (Real Grounding) */}
             <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                      <MapPin size={20} />
                   </div>
                   <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Nearby Peace</h3>
                </div>
                <p className="text-sm text-gray-500 mb-8 font-bold italic leading-relaxed">Finding real serene spots near you for reflection.</p>
                
                <div className="space-y-4">
                   {places.length > 0 ? places.map((place, i) => (
                      <a key={i} href={place.uri} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-emerald-50/40 hover:bg-emerald-50 rounded-[2.2rem] transition-all border border-emerald-100/30 hover:border-emerald-200 group shadow-sm">
                         <div>
                            <p className="text-[16px] font-black text-gray-900 group-hover:text-emerald-700 transition-colors leading-tight">{place.title}</p>
                            <p className="text-[12px] text-emerald-600 font-bold uppercase tracking-tighter mt-1.5">Google Maps Location</p>
                         </div>
                         <div className="p-3 rounded-2xl bg-white text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-md">
                            <ExternalLink size={18} />
                         </div>
                      </a>
                   )) : <div className="p-12 text-center text-xs font-black text-gray-400 animate-pulse bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200 uppercase tracking-widest">Finding Sanctuary...</div>}
                </div>
             </div>

             {/* Tamil Music Therapy (Tamil Specific) */}
             <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-100">
                            <Music size={20} />
                        </div>
                        <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Tamil Therapy</h3>
                    </div>
                    <button onClick={fetchRecommendations} disabled={isRefreshingRecs} className="p-2.5 hover:bg-purple-50 rounded-xl transition-all group">
                        <RefreshCw size={16} className={`text-purple-600 group-hover:rotate-180 transition-transform duration-500 ${isRefreshingRecs ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                <p className="text-sm text-gray-500 mb-8 font-bold italic leading-relaxed">Healing Tamil melodies curated for your heart.</p>
                
                <div className="space-y-4">
                   {songs.length > 0 ? songs.map((song, i) => (
                      <a key={i} href={song.uri} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-purple-50/40 hover:bg-purple-50 rounded-[2.2rem] transition-all border border-purple-100/30 hover:border-purple-200 group shadow-sm">
                         <div className="flex-1 overflow-hidden pr-4">
                            <p className="text-[16px] font-black text-gray-900 group-hover:text-purple-700 transition-colors truncate leading-tight">{song.title}</p>
                            <p className="text-[12px] text-purple-600 font-bold uppercase tracking-tighter mt-1.5">Tamil Hit Song</p>
                         </div>
                         <div className="p-3 rounded-2xl bg-white text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-md shrink-0">
                            <Music size={18} />
                         </div>
                      </a>
                   )) : <div className="p-12 text-center text-xs font-black text-gray-400 animate-pulse bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200 uppercase tracking-widest">Curating Melodies...</div>}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Weekly Insights Modal */}
      {showReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={() => setShowReport(false)}></div>
           <div className="relative bg-white rounded-[4rem] shadow-2xl max-w-lg w-full p-12 md:p-16 overflow-hidden animate-in fade-in zoom-in duration-300">
              <button 
                onClick={() => setShowReport(false)}
                className="absolute top-12 right-12 p-3.5 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-all active:scale-90"
              >
                <X size={24} />
              </button>

              <div className="text-center">
                 <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mb-10 mx-auto shadow-inner border border-indigo-100/50">
                    <Calendar size={48} />
                 </div>
                 <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Emotional Report</h2>
                 <p className="text-[13px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-12 opacity-70">Synthesized Insights</p>
                 
                 <div className="bg-indigo-50/50 p-12 rounded-[3.5rem] border border-indigo-100/20 text-left relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500/20"></div>
                    <p className="text-xl text-gray-800 leading-relaxed font-bold italic opacity-95">
                       "{weeklyReport}"
                    </p>
                 </div>

                 <button 
                   onClick={() => setShowReport(false)}
                   className="mt-14 w-full py-6 bg-indigo-600 text-white font-black text-xl rounded-[2.5rem] hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all active:scale-95 uppercase tracking-widest"
                 >
                   Got it
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
