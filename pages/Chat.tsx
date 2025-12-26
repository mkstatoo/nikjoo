
import React, { useState, useEffect, useRef } from 'react';
import { chatWithSupport } from '../services/gemini';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot' | 'other';
  text: string;
  timestamp: string;
}

interface ChatItem {
  id: string;
  title: string;
  user: string;
  lastMessage: string;
  image: string;
  time: string;
  type: 'my_ad' | 'other_ad';
  messages: ChatMessage[];
}

const MOCK_CHATS: ChatItem[] = [
  {
    id: '1',
    title: 'هودی و شلوار ست دورس خانم و آقا ضخیم و گرم',
    user: 'تولیدی پوشاک دالوک',
    lastMessage: 'بله موجود است',
    image: 'https://picsum.photos/seed/hoodie/100/100',
    time: 'دوشنبه',
    type: 'other_ad',
    messages: [
      { id: 'm1', role: 'other', text: 'سلام، این ست موجوده؟', timestamp: '۱۰:۳۰' },
      { id: 'm2', role: 'user', text: 'بله موجود است، چه سایزی مد نظرتونه؟', timestamp: '۱۰:۳۵' }
    ]
  },
  {
    id: '2',
    title: 'هودی بیسیک مردانه زنانه رنگارو ببین',
    user: 'پوشاک ویژن',
    lastMessage: 'قرمز داریم اما زرشکی نه',
    image: 'https://picsum.photos/seed/hoodie2/100/100',
    time: 'دوشنبه',
    type: 'other_ad',
    messages: [
      { id: 'm1', role: 'other', text: 'رنگ زرشکی سایز لارج دارید؟', timestamp: 'دیروز' },
      { id: 'm2', role: 'user', text: 'قرمز داریم اما زرشکی نه', timestamp: 'دیروز' }
    ]
  }
];

const AI_STORAGE_KEY = 'nikjoo_ai_chat_history';

interface ChatProps {
  initialTab?: 'my' | 'ai';
}

