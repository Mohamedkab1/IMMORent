import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { messageService } from '../services/messages';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
  PaperAirplaneIcon, 
  UserCircleIcon, 
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  CheckIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { fr, enGB, arMA } from 'date-fns/locale';
import { toast } from 'react-toastify';

const RevealOnScroll = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Messages = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);
  
  const messagesEndRef = useRef(null);

  const getLocale = () => {
    if (language === 'ar') return arMA;
    if (language === 'en') return enGB;
    return fr;
  };

  useEffect(() => {
    loadConversations();
    
    const interval = setInterval(() => {
      loadConversations(false);
      if (selectedConversation) {
        refreshMessages(selectedConversation.id);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await messageService.getConversations();
      if (response.success) {
        setConversations(response.data.data || []);
      }
    } catch (error) {
      console.error('Erreur convs:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setShowMobileList(false);
    setLoadingMessages(true);
    try {
      const response = await messageService.getMessages(conversation.id);
      if (response.success) {
        setMessages(response.data.data || []);
      }
    } catch (error) {
      toast.error(t('msg.error.load_msg'));
    } finally {
      setLoadingMessages(false);
    }
  };

  const refreshMessages = async (id) => {
    try {
      const response = await messageService.getMessages(id);
      if (response.success) {
        const incomingMessages = response.data.data || [];
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const trulyNew = incomingMessages.filter(m => !existingIds.has(m.id));
          
          if (trulyNew.length === 0) {
            // Update read_at for existing messages if changed
            return prev.map(m => {
              const updated = incomingMessages.find(im => im.id === m.id);
              return updated ? { ...m, read_at: updated.read_at } : m;
            });
          }
          
          return [...prev, ...trulyNew];
        });
      }
    } catch (error) {}
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const body = newMessage;
    setNewMessage('');
    
    // Optimistic message
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      sender_id: user.id,
      body: body,
      created_at: new Date().toISOString(),
      sending: true
    };
    
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const response = await messageService.sendMessage({
        receiver_id: selectedConversation.other_user.id,
        conversation_id: selectedConversation.id,
        body: body
      });

      if (response.success) {
        setMessages(prev => prev.map(m => m.id === optimisticMessage.id ? response.data : m));
        loadConversations(false);
      }
    } catch (error) {
      toast.error(t('msg.error.send'));
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      setNewMessage(body);
    }
  };

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-500 ${
      theme === 'light' ? 'bg-slate-50' : 'bg-[#050a1f]'
    }`}>
      
      <div className={`max-w-7xl mx-auto h-[calc(100vh-120px)] flex overflow-hidden rounded-lg shadow-2xl border backdrop-blur-sm relative z-10 m-4 transition-colors duration-500 ${
        theme === 'light' ? 'bg-white border-slate-200' : 'bg-bg-main/50 border-white/5'
      }`}>
        
        {/* Sidebar - Liste des conversations */}
        <div className={`${showMobileList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-96 border-e transition-colors duration-500 ${
          theme === 'light' ? 'bg-white border-slate-200' : 'border-border-main bg-bg-main/80 backdrop-blur-md'
        }`}>
          <div className={`p-8 border-b transition-colors duration-500 ${
            theme === 'light' ? 'border-slate-200' : 'border-border-main'
          }`}>
            <span className="inline-block px-3 py-1 bg-primary !text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-lg mb-4">
              {t('msg.badge', 'Inbox')}
            </span>
            <h1 className={`text-4xl font-black tracking-tighter mb-6 ${
              theme === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              {t('msg.title', 'Messages')}
            </h1>
            <div className="relative">
              <MagnifyingGlassIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                theme === 'light' ? 'text-slate-400' : 'text-text-muted'
              }`} />
              <input 
                type="text" 
                placeholder={t('msg.search_placeholder')}
                className={`w-full pl-12 pr-4 py-4 rounded-lg text-xs font-bold transition-all focus:ring-1 focus:ring-primary border ${
                  theme === 'light' 
                    ? 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-400' 
                    : 'bg-white/5 border-white/10 text-white placeholder:text-white/30'
                }`}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            <AnimatePresence>
              {conversations.length > 0 ? (
                conversations.map((conv, i) => (
                  <motion.button
                    key={conv.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => selectConversation(conv)}
                    className={`flex items-center w-full p-4 gap-4 rounded-lg transition-all group ${
                      selectedConversation?.id === conv.id 
                        ? 'bg-primary/10 border border-primary/20' 
                        : theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className={`w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden border ring-2 ring-transparent group-hover:ring-primary/30 transition-all ${
                        theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-bg-soft border-border-main'
                      }`}>
                        {conv.other_user.profile_photo_url ? (
                            <img src={conv.other_user.profile_photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <UserCircleIcon className={`w-10 h-10 ${theme === 'light' ? 'text-slate-400' : 'text-text-muted'}`} />
                        )}
                      </div>
                      {conv.unread_count > 0 && (
                        <span className={`absolute -top-1 -right-1 w-5 h-5 bg-rose-500 !text-white text-[10px] font-bold rounded-lg border-2 flex items-center justify-center ${
                          theme === 'light' ? 'border-white' : 'border-bg-main'
                        }`}>
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className={`font-black text-xs uppercase tracking-wider truncate ${
                          theme === 'light' ? 'text-slate-900' : 'text-white'
                        }`}>{conv.other_user.name}</h4>
                        <span className={`text-[10px] font-bold whitespace-nowrap ml-2 ${
                          theme === 'light' ? 'text-slate-400' : 'text-text-muted'
                        }`}>
                           {conv.last_message_at ? formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true, locale: getLocale() }) : ''}
                        </span>
                      </div>
                      <p className={`text-xs truncate font-medium ${
                        conv.unread_count > 0 
                          ? (theme === 'light' ? 'text-slate-900 font-black' : 'text-white font-black') 
                          : (theme === 'light' ? 'text-slate-400' : 'text-text-muted')
                      }`}>
                        {conv.property ? conv.property.title : t('msg.list.last_message')}
                      </p>
                    </div>
                  </motion.button>
                ))
              ) : !loading && (
                <div className="p-12 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${
                    theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-bg-soft border-border-main'
                  }`}>
                    <ChatBubbleLeftRightIcon className={`w-8 h-8 opacity-30 ${
                      theme === 'light' ? 'text-slate-400' : 'text-text-muted'
                    }`} />
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${
                    theme === 'light' ? 'text-slate-400' : 'text-text-muted'
                  }`}>{t('msg.list.empty')}</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`${!showMobileList ? 'flex' : 'hidden'} md:flex flex-1 flex-col relative z-10 transition-colors duration-500 ${
          theme === 'light' ? 'bg-slate-50' : 'bg-bg-main/30'
        }`}>
          {selectedConversation ? (
            <>
              {/* Header */}
              <header className={`px-8 py-6 border-b flex items-center justify-between sticky top-0 z-20 transition-colors duration-500 ${
                theme === 'light' ? 'bg-white border-slate-200 backdrop-blur-xl' : 'border-border-main bg-bg-main/60 backdrop-blur-xl'
              }`}>
                <div className="flex items-center gap-5">
                  <button onClick={() => setShowMobileList(true)} className={`md:hidden p-2 rounded-lg transition-colors ${
                    theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-bg-soft'
                  }`}>
                    <ChevronLeftIcon className={`w-5 h-5 ${theme === 'light' ? 'text-slate-500' : 'text-text-sub'}`} />
                  </button>
                  <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border ring-2 ring-primary/10 ${
                    theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-bg-soft border-border-main'
                  }`}>
                    {selectedConversation.other_user.profile_photo_url ? (
                      <img src={selectedConversation.other_user.profile_photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircleIcon className={`w-full h-full ${theme === 'light' ? 'text-slate-400' : 'text-text-muted'}`} />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-black text-sm uppercase tracking-widest ${
                      theme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}>{selectedConversation.other_user.name}</h3>
                    <p className="text-[10px] font-black text-emerald-500 flex items-center gap-1.5 uppercase tracking-[0.2em] mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> 
                      {t('msg.status.online')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className={`p-3 rounded-lg transition-all ${
                    theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-white/60'
                  }`}>
                    <EllipsisHorizontalIcon className="w-6 h-6" />
                  </button>
                </div>
              </header>

              {selectedConversation.property && (
                  <div className={`px-8 py-4 border-b flex items-center justify-between text-[10px] uppercase font-black tracking-widest transition-all ${
                    theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-border-main'
                  }`}>
                      <div className="flex items-center gap-3 overflow-hidden">
                          <BuildingOfficeIcon className="w-4 h-4 text-primary shrink-0" />
                          <span className={`${theme === 'light' ? 'text-slate-500' : 'text-white/40'} truncate`}>
                            {t('msg.property.concerning')} <span className={theme === 'light' ? 'text-slate-900' : 'text-white'}>{selectedConversation.property.title}</span>
                          </span>
                      </div>
                      <button className={`transition-colors shrink-0 ml-4 border-b border-primary/30 hover:border-primary ${
                        theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-primary hover:text-primary-dark'
                      }`}>
                        {t('common.view_details')}
                      </button>
                  </div>
              )}

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => {
                    const isMine = msg.sender_id === user.id;
                    return (
                      <motion.div 
                        key={msg.id}
                        initial={msg.sending ? { opacity: 0, y: 10, scale: 0.95 } : false}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'} transition-opacity`}
                      >
                        <div className={`max-w-[80%] md:max-w-[65%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                          <div className={`px-5 py-4 rounded-lg shadow-xl ${
                            isMine 
                            ? 'bg-primary !text-white rounded-br-none shadow-primary/20' 
                            : theme === 'light' 
                              ? 'bg-white text-slate-900 rounded-bl-none border border-slate-100' 
                              : 'bg-white/5 text-white rounded-bl-none border border-white/10 backdrop-blur-md'
                          } ${msg.sending ? 'opacity-70 animate-pulse' : ''}`}>
                            <p className={`text-sm leading-relaxed font-medium whitespace-pre-wrap ${isMine ? '!text-white' : ''}`}>{msg.body}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2 px-1">
                            <span className={`text-[9px] font-black uppercase tracking-widest ${
                              theme === 'light' ? 'text-slate-400' : 'text-text-muted'
                            }`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMine && !msg.sending && (
                              msg.read_at 
                              ? <CheckCircleIcon className="w-3.5 h-3.5 text-primary" /> 
                              : <CheckIcon className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-slate-400' : 'text-text-muted'}`} />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <div className={`p-8 backdrop-blur-xl border-t transition-colors duration-500 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-bg-main/60 border-border-main'
              }`}>
                <form onSubmit={handleSendMessage} className="flex gap-5">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('msg.input.placeholder')}
                    className={`flex-1 px-8 py-5 rounded-lg text-xs font-bold transition-all focus:ring-1 focus:ring-primary ${
                      theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10 text-white'
                    }`}
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-primary !text-white rounded-lg hover:bg-primary-dark shadow-2xl shadow-primary/30 transition-all disabled:opacity-50 disabled:scale-95 group active:scale-95"
                  >
                    <PaperAirplaneIcon className="w-7 h-7 -rotate-45 -translate-y-0.5 translate-x-0.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <RevealOnScroll className="flex flex-col items-center">
                <div className={`w-32 h-32 rounded-lg flex items-center justify-center shadow-huge mb-10 border animate-float ${
                  theme === 'light' ? 'bg-white border-slate-100' : 'bg-white/5 border-white/10'
                }`}>
                  <PaperAirplaneIcon className="w-16 h-16 text-primary -rotate-45" />
                </div>
                <h3 className={`text-4xl font-black tracking-tighter mb-4 ${
                   theme === 'light' ? 'text-slate-900' : 'text-white'
                }`}>{t('msg.empty.title')}</h3>
                <p className={`max-w-xs mx-auto text-[10px] font-black uppercase tracking-[0.2em] leading-loose ${
                  theme === 'light' ? 'text-slate-400' : 'text-white/30'
                }`}>{t('msg.empty.desc')}</p>
              </RevealOnScroll>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
