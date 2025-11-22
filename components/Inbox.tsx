
import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Send, Sparkles, CheckCircle2, MessageSquare, Loader2, Twitter, Facebook, Linkedin, Instagram, ThumbsUp, Smile, Youtube, Video, Pin, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SocialMessage, Platform, ToastType, ListeningResult } from '../types';
import { generateReply } from '../services/geminiService';

interface InboxProps {
  showToast: (message: string, type: ToastType) => void;
}

// Mock Data
const MOCK_MESSAGES: SocialMessage[] = [
  {
    id: '1',
    platform: 'twitter',
    author: 'Sarah Jenkins',
    authorHandle: '@sarahj_tech',
    authorAvatar: 'https://picsum.photos/id/1011/100',
    content: 'Just tried the new features in SocialFlow and I am blown away! The AI captions are spot on. 🚀',
    timestamp: '10m ago',
    type: 'mention',
    unread: true,
  },
  {
    id: '2',
    platform: 'linkedin',
    author: 'David Miller',
    authorHandle: 'david-miller-pm',
    authorAvatar: 'https://picsum.photos/id/1012/100',
    content: 'Can we schedule carousel posts for LinkedIn yet? Looking to move our agency over.',
    timestamp: '45m ago',
    type: 'comment',
    unread: true,
  },
  {
    id: '3',
    platform: 'instagram',
    author: 'Creative Studio',
    authorHandle: '@creativestudio.io',
    authorAvatar: 'https://picsum.photos/id/1014/100',
    content: 'Love the aesthetic of your recent posts! What tool are you using for templates?',
    timestamp: '2h ago',
    type: 'dm',
    unread: false,
  },
  {
    id: '4',
    platform: 'youtube',
    author: 'Tech Reviews',
    authorHandle: 'TechReviewsChannel',
    authorAvatar: 'https://picsum.photos/id/1025/100',
    content: 'Great video! When is the next tutorial coming out?',
    timestamp: '5h ago',
    type: 'comment',
    unread: false,
  }
];

const MOCK_LISTENING: ListeningResult[] = [
  {
    id: 'l1',
    keyword: 'SocialFlow',
    platform: 'twitter',
    author: 'Mark Growth',
    content: 'Comparing @Buffer vs #SocialFlow for my agency. Any thoughts? The pricing on SF looks way better.',
    sentiment: 'neutral',
    timestamp: '15m ago'
  },
  {
    id: 'l2',
    keyword: 'Social Media Tool',
    platform: 'linkedin',
    author: 'Jessica Lee',
    content: 'Finally found a tool that actually uses AI for content gen, not just a wrapper. #SocialFlow is a game changer.',
    sentiment: 'positive',
    timestamp: '2h ago'
  },
  {
    id: 'l3',
    keyword: 'CompetitorX',
    platform: 'twitter',
    author: 'AngryUser123',
    content: 'CompetitorX is down AGAIN? I need a reliable alternative asap. Recommendations?',
    sentiment: 'negative',
    timestamp: '3h ago'
  }
];

