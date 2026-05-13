import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  HomeIcon,
  UserIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

const ChatWidget = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'ai', 
      text: 'Bonjour ! Je suis votre assistant IMMORent. Comment puis-je vous aider aujourd\'hui ?' 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText('');
    
    // Add user message
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Setup axios to hit Laravel backend
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/ai/chat`, {
        message: userMsg
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Note: If axios is configured globally with tokens, this will send it automatically.
        }
      });

      if (response.data && response.data.success) {
        setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: response.data.message }]);
      } else {
        throw new Error('API Error');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        sender: 'ai', 
        text: 'Désolé, le service est temporairement indisponible. Veuillez réessayer plus tard.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (text) => {
    setInputText(text);
    // Optional: Auto send when suggestion is clicked
    // handleSendMessage({ preventDefault: () => {} }, text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] sm:w-[380px] h-[500px] bg-bg-card rounded-2xl shadow-huge border border-border-main flex flex-col overflow-hidden animate-scale-up origin-bottom-right">
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Assistant IMMORent</h3>
                <p className="text-[10px] text-white/80">Propulsé par l'IA</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-soft">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-bg-card text-text-main border border-border-main shadow-sm rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-bg-card border border-border-main shadow-sm rounded-2xl rounded-bl-none p-4 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {!isTyping && messages.length < 3 && (
            <div className="p-3 bg-bg-soft border-t border-border-main flex gap-2 overflow-x-auto hide-scrollbar">
              <Link to="/properties" onClick={() => setIsOpen(false)} className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-bg-card border border-border-main rounded-full text-xs font-medium text-text-sub hover:text-primary hover:border-primary transition-colors">
                <HomeIcon className="w-3.5 h-3.5" /> Voir les biens
              </Link>
              {!user && (
                <Link to="/login" onClick={() => setIsOpen(false)} className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-bg-card border border-border-main rounded-full text-xs font-medium text-text-sub hover:text-primary hover:border-primary transition-colors">
                  <UserPlusIcon className="w-3.5 h-3.5" /> Se connecter
                </Link>
              )}
              <button onClick={() => handleSuggestionClick("Comment contacter un agent ?")} className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-bg-card border border-border-main rounded-full text-xs font-medium text-text-sub hover:text-primary hover:border-primary transition-colors">
                <UserIcon className="w-3.5 h-3.5" /> Agent
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-bg-card border-t border-border-main">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 bg-bg-soft border border-border-main rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                disabled={isTyping}
              />
              <button 
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-md"
              >
                <PaperAirplaneIcon className="w-5 h-5 -ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-huge hover:scale-105 hover:bg-primary-hover transition-all duration-300 border-4 border-white dark:border-bg-card"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 animate-fade-in !text-white" />
        ) : (
          <ChatBubbleLeftRightIcon className="w-6 h-6 animate-fade-in !text-white" />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