const Chat: React.FC<ChatProps> = ({ initialTab = 'my' }) => {
  const [activeTab, setActiveTab] = useState<'my' | 'ai'>(initialTab);
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  
  // AI Chat State with persistence and error handling
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(AI_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing AI chat history:", e);
      return [];
    }
  });
  
  const [aiInputValue, setAiInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  // User Chat State
  const [userInputValue, setUserInputValue] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Synchronize AI messages with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(aiMessages));
    } catch (e) {
      console.error("Error saving AI chat history:", e);
    }
  }, [aiMessages]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [aiMessages, isAiTyping, selectedChat?.messages, isOtherTyping, activeTab, selectedChat]);

  const handleSendAiMessage = async () => {
    if (!aiInputValue.trim()) return;
    const text = aiInputValue;
    setAiInputValue('');
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setAiMessages(prev => [...prev, userMsg]);
    setIsAiTyping(true);
    
    const history = aiMessages.map(m => ({ 
      role: m.role === 'user' ? 'user' : 'model', 
      content: m.text 
    }));
    
    const response = await chatWithSupport(text, history);
    
    setAiMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      text: response || 'متأسفانه مشکلی پیش آمده است.',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    }]);
    setIsAiTyping(false);
  };

  const handleSendUserMessage = () => {
    if (!userInputValue.trim() || !selectedChat) return;
    const text = userInputValue;
    setUserInputValue('');
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: 'الان'
    };

    setSelectedChat(prev => prev ? { ...prev, messages: [...prev.messages, newMsg] } : null);
    
    setTimeout(() => {
      setIsOtherTyping(true);
      setTimeout(() => {
        setIsOtherTyping(false);
        const replyMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'other',
          text: 'ممنون، در اولین فرصت بررسی می‌کنم.',
          timestamp: 'الان'
        };
        setSelectedChat(prev => prev ? { ...prev, messages: [...prev.messages, replyMsg] } : null);
      }, 2500);
    }, 1200);
  };

  const clearAiHistory = () => {
    if (window.confirm('آیا مایل به حذف تاریخچه گفتگوی هوشمند هستید؟')) {
      setAiMessages([]);
      localStorage.removeItem(AI_STORAGE_KEY);
    }
  };

  const TypingIndicator = ({ color = 'bg-gray-300' }: { color?: string }) => (
    <div className="flex gap-1.5 p-3 items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className={`w-1.5 h-1.5 ${color} rounded-full animate-bounce [animation-duration:0.6s]`}></div>
      <div className={`w-1.5 h-1.5 ${color} rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]`}></div>
      <div className={`w-1.5 h-1.5 ${color} rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]`}></div>
      <span className="text-[9px] font-black mr-2 opacity-50 uppercase tracking-tighter">در حال نوشتن...</span>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-white overflow-hidden text-right" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shrink-0 shadow-sm z-20">
        {selectedChat && activeTab === 'my' ? (
          <div className="p-4 flex items-center gap-3 bg-blue-50/30">
            <button onClick={() => setSelectedChat(null)} className="p-1 hover:bg-white rounded-full transition-colors">
              <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </button>
            <img src={selectedChat.image} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="" />
            <div className="flex-1 min-w-0 text-right">
              <h2 className="text-sm font-black text-gray-900 truncate">{selectedChat.user}</h2>
              <p className="text-[10px] text-gray-500 truncate">{selectedChat.title}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 flex justify-between items-center">
            <h1 className="text-xl font-black text-gray-900 tracking-tighter">پیام‌ها</h1>
            {activeTab === 'ai' ? (
              <div className="flex items-center gap-3">
                {aiMessages.length > 0 && (
                  <button onClick={clearAiHistory} className="text-gray-400 hover:text-red-700 p-2 transition-colors" title="پاک کردن تاریخچه">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                )}
                <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                  <span className="text-[9px] font-black text-red-700 tracking-tighter">دستیار هوشمند نیکجو</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                </div>
              </div>
            ) : (
              <div className="w-6 h-6"></div>
            )}
          </div>
        )}
        
        {!selectedChat && (
          <div className="flex border-b border-gray-100">
            <button onClick={() => setActiveTab('my')} className={`flex-1 py-4 text-xs font-black transition-all relative ${activeTab === 'my' ? 'text-blue-700' : 'text-gray-400'}`}>
              گفتگوهای من
              {activeTab === 'my' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-700 animate-in fade-in slide-in-from-bottom-1"></div>}
            </button>
            <button onClick={() => setActiveTab('ai')} className={`flex-1 py-4 text-xs font-black transition-all relative ${activeTab === 'ai' ? 'text-red-700' : 'text-gray-400'}`}>
              پشتیبانی هوشمند
              {activeTab === 'ai' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-700 animate-in fade-in slide-in-from-bottom-1"></div>}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/40">
        {activeTab === 'my' ? (
          !selectedChat ? (
            <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
              {MOCK_CHATS.map(chat => (
                <div key={chat.id} onClick={() => setSelectedChat(chat)} className="flex items-center gap-4 p-5 border-b border-gray-50 bg-white hover:bg-blue-50/30 transition-all cursor-pointer group">
                  <div className="relative">
                    <img src={chat.image} alt="" className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-gray-100 group-hover:scale-105 transition-transform" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm font-black text-gray-900 truncate">{chat.user}</h3>
                      <span className="text-[9px] text-gray-400 font-bold">{chat.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate font-medium">{chat.title}</p>
                    <p className="text-[10px] text-gray-400 mt-1.5 truncate flex items-center gap-1">
                      <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
                {selectedChat.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[85%] px-5 py-3.5 rounded-3xl text-sm leading-7 shadow-sm transition-all ${
                      msg.role === 'user' 
                        ? 'bg-blue-700 text-white rounded-tr-none shadow-blue-100' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    }`}>
                      {msg.text}
                      <div className={`text-[8px] mt-1.5 font-bold ${msg.role === 'user' ? 'text-blue-100 text-left' : 'text-gray-400 text-right'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                {isOtherTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-3xl px-3 py-1 shadow-sm border border-gray-100">
                      <TypingIndicator color="bg-blue-600" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2 bg-gray-100 rounded-[2rem] p-1.5 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input 
                    value={userInputValue} 
                    onChange={(e) => setUserInputValue(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSendUserMessage()} 
                    placeholder="پیام خود را بنویسید..." 
                    className="flex-1 px-5 py-3 bg-transparent outline-none text-sm text-right font-medium" 
                  />
                  <button 
                    onClick={handleSendUserMessage} 
                    className="w-11 h-11 bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all hover:bg-blue-800"
                  >
                    <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
              {aiMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-10 text-center animate-in fade-in duration-700">
                  <div className="w-24 h-24 bg-red-100/50 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-5xl shadow-inner border-4 border-white">🤖</div>
                  <h3 className="text-gray-900 font-black text-xl mb-3 tracking-tighter">نیاز به راهنمایی داری؟</h3>
                  <p className="text-xs leading-7 font-medium text-gray-500 max-w-[200px]">من دستیار هوشمند نیکجو هستم. هر سوالی داری بپرس تا کمکت کنم!</p>
                </div>
              ) : (
                <>
                  {aiMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`max-w-[88%] px-5 py-4 rounded-3xl text-sm leading-8 shadow-sm transition-all ${
                        msg.role === 'user' 
                          ? 'bg-red-700 text-white rounded-tr-none shadow-red-100' 
                          : 'bg-white text-gray-900 border border-red-50 rounded-tl-none'
                      }`}>
                        {msg.text}
                        <div className={`text-[8px] mt-2 font-black ${msg.role === 'user' ? 'text-red-100 text-left' : 'text-gray-400 text-right'}`}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-3xl px-3 py-1 border border-red-50 shadow-sm">
                    <TypingIndicator color="bg-red-700" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
            <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
              <div className="flex gap-2 bg-gray-100 rounded-[2rem] p-1.5 focus-within:ring-2 focus-within:ring-red-100 transition-all">
                <input 
                  value={aiInputValue} 
                  onChange={(e) => setAiInputValue(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()} 
                  placeholder="سوال خود را بپرسید..." 
                  className="flex-1 px-5 py-3 bg-transparent outline-none text-sm text-right font-medium" 
                />
                <button 
                  onClick={handleSendAiMessage} 
                  className="w-11 h-11 bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all hover:bg-red-800"
                >
                  <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
