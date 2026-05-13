import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { messageService } from '../services/messages';
import { 
  PaperAirplaneIcon, 
  UserCircleIcon, 
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ClockIcon,
  CheckIcon,
  CheckCircleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useLanguage } from '../context/LanguageContext';

const Messages = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
    
    // Polling pour les nouveaux messages (Alternative WebSocket)
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
        // Simple diff logic ou remplacement complet si liste courte
        setMessages(response.data.data || []);
      }
    } catch (error) {}
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await messageService.sendMessage({
        receiver_id: selectedConversation.other_user.id,
        conversation_id: selectedConversation.id,
        body: newMessage
      });

      if (response.success) {
        setMessages([...messages, response.data]);
        setNewMessage('');
        loadConversations(false);
      }
    } catch (error) {
      toast.error(t('msg.error.send'));
    } finally {
      setSending(false);
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-bg-soft">
      
      {/* Sidebar - Liste des conversations */}
      <div className={`${showMobileList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-96 border-e border-border-main bg-bg-card transition-all`}>
        <div className="p-6 border-b border-border-main">
          <h1 className="text-2xl font-black text-text-main tracking-tight mb-4">{t('msg.title')}</h1>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder={t('msg.search_placeholder')}
              className="w-full pl-10 pr-4 py-2 bg-bg-soft border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:bg-bg-card transition-all text-text-main"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.length > 0 ? (
            conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`flex items-center w-full p-4 gap-4 transition-all border-b border-border-main/50 ${selectedConversation?.id === conv.id ? 'bg-primary/5 dark:bg-primary/10 border-s-4 border-s-primary' : 'hover:bg-bg-soft'}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-bg-soft flex items-center justify-center overflow-hidden border border-border-main">
                    {conv.other_user.profile_photo_url ? (
                        <img src={conv.other_user.profile_photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <UserCircleIcon className="w-10 h-10 text-text-muted" />
                    )}
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-bg-card flex items-center justify-center">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-text-main truncate">{conv.other_user.name}</h4>
                    <span className="text-[10px] font-medium text-text-muted whitespace-nowrap ml-2">
                       {conv.last_message_at ? formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true, locale: t('common.locale', 'fr') === 'fr-FR' ? fr : undefined }) : ''}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${conv.unread_count > 0 ? 'text-text-main font-bold' : 'text-text-sub'}`}>
                    {conv.property ? `Re: ${t(conv.property.title)}` : t('msg.list.last_message')}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-text-muted">{t('msg.list.empty')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${!showMobileList ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-bg-card shadow-huge relative z-10`}>
        {selectedConversation ? (
          <>
            {/* Header */}
            <header className="px-6 py-4 border-b border-border-main flex items-center justify-between bg-bg-card/80 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowMobileList(true)} className="md:hidden p-2 hover:bg-bg-soft rounded-lg">
                  <ChevronLeftIcon className="w-5 h-5 text-text-sub" />
                </button>
                <div className="w-10 h-10 rounded-full bg-bg-soft overflow-hidden flex-shrink-0">
                  {selectedConversation.other_user.profile_photo_url ? (
                    <img src={selectedConversation.other_user.profile_photo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircleIcon className="w-full h-full text-text-muted" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-text-main leading-tight">{selectedConversation.other_user.name}</h3>
                  <p className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> {t('msg.status.online')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-bg-soft rounded-xl transition-colors">
                  <EllipsisHorizontalIcon className="w-6 h-6 text-text-muted" />
                </button>
              </div>
            </header>

            {selectedConversation.property && (
                <div className="bg-bg-soft px-6 py-2 border-b border-border-main flex items-center justify-between text-xs transition-all">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <BuildingOfficeIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-text-sub font-medium truncate">{t('msg.property.concerning')} <strong>{t(selectedConversation.property.title)}</strong></span>
                    </div>
                    <button className="text-primary font-bold hover:underline shrink-0 ml-4">{t('msg.property.view_btn')}</button>
                </div>
            )}

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-bg-soft/30">
              {messages.map((msg, i) => {
                const isMine = msg.sender_id === user.id;
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] md:max-w-[70%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                        isMine 
                        ? 'bg-primary !text-white rounded-br-none' 
                        : 'bg-bg-card text-text-main rounded-bl-none border border-border-main'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 px-1">
                        <span className="text-[10px] font-medium text-text-muted">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMine && (
                          msg.read_at 
                          ? <CheckCircleIcon className="w-3 h-3 text-primary" /> 
                          : <CheckIcon className="w-3 h-3 text-text-muted" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-6 bg-bg-card border-t border-border-main">
              <form onSubmit={handleSendMessage} className="flex gap-4">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('msg.input.placeholder')}
                  className="flex-1 bg-bg-soft border-none rounded-2xl px-6 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-bg-card transition-all text-text-main"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-primary !text-white rounded-2xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  <PaperAirplaneIcon className="w-6 h-6 -rotate-45 -translate-y-0.5 translate-x-0.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-text-muted bg-bg-soft/30">
            <div className="w-24 h-24 bg-bg-card rounded-3xl flex items-center justify-center shadow-xl mb-6 border border-border-main">
              <PaperAirplaneIcon className="w-12 h-12 text-text-muted -rotate-45" />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">{t('msg.empty.title')}</h3>
            <p className="max-w-xs text-sm">{t('msg.empty.desc')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
