import { Mood } from "../types";

// 🔑 PASTE YOUR REAL GEMINI API KEY HERE (from aistudio.google.com)
const API_KEY = "AIzaSyCHZka0f7Pw4Dih-y6dVgoPBhnES61Cu_w";

// Base URL for the v1 Gemini API
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1/models";

// Helper: Call Gemini via HTTP REST
async function callGemini(model: string, contents: any[]): Promise<string> {
  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Gemini HTTP error", res.status, data);
    throw new Error(data.error?.message || `HTTP ${res.status}`);
  }

  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((p: any) => p.text || "")
      .join("") || "";

  return text.trim();
}

// ----------------- Chat -----------------

export const getChatResponse = async (_history: any[], userMsg: string) => {
  try {
    if (!API_KEY || API_KEY.startsWith("PASTE_YOUR_")) {
      return { text: "Error: API key is not set in geminiService.ts." };
    }

    const systemPrompt =
      "You are MindScope, an empathetic AI mental wellness companion. " +
      "Keep responses concise, warm, and supportive. Do not give medical advice.";

    const userPrompt = `${systemPrompt}\n\nUser: ${userMsg}`;

    const reply = await callGemini("gemini-1.5-flash", [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ]);

    return { text: reply || "I'm here with you, even if words are hard to find." };
  } catch (err) {
    console.error("Gemini Chat Error:", err);
    return {
      text:
        "I'm having trouble connecting to the AI service right now. Please check your API key or try again later.",
    };
  }
};

// ----------------- Mood Analysis -----------------

export const analyzeMood = async (text: string): Promise<Mood> => {
  try {
    if (!API_KEY || API_KEY.startsWith("PASTE_YOUR_")) return Mood.Neutral;

    const prompt = `Analyze the sentiment of this text and categorize it into exactly one of these moods: Happy, Excited, Calm, Neutral, Confused, Sad, Tired, Lonely, Stress, Anxiety, Angry, Depressed. Return ONLY the word.\n\nText: "${text}"`;

    const answer = await callGemini("gemini-1.5-flash", [
      { role: "user", parts: [{ text: prompt }] },
    ]);

    const moodText = answer.trim().replace(/[^a-zA-Z]/g, "");

    if (Object.values(Mood).includes(moodText as Mood)) {
      return moodText as Mood;
    }
    return Mood.Neutral;
  } catch (err) {
    console.error("Mood Analysis Error:", err);
    return Mood.Neutral;
  }
};

// ----------------- Mood Quote -----------------

export const getMoodQuote = async (mood: Mood): Promise<string> => {
  try {
    if (!API_KEY || API_KEY.startsWith("PASTE_YOUR_"))
      return "Welcome to MindScope.";

    const prompt = `Give me a short, powerful, comforting quote for someone feeling ${mood}.`;

    const answer = await callGemini("gemini-1.5-flash", [
      { role: "user", parts: [{ text: prompt }] },
    ]);

    return answer || "This too shall pass.";
  } catch (err) {
    console.error("Quote Error:", err);
    return "This too shall pass.";
  }
};

// ----------------- Weekly Report -----------------

export const generateWeeklyReport = async (logs: any[]): Promise<string> => {
  if (logs.length === 0) return "Not enough data for a report yet.";

  try {
    if (!API_KEY || API_KEY.startsWith("PASTE_YOUR_"))
      return "Not enough data for a report yet.";

    const logSummary = logs
      .map((l) => `${new Date(l.timestamp).toLocaleDateString()}: ${l.mood}`)
      .join("\n");

    const prompt = `Based on these mood logs, write a 2-sentence supportive, compassionate summary of the user's emotional week:\n\n${logSummary}`;

    const answer = await callGemini("gemini-1.5-flash", [
      { role: "user", parts: [{ text: prompt }] },
    ]);

    return answer || "Your week had ups and downs, and it's okay to feel all of it.";
  } catch (err) {
    console.error("Weekly Report Error:", err);
    return "Your mood has been fluctuating, remember to take time for yourself.";
  }
};

// ----------------- Music & Places (still mocked) -----------------

export const getMusicRecommendations = async (mood: Mood) => {
  const query = `relaxing music for ${mood} mood`;
  return {
    links: [
      {
        title: `${mood} Vibes Mix`,
        uri: `https://www.youtube.com/results?search_query=${encodeURIComponent(
          query,
        )}`,
      },
      {
        title: "Soul Soothing Melody",
        uri: `https://www.youtube.com/results?search_query=healing+music`,
      },
    ],
  };
};

export const findPeacefulPlaces = async (coords: { lat: number; lng: number }) => {
  return {
    links: [
      {
        title: "Nearby Park",
        uri: `https://www.google.com/maps/search/parks/@${coords.lat},${coords.lng},15z`,
      },
      {
        title: "Quiet Cafe",
        uri: `https://www.google.com/maps/search/quiet+cafe/@${coords.lat},${coords.lng},15z`,
      },
    ],
  };
};