const Inbox: React.FC<InboxProps> = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'listening'>('messages');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(MOCK_MESSAGES[0].id);
  const [replyText, setReplyText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const selectedMessage = MOCK_MESSAGES.find(m => m.id === selectedMessageId);

  const handleAiReply = async (tone: 'supportive' | 'witty' | 'professional' | 'gratitude') => {
    if (!selectedMessage) return;
    setIsGenerating(true);
    const reply = await generateReply(selectedMessage.content, tone);
    setReplyText(reply);
    setIsGenerating(false);
    showToast('AI Reply generated!', 'success');
  };

  const handleSend = () => {
    showToast(`Reply sent to ${selectedMessage?.author}`, 'success');
    setReplyText('');
  };

  const getPlatformIcon = (platform: Platform) => {
    switch(platform) {
      case 'twitter': return <Twitter className="w-3 h-3 text-white" />;
      case 'linkedin': return <Linkedin className="w-3 h-3 text-white" />;
      case 'facebook': return <Facebook className="w-3 h-3 text-white" />;
      case 'instagram': return <Instagram className="w-3 h-3 text-white" />;
      case 'tiktok': return <Video className="w-3 h-3 text-white" />;
      case 'youtube': return <Youtube className="w-3 h-3 text-white" />;
      case 'pinterest': return <Pin className="w-3 h-3 text-white" />;
    }
  };

  const getPlatformColor = (platform: Platform) => {
    switch(platform) {
      case 'twitter': return 'bg-sky-500';
      case 'linkedin': return 'bg-blue-700';
      case 'facebook': return 'bg-blue-600';
      case 'instagram': return 'bg-pink-600';
      case 'tiktok': return 'bg-black';
      case 'youtube': return 'bg-red-600';
      case 'pinterest': return 'bg-red-500';
    }
  };

  const getSentimentIcon = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch(sentiment) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-rose-500" />;
      case 'neutral': return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-200">
      {/* Left Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('messages')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'messages' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
              >
                Messages
              </button>
              <button 
                onClick={() => setActiveTab('listening')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'listening' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
              >
                Listening
              </button>
            </div>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder={activeTab === 'messages' ? "Search messages..." : "Search keywords..."}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'messages' ? (
            MOCK_MESSAGES.map((msg) => (
              <div 
                key={msg.id}
                onClick={() => setSelectedMessageId(msg.id)}
                className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative ${selectedMessageId === msg.id ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-500 dark:border-l-indigo-400' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex gap-3">
                  <div className="relative shrink-0">
                    <img src={msg.authorAvatar} className="w-10 h-10 rounded-full object-cover" alt={msg.author} />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${getPlatformColor(msg.platform)}`}>
                      {getPlatformIcon(msg.platform)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-semibold text-sm truncate ${msg.unread ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{msg.author}</span>
                      <span className="text-xs text-slate-400 shrink-0">{msg.timestamp}</span>
                    </div>
                    <p className={`text-sm line-clamp-2 ${msg.unread ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500 dark:text-slate-500'}`}>
                      {msg.content}
                    </p>
                  </div>
                  {msg.unread && (
                    <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 dark:bg-indigo-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-2 space-y-2">
               <div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Monitored Keywords</div>
               {MOCK_LISTENING.map((item) => (
                 <div key={item.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-full ${getPlatformColor(item.platform)}`}>
                             {getPlatformIcon(item.platform)}
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.author}</span>
                       </div>
                       <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">
                          {getSentimentIcon(item.sentiment)}
                          <span className="capitalize text-slate-600 dark:text-slate-400">{item.sentiment}</span>
                       </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 line-clamp-3">
                       {item.content.split(' ').map((word, i) => 
                         word.toLowerCase().includes(item.keyword.toLowerCase()) || word.includes(item.keyword) 
                         ? <span key={i} className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 font-medium px-0.5 rounded">{word} </span>
                         : word + ' '
                       )}
                    </p>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                       <span>{item.timestamp}</span>
                       <span className="font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">Keyword: {item.keyword}</span>
                    </div>
                 </div>
               ))}
               <button className="w-full py-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors flex items-center justify-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Monitor New Keyword
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Content: Active Conversation */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 h-full overflow-hidden relative transition-colors duration-200">
        {activeTab === 'messages' && selectedMessage ? (
          <>
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center shrink-0 shadow-sm z-10">
               <div className="flex items-center gap-3">
                 <img src={selectedMessage.authorAvatar} className="w-10 h-10 rounded-full" alt={selectedMessage.author} />
                 <div>
                   <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     {selectedMessage.author}
                     <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{selectedMessage.authorHandle}</span>
                   </h3>
                   <div className="flex items-center gap-2">
                     <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white uppercase ${getPlatformColor(selectedMessage.platform)}`}>
                       {selectedMessage.platform}
                     </div>
                     <span className="text-xs text-slate-400">{selectedMessage.type}</span>
                   </div>
                 </div>
               </div>
               <div className="flex gap-2">
                 <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400" title="Mark as Resolved">
                   <CheckCircle2 className="w-5 h-5" />
                 </button>
                 <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
                   <MoreHorizontal className="w-5 h-5" />
                 </button>
               </div>
            </div>

            {/* Conversation Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               {/* Original Post Context (Mock) */}
               <div className="flex justify-center mb-8">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 max-w-md w-full shadow-sm opacity-75">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">In reply to your post</p>
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-md shrink-0"></div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">We are excited to announce our Series B funding round led by...</p>
                      </div>
                    </div>
                  </div>
               </div>

               {/* Incoming Message */}
               <div className="flex gap-4">
                  <img src={selectedMessage.authorAvatar} className="w-10 h-10 rounded-full shrink-0" alt="Author" />
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-lg">
                     <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{selectedMessage.content}</p>
                     <div className="mt-2 flex items-center justify-between">
                       <span className="text-xs text-slate-400">{selectedMessage.timestamp}</span>
                       <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                         <ThumbsUp className="w-3 h-3" />
                       </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Reply Box & AI Tools */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shrink-0">
              {/* AI Smart Reply Chips */}
              <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
                <div className="flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 mr-2 shrink-0">
                   <Sparkles className="w-3 h-3 mr-1" />
                   AI Smart Reply
                </div>
                <button 
                  disabled={isGenerating}
                  onClick={() => handleAiReply('gratitude')}
                  className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg transition-colors whitespace-nowrap"
                >
                  🙏 Say Thanks
                </button>
                <button 
                  disabled={isGenerating}
                  onClick={() => handleAiReply('supportive')}
                  className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg transition-colors whitespace-nowrap"
                >
                  🤝 Helpfully Answer
                </button>
                <button 
                  disabled={isGenerating}
                  onClick={() => handleAiReply('witty')}
                  className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg transition-colors whitespace-nowrap"
                >
                  ⚡ Witty Comeback
                </button>
                <button 
                  disabled={isGenerating}
                  onClick={() => handleAiReply('professional')}
                  className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg transition-colors whitespace-nowrap"
                >
                  👔 Professional
                </button>
              </div>

              <div className="relative">
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={isGenerating ? "Gemini is thinking..." : "Write a reply..."}
                  className={`w-full border border-slate-300 dark:border-slate-700 rounded-xl pl-4 pr-12 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none min-h-[100px] text-slate-900 dark:text-white ${isGenerating ? 'bg-slate-50 dark:bg-slate-800 text-slate-400' : 'bg-white dark:bg-slate-800'}`}
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleSend}
                    disabled={!replyText.trim() || isGenerating}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === 'listening' ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600 p-8 text-center">
             <Activity className="w-16 h-16 mb-4 opacity-50" />
             <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-2">Social Listening Dashboard</h3>
             <p className="max-w-md text-sm">Select a mention on the left to view details, analyze sentiment, and engage directly from here. Tracking 3 keywords.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600">
            <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
            <p className="font-medium">Select a conversation to start replying</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;