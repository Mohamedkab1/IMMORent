import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  HomeIcon,
  UserIcon,
  UserPlusIcon,
  ChatBubbleOvalLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisIconSolid } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();
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
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
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
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'}/ai/chat`, {
        message: userMsg
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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
  };

  // Light mode conditional classes
  const isLight = theme === 'light';

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Chat Window */}
      <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`absolute bottom-20 right-0 w-[350px] sm:w-[380px] h-[500px] rounded-lg shadow-huge flex flex-col overflow-hidden origin-bottom-right transition-colors duration-300 ${
          isLight 
            ? 'bg-white border border-slate-200' 
            : 'bg-bg-card border border-border-main'
        }`}>
          {/* Header */}
          <div className="bg-blue-600 p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-sm border border-white/30">
                <ChatBubbleOvalLeftEllipsisIconSolid className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-wide">{t('ai.title', 'Assistant IMMORent')}</h3>
                <p className="text-[10px] text-white/80 uppercase tracking-widest font-black">{t('ai.subtitle', 'Intelligence Artificielle')}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-white/80" />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={messagesContainerRef}
            className={`flex-1 overflow-y-auto p-4 space-y-4 transition-colors duration-300 ${
            isLight ? 'bg-slate-50' : 'bg-bg-soft'
          }`}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-lg text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 !text-white rounded-br-none' 
                      : isLight
                        ? 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none'
                        : 'bg-bg-card text-text-main border border-border-main shadow-sm rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.id === 1 ? t('ai.welcome', 'Bonjour ! Je suis votre assistant IMMORent. Comment puis-je vous aider aujourd\'hui ?') : msg.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className={`rounded-lg rounded-bl-none p-4 flex gap-1.5 items-center shadow-sm ${
                  isLight ? 'bg-white border border-slate-200' : 'bg-bg-card border border-border-main'
                }`}>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {!isTyping && messages.length < 3 && (
            <div className={`p-3 border-t flex gap-2 overflow-x-auto hide-scrollbar transition-colors duration-300 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-bg-soft border-border-main'
            }`}>
              <Link to="/properties" onClick={() => setIsOpen(false)} className={`shrink-0 flex items-center gap-1 px-3 py-1.5 border rounded-full text-xs font-medium transition-colors ${
                isLight 
                  ? 'bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600' 
                  : 'bg-bg-card border-border-main text-text-sub hover:text-primary hover:border-primary'
              }`}>
                <HomeIcon className="w-3.5 h-3.5" /> {t('ai.view_properties', 'Voir les biens')}
              </Link>
              {!user && (
                <Link to="/login" onClick={() => setIsOpen(false)} className={`shrink-0 flex items-center gap-1 px-3 py-1.5 border rounded-full text-xs font-medium transition-colors ${
                  isLight 
                    ? 'bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600' 
                    : 'bg-bg-card border-border-main text-text-sub hover:text-primary hover:border-primary'
                }`}>
                  <UserPlusIcon className="w-3.5 h-3.5" /> {t('ai.login', 'Se connecter')}
                </Link>
              )}
              <button onClick={() => handleSuggestionClick(t('ai.ask_agent', 'Comment contacter un agent ?'))} className={`shrink-0 flex items-center gap-1 px-3 py-1.5 border rounded-full text-xs font-medium transition-colors ${
                isLight 
                  ? 'bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600' 
                  : 'bg-bg-card border-border-main text-text-sub hover:text-primary hover:border-primary'
              }`}>
                <UserIcon className="w-3.5 h-3.5" /> {t('ai.agent', 'Agent')}
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className={`p-3 border-t transition-colors duration-300 ${
            isLight ? 'bg-white border-slate-200' : 'bg-bg-card border-border-main'
          }`}>
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('ai.placeholder', 'Posez votre question...')}
                className={`flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400' 
                    : 'bg-bg-soft border-border-main text-text-main'
                }`}
                disabled={isTyping}
              />
              <button 
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-md"
              >
                <PaperAirplaneIcon className="w-5 h-5 -ml-0.5 !text-white" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center shadow-huge transition-all duration-300 border border-blue-500`}
      >
        <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <XMarkIcon className="w-6 h-6 text-white" />
          </motion.div>
        ) : (
          <motion.div key="chat" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 text-white" />
          </motion.div>
        )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ChatWidget;
