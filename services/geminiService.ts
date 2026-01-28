
import { GoogleGenAI, Type } from "@google/genai";
import { Mood, MoodLog } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are MindScope, an empathetic mental wellness mirror. 
- Validate the user's feelings with deep kindness.
- If they share negative experiences (like failing an exam), respond that one moment doesn't define their whole story.
- Encourage them to breathe and stay present.
- Keep responses warm, concise, and focused on healing.
`;

export const analyzeMood = async (text: string): Promise<Mood> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Text: "${text}". Which mood fits best?
      Labels: Happy, Excited, Calm, Neutral, Confused, Sad, Tired, Lonely, Stress, Anxiety, Angry, Depressed.
      Return JSON: {"mood": "Label"}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING, enum: Object.values(Mood) }
          }
        }
      }
    });
    const json = JSON.parse(response.text || '{}');
    return (json.mood as Mood) || Mood.Neutral;
  } catch (error) {
    return Mood.Neutral;
  }
};

export const getChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  lastMessage: string
): Promise<{ text: string }> => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: { systemInstruction: SYSTEM_INSTRUCTION },
      history: history,
    });
    const result = await chat.sendMessage({ message: lastMessage });
    return { text: result.text || "I'm listening. Tell me more." };
  } catch (error) {
    return { text: "I'm here for you, even if the connection is currently weak." };
  }
};

export const findPeacefulPlaces = async (
  location: { lat: number, lng: number }
): Promise<{ text: string, links: Array<{uri: string, title: string}> }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find 2 real peaceful places (parks, beaches, temples) near latitude ${location.lat}, longitude ${location.lng}. Return Google Maps links.`,
      config: { tools: [{ googleSearch: {} }] },
    });

    const links: Array<{uri: string, title: string}> = [];
    response.candidates?.[0]?.groundingMetadata?.groundingChunks?.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        links.push({ uri: chunk.web.uri, title: chunk.web.title || "Peaceful Spot" });
      }
    });

    return { text: response.text || "Found some quiet spots for you.", links };
  } catch (error) {
    return { text: "Visit a local park to clear your mind.", links: [] };
  }
};

export const getMusicRecommendations = async (mood: Mood): Promise<{ text: string, links: Array<{uri: string, title: string}> }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 2 real TAMIL songs for someone feeling ${mood}. Provide real Spotify or YouTube links. Be specific with popular Tamil hits.`,
      config: { tools: [{ googleSearch: {} }] },
    });

    const links: Array<{uri: string, title: string}> = [];
    response.candidates?.[0]?.groundingMetadata?.groundingChunks?.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        links.push({ uri: chunk.web.uri, title: chunk.web.title || "Tamil Hit" });
      }
    });

    return { text: response.text || "Here's some music to soothe you.", links };
  } catch (error) {
    return { text: "Listen to some AR Rahman melodies for peace.", links: [] };
  }
};

export const generateWeeklyReport = async (logs: MoodLog[]): Promise<string> => {
  if (logs.length === 0) return "Start sharing your thoughts to see your weekly journey.";
  try {
    const logSummary = logs.slice(-10).map(l => `${new Date(l.timestamp).toLocaleDateString()}: ${l.mood}`).join(', ');
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on logs: [${logSummary}], write a very brief 2-sentence empathetic summary of the user's emotional week.`,
    });
    return response.text || "Your resilience is your strength.";
  } catch (error) {
    return "Reflection is the first step toward growth.";
  }
};

export const getMoodQuote = async (mood: Mood): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write one short, powerful empathetic quote for someone feeling ${mood}.`,
    });
    return response.text?.replace(/"/g, '') || "You are enough exactly as you are.";
  } catch (error) {
    return "Deep breaths lead to clear thoughts.";
  }
};
