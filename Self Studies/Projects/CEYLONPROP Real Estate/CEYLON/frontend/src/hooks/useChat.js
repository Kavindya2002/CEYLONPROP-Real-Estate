import { useState, useEffect, useCallback } from 'react';
import { 
  createChatSession, 
  getChatHistory, 
  sendMessage
} from '../services/chatApi.js';

export function useChat(initialSessionId, role = 'customer') {
  const [sessionId, setSessionId] = useState(initialSessionId || null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const storedSessionId = localStorage.getItem(`chat_session_${role}`);
        
        if (storedSessionId) {
          setSessionId(storedSessionId);
          const history = await getChatHistory(storedSessionId);
          if (history) {
            setMessages(history.messages);
          } else {
            createNewSession();
          }
        } else {
          createNewSession();
        }
      } catch (err) {
        console.error('Failed to initialize chat:', err);
        setError('Failed to initialize chat session');
      }
    };

    const createNewSession = async () => {
      try {
        const newSessionId = await createChatSession(role);
        localStorage.setItem(`chat_session_${role}`, newSessionId);
        setSessionId(newSessionId);
        setMessages([]);
        
        const welcomeMsg = {
          id: `welcome_${Date.now()}`,
          text: getWelcomeMessage(role),
          fromBot: true,
          timestamp: new Date()
        };
        setMessages([welcomeMsg]);
      } catch (err) {
        console.error('Failed to create new chat session:', err);
        setError('Failed to create new chat session');
      }
    };

    if (!sessionId) {
      initChat();
    }
  }, [role, sessionId]);

  const send = useCallback(async (text) => {
    if (!sessionId || !text.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userMessage = {
        id: `user_${Date.now()}`,
        text,
        fromBot: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      const response = await sendMessage(sessionId, text, role);
      
      if (!(response.timestamp instanceof Date)) {
        response.timestamp = new Date(response.timestamp);
      }
      
      setMessages(prev => [...prev, response]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      
      const errorMessage = {
        id: `error_${Date.now()}`,
        text: "Sorry, I couldn't process your message. Please try again.",
        fromBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [sessionId, role]);

  const resetSession = useCallback(async () => {
    try {
      localStorage.removeItem(`chat_session_${role}`);
      const newSessionId = await createChatSession(role);
      localStorage.setItem(`chat_session_${role}`, newSessionId);
      setSessionId(newSessionId);
      
      const welcomeMsg = {
        id: `welcome_${Date.now()}`,
        text: getWelcomeMessage(role),
        fromBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMsg]);
    } catch (err) {
      console.error('Failed to reset chat session:', err);
      setError('Failed to reset chat session');
    }
  }, [role]);

  return {
    messages,
    loading,
    error,
    send,
    resetSession
  };
}

function getWelcomeMessage(role) {
  switch (role) {
    case 'admin':
      return "Hello Admin! I'm your property management assistant. I can help you with managing properties, sellers, and customers. What would you like to do today?";
    case 'seller':
      return "Hello Seller! I'm your property listing assistant. I can help you manage your properties, understand market trends, and connect with potential buyers. How can I assist you today?";
    case 'customer':
      return "Hello! I'm your property search assistant. I can help you find properties, understand listings, and connect with sellers. What kind of property are you looking for?";
    default:
      return "Hello! I'm your property assistant. How can I help you today?";
  }
}