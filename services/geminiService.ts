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

export const getChatResponse = async (history: any[], userMsg: string) => {
  try {
    if (!API_KEY) {
      return { text: "Error: API key is not set." };
    }

    // System message
    const messages: { role: string; content: string }[] = [
      {
        role: "system",
        content: "You are MindScope, an empathetic AI mental wellness companion. Keep responses concise, warm, and supportive. Do not give medical advice. Remember the conversation context and refer to previous messages when relevant."
      }
    ];

    // Add conversation history (last 10 messages for context)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.parts?.[0]?.text || msg.content || ''
      });
    }

    // Add current user message
    messages.push({
      role: "user",
      content: userMsg
    });

    const reply = await callGroq(messages);

    return { text: reply || "I'm here with you, even if words are hard to find." };
  } catch (err) {
    console.error("Groq Chat Error:", err);
    return {
      text: "I'm having trouble connecting to the AI service right now. Please try again later.",
    };
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

// ----------------- Mood Analysis -----------------

export const analyzeMood = async (text: string): Promise<Mood> => {
  try {
    if (!API_KEY) return Mood.Neutral;

    const messages = [
      {
        role: "system",
        content: `You are a mood analyzer. Analyze the user's text and respond with EXACTLY one word from this list:
        
- Happy (joy, success, celebration)
- Excited (anticipation, thrill, enthusiasm)
- Calm (peaceful, relaxed, serene)
- Neutral (normal, okay, factual questions)
- Confused (uncertain, unclear, lost)
- Sad (grief, disappointment, crying)
- Tired (exhausted, sleepy, drained)
- Lonely (isolated, alone, abandoned)
- Stress (overwhelmed, pressure, deadlines, too much work)
- Anxiety (worry, fear, panic, racing heart, nervous)
- Angry (frustrated, rage, irritated)
- Depressed (hopeless, empty, nothing matters)

IMPORTANT: Reply with ONLY the mood word. No punctuation. No explanation.`
      },
      {
        role: "user",
        content: text
      }
    ];

    const answer = await callGroq(messages);
    
    // Clean the response
    let moodText = answer.trim().replace(/[^a-zA-Z]/g, "");
    
    // Handle common variations
    const moodMap: Record<string, Mood> = {
      'Stressed': Mood.Stress,
      'Anxious': Mood.Anxiety,
      'Depressing': Mood.Depressed,
      'Angry': Mood.Angry,
      'Frustrated': Mood.Angry,
      'Worried': Mood.Anxiety,
      'Nervous': Mood.Anxiety,
      'Overwhelmed': Mood.Stress,
      'Exhausted': Mood.Tired,
      'Joyful': Mood.Happy,
      'Peaceful': Mood.Calm,
      'Isolated': Mood.Lonely
    };

    // Check if it's a variation
    if (moodMap[moodText]) {
      return moodMap[moodText];
    }

    // Check if it's a direct match
    if (Object.values(Mood).includes(moodText as Mood)) {
      return moodText as Mood;
    }
    
    return Mood.Neutral;
  } catch (err) {
    console.error("Mood Analysis Error:", err);
    return Mood.Neutral;
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
  // Tamil mood-based music mapping
  const tamilMusicQueries: Record<Mood, string[]> = {
    [Mood.Happy]: [
      "Tamil happy songs playlist",
      "Tamil upbeat kuthu songs"
    ],
    [Mood.Excited]: [
      "Tamil mass songs playlist",
      "Tamil dance hits"
    ],
    [Mood.Calm]: [
      "Tamil melody songs relaxing",
      "Ilaiyaraaja peaceful songs"
    ],
    [Mood.Neutral]: [
      "Tamil classic hits",
      "AR Rahman Tamil songs"
    ],
    [Mood.Confused]: [
      "Tamil motivational songs",
      "Tamil inspirational melody"
    ],
    [Mood.Sad]: [
      "Tamil sad songs feeling",
      "Tamil emotional melody songs"
    ],
    [Mood.Tired]: [
      "Tamil soft melody sleep",
      "Tamil relaxing instrumental"
    ],
    [Mood.Lonely]: [
      "Tamil lonely feeling songs",
      "Tamil heartfelt melody"
    ],
    [Mood.Stress]: [
      "Tamil stress relief melody",
      "Ilaiyaraaja relaxing instrumental"
    ],
    [Mood.Anxiety]: [
      "Tamil calming songs peaceful",
      "Tamil meditation music"
    ],
    [Mood.Angry]: [
      "Tamil mass angry songs",
      "Tamil powerful songs"
    ],
    [Mood.Depressed]: [
      "Tamil hope songs motivational",
      "Tamil healing emotional songs"
    ]
  };

  const queries = tamilMusicQueries[mood] || ["Tamil melody songs"];

  return {
    links: [
      {
        title: `${mood} - Tamil Hits`,
        uri: `https://www.youtube.com/results?search_query=${encodeURIComponent(queries[0])}`,
      },
      {
        title: "Tamil Soul Melody",
        uri: `https://www.youtube.com/results?search_query=${encodeURIComponent(queries[1])}`,
      },
    ],
  };
};
export const findPeacefulPlaces = async (coords: { lat: number; lng: number }) => {
  return {
    links: [
      {
        title: "Nearby Park",
        // Searches for "parks near me" centered at user's location
        uri: `https://www.google.com/maps/search/parks+near+me/@${coords.lat},${coords.lng},14z`,
      },
      {
        title: "Quiet Cafe",
        // Searches for "quiet cafes near me" centered at user's location
        uri: `https://www.google.com/maps/search/quiet+cafes+near+me/@${coords.lat},${coords.lng},14z`,
      },
    ],
  };
};