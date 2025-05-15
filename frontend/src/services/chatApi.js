import { GoogleGenAI } from "@google/genai";

export const genai = new GoogleGenAI({ apiKey: 'AIzaSyB-RbZeh1Vii2l--Qt2fmmMnC9Zi1WRTCw' });

const mockSessions = {};

export const createChatSession = async (role) => {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  mockSessions[sessionId] = { sessionId, messages: [], role };
  return sessionId;
};

export const getChatHistory = async (sessionId) => {
  const session = mockSessions[sessionId];
  if (!session) return null;
  return {
    ...session,
    messages: session.messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
    })),
  };
};

export const saveUserMessage = async (sessionId, text) => {
  const session = mockSessions[sessionId];
  if (!session) throw new Error("Session not found");

  const message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    text,
    fromBot: false,
    timestamp: new Date(),
  };
  session.messages.push(message);
  return message;
};

export const saveBotMessage = async (sessionId, text) => {
  const session = mockSessions[sessionId];
  if (!session) throw new Error("Session not found");

  const message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    text,
    fromBot: true,
    timestamp: new Date(),
  };
  session.messages.push(message);
  return message;
};

export const sendMessage = async (sessionId, text, role) => {
  await saveUserMessage(sessionId, text);
  const session = mockSessions[sessionId];

  try {
    const rolePrompt = getRoleSpecificPrompt(role);
    const historyText = session.messages
      .filter(m => !m.fromBot)
      .slice(-10)
      .map(m => m.text)
      .join("\n");
    const fullPrompt = `${rolePrompt}\n\nPrevious Conversation:\n${historyText}\n\nUser: ${text}`;

    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: fullPrompt,
    });

    const botText = response.text;
    return await saveBotMessage(sessionId, botText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return await saveBotMessage(
      sessionId,
      "I'm sorry, I'm having trouble connecting to my knowledge base. Please try again later."
    );
  }
};

const getRoleSpecificPrompt = (role) => {
  switch (role) {
    case "admin":
      return "You are an AI assistant helping a property management system administrator. Provide concise, helpful responses about property management and system features.";
    case "seller":
      return "You are an AI assistant helping a property seller. Provide concise, helpful responses about property listings and sales strategies.";
    case "customer":
      return "You are an AI assistant helping a property customer. Provide concise, helpful responses about property features and purchasing processes.";
    default:
      return "You are an AI assistant for a property management system. Provide concise, helpful responses about properties and system features.";
  }
};