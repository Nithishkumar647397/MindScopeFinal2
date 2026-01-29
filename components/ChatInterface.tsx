import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Sparkles, User, Bot, Trash2 } from 'lucide-react';
import { useWellness } from '../contexts/WellnessContext';
import { getChatResponse } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import { MoodAvatar } from './MoodAvatar';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export const ChatInterface: React.FC = () => {
  const { chatHistory, addMessage, isLoadingAI, clearChat, currentMood } = useWellness();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoadingAI]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    
    const userMsg = input;
    setInput('');
    
    // Add user message first
    await addMessage(userMsg, 'user');

    // Get AI response
    const history = chatHistory.slice(-10).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await getChatResponse(history, userMsg);
    await addMessage(response.text, 'model');
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    isListening ? recognition.stop() : recognition.start();
  };

  const handleClearChat = () => {
    if (confirm("Clear all chat history?")) {
      clearChat();
    }
  };

  return (
    <div className="flex flex-col h-[550px] bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-2xl">
      {/* Header with Avatar and Clear Button */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <MoodAvatar mood={currentMood} isThinking={isLoadingAI} size={50} />
          <div>
            <h2 className="font-bold text-gray-900 text-[15px]">MindScope Companion</h2>
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">Always here for you</p>
          </div>
        </div>
        
        {/* Clear Chat Button */}
        {chatHistory.length > 0 && (
          <button 
            onClick={handleClearChat}
            className="p-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
            title="Clear chat history"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-10">
            <Sparkles size={32} className="text-gray-200 mb-4" />
            <p className="text-gray-400 font-medium text-sm">Hello {user?.username}! How are you feeling today?</p>
          </div>
        )}
        
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {msg.role === 'user' ? (
              <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm bg-indigo-600">
                <User size={16} className="text-white" />
              </div>
            ) : (
              <div className="flex-shrink-0">
                <MoodAvatar mood={msg.relatedMood ?? currentMood} size={36} />
              </div>
            )}
            <div className={`max-w-[80%] p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
              }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoadingAI && (
            <div className="flex gap-3">
                 <div className="flex-shrink-0">
                    <MoodAvatar mood={currentMood} isThinking={true} size={36} />
                 </div>
                 <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="flex gap-3 items-center">
          <button 
            onClick={handleVoiceInput}
            className={`p-4 rounded-2xl transition-all border border-gray-100 ${isListening ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-400 hover:text-indigo-600'}`}
          >
            <Mic size={20} />
          </button>
          
          <div className="flex-1 relative flex items-center">
             <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type or speak..."
                className="w-full pl-6 pr-16 py-4 rounded-2xl border border-gray-200 focus:border-indigo-400 outline-none bg-white text-gray-900 shadow-sm placeholder-gray-400 text-[15px] font-medium transition-all"
              />
              <button 
                onClick={handleSend} 
                disabled={!input.trim()}
                className="absolute right-2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-30 transition-all active:scale-95 shadow-lg shadow-indigo-100"
              >
                <Send size={20} />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};