
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

interface ChatProps {
  initialTab?: 'my' | 'ai';
  isAdmin?: boolean;
}

const Chat: React.FC<ChatProps> = ({ initialTab = 'my', isAdmin }) => {
  const [activeTab, setActiveTab] = useState<'my' | 'ai'>(initialTab);
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  const [userInputValue, setUserInputValue] = useState('');
  
  const handleAdminDeleteMessage = (msgId: string) => {
    if (!selectedChat) return;
    if (window.confirm("حذف این پیام توسط ادمین؟")) {
      const updatedMessages = selectedChat.messages.map(m => 
        m.id === msgId ? { ...m, isDeleted: true, text: 'این پیام به دلیل محتوای نامناسب توسط مدیریت حذف شد.' } : m
      );
      setSelectedChat({ ...selectedChat, messages: updatedMessages });
    }
  };

  const handleSendUserMessage = async () => {
    if (!userInputValue.trim() || !selectedChat) return;
    
    // AI Moderation before sending
    const modResult = await moderateContent(userInputValue);
    if (!modResult.isSafe) {
      alert(`⚠️ اخطار امنیتی: محتوای پیام شما غیرمجاز تشخیص داده شد.\nعلت: ${modResult.reason || 'نامشخص'}`);
      return;
    }

    const text = userInputValue;
    setUserInputValue('');
    const newMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, timestamp: 'الان' };
    setSelectedChat(prev => prev ? { ...prev, messages: [...prev.messages, newMsg] } : null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-white overflow-hidden text-right" dir="rtl">
      <div className="bg-white border-b border-gray-100 shrink-0 shadow-sm z-20">
        {selectedChat && activeTab === 'my' ? (
          <div className="p-4 flex items-center gap-3 bg-red-50/20">
            <button onClick={() => setSelectedChat(null)} className="p-1"><svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5"/></svg></button>
            <div className="flex-1">
              <h2 className="text-sm font-black text-gray-900">{selectedChat.user}</h2>
              {isAdmin && <span className="text-[8px] bg-red-700 text-white px-2 py-0.5 rounded-full font-black animate-pulse">نظارت ادمین فعال</span>}
            </div>
          </div>
        ) : (
          <div className="p-4 flex justify-between items-center">
            <h1 className="text-xl font-black text-gray-900">پیام‌ها</h1>
            <div className="flex border-b border-gray-100">
               <button onClick={() => setActiveTab('my')} className={`px-4 py-2 text-xs font-black ${activeTab === 'my' ? 'text-red-700 border-b-2 border-red-700' : 'text-gray-400'}`}>گفتگوهای من</button>
               <button onClick={() => setActiveTab('ai')} className={`px-4 py-2 text-xs font-black ${activeTab === 'ai' ? 'text-red-700 border-b-2 border-red-700' : 'text-gray-400'}`}>پشتیبانی هوشمند</button>
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
                      {isAdmin && !msg.isDeleted && (
                        <button 
                          onClick={() => handleAdminDeleteMessage(msg.id)}
                          className="absolute -top-2 -left-2 bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5"/></svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2 bg-gray-100 rounded-[2rem] p-1.5 focus-within:ring-2 ring-red-100 transition-all">
                  <input value={userInputValue} onChange={e => setUserInputValue(e.target.value)} placeholder="پیام..." className="flex-1 px-5 bg-transparent outline-none text-sm font-medium" />
                  <button onClick={handleSendUserMessage} className="w-11 h-11 bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all">
                    <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2" strokeWidth="2.5"/></svg>
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center p-10 text-center text-gray-400">
             <span className="text-4xl mb-4">🤖</span>
             <p className="font-bold">در حال اتصال به دستیار هوشمند پشتیبانی...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
