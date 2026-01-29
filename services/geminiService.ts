import { Mood } from "../types";

// Get API key from environment
const API_KEY = process.env.GROQ_API_KEY || "";

// Groq API endpoint
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Model to use (fast and free)
const MODEL = "llama-3.1-8b-instant";

// Helper: Call Groq API
async function callGroq(messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Groq HTTP error", res.status, data);
    throw new Error(data.error?.message || `HTTP ${res.status}`);
  }

  return data.choices?.[0]?.message?.content?.trim() || "";
}

// ----------------- Chat -----------------

export const getChatResponse = async (_history: any[], userMsg: string) => {
  try {
    if (!API_KEY) {
      return { text: "Error: API key is not set." };
    }

    const messages = [
      {
        role: "system",
        content: "You are MindScope, an empathetic AI mental wellness companion. Keep responses concise, warm, and supportive. Do not give medical advice."
      },
      {
        role: "user",
        content: userMsg
      }
    ];

    const reply = await callGroq(messages);

    return { text: reply || "I'm here with you, even if words are hard to find." };
  } catch (err) {
    console.error("Groq Chat Error:", err);
    return {
      text: "I'm having trouble connecting to the AI service right now. Please try again later.",
    };
  }
};

// ----------------- Mood Analysis -----------------

export const analyzeMood = async (text: string): Promise<Mood> => {
  try {
    if (!API_KEY) return Mood.Neutral;

    const messages = [
      {
        role: "system",
        content: "You are a mood analyzer. Respond with ONLY one word from this list: Happy, Excited, Calm, Neutral, Confused, Sad, Tired, Lonely, Stress, Anxiety, Angry, Depressed"
      },
      {
        role: "user",
        content: `Analyze the mood of this text: "${text}"`
      }
    ];

    const answer = await callGroq(messages);
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
    if (!API_KEY) return "Welcome to MindScope.";

    const messages = [
      {
        role: "user",
        content: `Give me a short, powerful, comforting quote (1-2 sentences) for someone feeling ${mood}. Just the quote, no attribution.`
      }
    ];

    const answer = await callGroq(messages);
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
    if (!API_KEY) return "Not enough data for a report yet.";

    const logSummary = logs
      .map((l) => `${new Date(l.timestamp).toLocaleDateString()}: ${l.mood}`)
      .join("\n");

    const messages = [
      {
        role: "user",
        content: `Based on these mood logs, write a 2-sentence supportive, compassionate summary of the user's emotional week:\n\n${logSummary}`
      }
    ];

    const answer = await callGroq(messages);
    return answer || "Your week had ups and downs, and it's okay to feel all of it.";
  } catch (err) {
    console.error("Weekly Report Error:", err);
    return "Your mood has been fluctuating, remember to take time for yourself.";
  }
};

// ----------------- Music & Places -----------------

export const getMusicRecommendations = async (mood: Mood) => {
  const query = `relaxing music for ${mood} mood`;
  return {
    links: [
      {
        title: `${mood} Vibes Mix`,
        uri: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
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