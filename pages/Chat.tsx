
import React, { useState, useEffect, useRef } from 'react';
import { chatWithSupport, moderateContent } from '../services/gemini';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot' | 'other';
  text: string;
  timestamp: string;
  isDeleted?: boolean;
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
    title: 'هودی و شلوار ست دورس',
    user: 'تولیدی پوشاک دالوک',
    lastMessage: 'بله موجود است',
    image: 'https://picsum.photos/seed/hoodie/100/100',
    time: 'دوشنبه',
    type: 'other_ad',
    messages: [
      { id: 'm1', role: 'other', text: 'سلام، این ست موجوده؟', timestamp: '۱۰:۳۰' },
      { id: 'm2', role: 'user', text: 'بله موجود است، چه سایزی مد نظرتونه؟', timestamp: '۱۰:۳۵' }
    ]
  }
];

const QUICK_HELP = [
  "چطور آگهی ثبت کنم؟",
  "امنیت معاملات",
  "هزینه ثبت آگهی",
  "قوانین سایت"
];

interface ChatProps {
  initialTab?: 'my' | 'ai';
  isAdmin?: boolean;
}

const Chat: React.FC<ChatProps> = ({ initialTab = 'my', isAdmin }) => {
  const [activeTab, setActiveTab] = useState<'my' | 'ai'>(initialTab);
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [userInputValue, setUserInputValue] = useState('');
  
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  const [isAiConnecting, setIsAiConnecting] = useState(true);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const aiChatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'ai' && aiMessages.length === 0) {
      const timer = setTimeout(() => {
        setIsAiConnecting(false);
        setAiMessages([
          {
            id: 'ai_init',
            role: 'bot',
            text: 'سلام! من دستیار هوشمند نیکجو هستم. برای صرفه‌جویی در وقت، می‌توانید از سوالات آماده زیر استفاده کنید یا سوال خود را بپرسید.',
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  useEffect(() => {
    aiChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isAiThinking]);

  const handleSendUserMessage = async (overrideText?: string) => {
    const textToSend = overrideText || userInputValue;
    if (!textToSend.trim()) return;

    if (activeTab === 'my' && selectedChat) {
      const modResult = await moderateContent(textToSend);
      if (!modResult.isSafe) {
        alert(`⚠️ اخطار: ${modResult.reason || 'محتوای نامناسب'}`);
        return;
      }
      setUserInputValue('');
      const newMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: textToSend, timestamp: 'الان' };
      setSelectedChat(prev => prev ? { ...prev, messages: [...prev.messages, newMsg] } : null);
    } 
    else if (activeTab === 'ai') {
      setUserInputValue('');
      const userMsg: ChatMessage = { 
        id: Date.now().toString(), 
        role: 'user', 
        text: textToSend, 
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) 
      };
      setAiMessages(prev => [...prev, userMsg]);
      setIsAiThinking(true);

      const responseText = await chatWithSupport(textToSend, []);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
      };
      setAiMessages(prev => [...prev, botMsg]);
      setIsAiThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-white overflow-hidden text-right" dir="rtl">
      <div className="bg-white border-b border-gray-100 shrink-0 shadow-sm z-20">
        {selectedChat && activeTab === 'my' ? (
          <div className="p-4 flex items-center gap-3 bg-red-50/20">
            <button onClick={() => setSelectedChat(null)} className="p-1"><svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5"/></svg></button>
            <div className="flex-1">
              <h2 className="text-sm font-black text-gray-900">{selectedChat.user}</h2>
              {isAdmin && <span className="text-[8px] bg-red-700 text-white px-2 py-0.5 rounded-full font-black animate-pulse">مانیتورینگ فعال</span>}
            </div>
          </div>
        ) : (
          <div className="p-4 flex justify-between items-center">
            <h1 className="text-xl font-black text-gray-900">پیام‌ها</h1>
            <div className="flex border-b border-gray-100">
               <button onClick={() => setActiveTab('my')} className={`px-4 py-2 text-xs font-black transition-all ${activeTab === 'my' ? 'text-red-700 border-b-2 border-red-700' : 'text-gray-400'}`}>گفتگوها</button>
               <button onClick={() => setActiveTab('ai')} className={`px-4 py-2 text-xs font-black transition-all ${activeTab === 'ai' ? 'text-red-700 border-b-2 border-red-700' : 'text-gray-400'}`}>پشتیبانی هوشمند</button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/40">
        {activeTab === 'my' ? (
          !selectedChat ? (
            <div className="flex-1 overflow-y-auto pb-24">
              {MOCK_CHATS.map(chat => (
                <div key={chat.id} onClick={() => setSelectedChat(chat)} className="flex items-center gap-4 p-5 border-b border-gray-50 bg-white hover:bg-red-50/30 transition-all cursor-pointer">
                  <img src={chat.image} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-gray-900">{chat.user}</h3>
                    <p className="text-[10px] text-gray-400">{chat.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {selectedChat.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
                    <div className={`relative max-w-[85%] px-5 py-3 rounded-3xl text-sm leading-7 shadow-sm ${
                      msg.isDeleted ? 'bg-gray-100 text-gray-400 italic' : 
                      msg.role === 'user' ? 'bg-red-700 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2 bg-gray-100 rounded-[2rem] p-1.5">
                  <input value={userInputValue} onChange={e => setUserInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendUserMessage()} placeholder="پیام..." className="flex-1 px-5 bg-transparent outline-none text-sm font-medium" />
                  <button onClick={() => handleSendUserMessage()} className="w-11 h-11 bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"><svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2" strokeWidth="2.5"/></svg></button>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {aiMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-5 py-3 rounded-3xl text-sm leading-7 shadow-sm ${
                    msg.role === 'user' ? 'bg-red-700 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex justify-start">
                  <div className="bg-white px-5 py-3 rounded-3xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                     <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                     <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={aiChatEndRef} />
            </div>
            
            {/* Quick Help Buttons (Offline Interception) */}
            <div className="px-5 py-3 flex gap-2 overflow-x-auto scrollbar-hide shrink-0 bg-white/50">
               {QUICK_HELP.map(q => (
                 <button 
                   key={q} 
                   onClick={() => handleSendUserMessage(q)}
                   className="whitespace-nowrap bg-white border border-gray-200 px-4 py-2 rounded-full text-[10px] font-black text-gray-600 hover:border-red-700 hover:text-red-700 transition-all"
                 >
                   {q}
                 </button>
               ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2 bg-gray-100 rounded-[2rem] p-1.5">
                <input value={userInputValue} onChange={e => setUserInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && !isAiThinking && handleSendUserMessage()} placeholder="سوال شما..." disabled={isAiThinking} className="flex-1 px-5 bg-transparent outline-none text-sm font-medium disabled:opacity-50" />
                <button onClick={() => handleSendUserMessage()} disabled={isAiThinking || !userInputValue.trim()} className="w-11 h-11 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-30"><svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2" strokeWidth="2.5"/></svg></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;