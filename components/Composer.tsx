
import React, { useState, useEffect } from 'react';
import { Wand2, Image as ImageIcon, Smile, CalendarClock, Loader2, Twitter, Facebook, Linkedin, Instagram, CheckCircle2, Sparkles, PenTool, X, Calendar, ShoppingBag, Plus, LayoutTemplate, Youtube, Video, Pin } from 'lucide-react';
import { generatePostContent, generateHashtags, refineContent, generateSocialImage, generateProductPost } from '../services/geminiService';
import { Platform, Draft, Product } from '../types';

interface ComposerProps {
  initialDraft?: Draft;
}

// Mock Products for e-commerce integration
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Leather Bag', price: '$129.00', description: 'Handcrafted Italian leather messenger bag. Perfect for the modern professional.', image: 'https://picsum.photos/id/103/200/200', inventory: 12 },
  { id: '2', name: 'Wireless Noise-Cancelling Headphones', price: '$249.99', description: 'Immerse yourself in music with industry-leading noise cancellation.', image: 'https://picsum.photos/id/104/200/200', inventory: 45 },
  { id: '3', name: 'Organic Coffee Blend', price: '$18.50', description: 'Rich, smooth medium roast. Ethically sourced and roasted in small batches.', image: 'https://picsum.photos/id/106/200/200', inventory: 120 },
];

const AI_TEMPLATES = [
  { id: 'pas', name: 'Problem-Agitate-Solve', label: 'PAS Framework' },
  { id: 'aida', name: 'Attention-Interest-Desire-Action', label: 'AIDA Framework' },
  { id: 'story', name: 'Storytelling', label: 'Hero\'s Journey' },
  { id: 'viral', name: 'Viral Hook', label: 'Controversial/Viral' },
];

const Composer: React.FC<ComposerProps> = ({ initialDraft }) => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['twitter']);
  
  // AI State
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [activeTab, setActiveTab] = useState<'write' | 'design'>('write');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Writing State
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [postType, setPostType] = useState('general');
  
  // Image State
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Scheduling State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  // Product Picker State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Initialize from Draft
  useEffect(() => {
    if (initialDraft) {
      if (initialDraft.content) setContent(initialDraft.content);
      if (initialDraft.mediaUrl) setGeneratedImage(initialDraft.mediaUrl);
      if (initialDraft.platforms) setSelectedPlatforms(initialDraft.platforms);
      
      if (initialDraft.scheduledDate) {
        setScheduleDate(initialDraft.scheduledDate);
        setIsScheduleModalOpen(true);
      }
    }
  }, [initialDraft]);

  const platforms: { id: Platform; icon: React.ElementType; color: string }[] = [
    { id: 'twitter', icon: Twitter, color: 'bg-sky-500' },
    { id: 'linkedin', icon: Linkedin, color: 'bg-blue-700' },
    { id: 'facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'instagram', icon: Instagram, color: 'bg-pink-600' },
    { id: 'tiktok', icon: Video, color: 'bg-black' },
    { id: 'youtube', icon: Youtube, color: 'bg-red-600' },
    { id: 'pinterest', icon: Pin, color: 'bg-red-500' },
  ];

  const togglePlatform = (id: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleTextGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    const platform = selectedPlatforms[0] || 'twitter';
    const text = await generatePostContent(topic, platform, tone, postType);
    setContent(text);
    setIsGenerating(false);
  };

  const handleTemplateSelect = async (templateName: string) => {
    if (!topic) {
      alert("Please enter a topic first.");
      return;
    }
    setIsGenerating(true);
    setPostType(`using the ${templateName} framework`);
    const platform = selectedPlatforms[0] || 'linkedin';
    const text = await generatePostContent(topic, platform, tone, `structured as ${templateName}`);
    setContent(text);
    setIsGenerating(false);
  };

  const handleImageGenerate = async () => {
    if (!imagePrompt) return;
    
    // API Key check for paid feature
    if ((window as any).aistudio && !(await (window as any).aistudio.hasSelectedApiKey())) {
      try {
        await (window as any).aistudio.openSelectKey();
        // Verify again after modal closes
        if (!(await (window as any).aistudio.hasSelectedApiKey())) {
          alert("API Key required for Image Generation.");
          return;
        }
      } catch (e) {
        console.error(e);
        return;
      }
    }

    setIsGenerating(true);
    try {
      const imgData = await generateSocialImage(imagePrompt);
      if (imgData) setGeneratedImage(imgData);
    } catch (e) {
      console.error(e);
      alert("Failed to generate image. Ensure you have a valid paid API key selected.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (instruction: string) => {
    if(!content) return;
    setIsGenerating(true);
    const refined = await refineContent(content, instruction);
    setContent(refined);
    setIsGenerating(false);
  };

  const handleHashtags = async () => {
    if(!content) return;
    setIsGenerating(true);
    const tags = await generateHashtags(content);
    setContent(prev => prev + '\n\n' + tags.join(' '));
    setIsGenerating(false);
  };

  const handleScheduleSubmit = () => {
    setIsScheduleModalOpen(false);
    // In a real app, this would save to backend
    alert(`Post scheduled for ${scheduleDate} at ${scheduleTime}`);
    setContent('');
    setGeneratedImage(null);
    setTopic('');
    setSelectedPlatforms(['twitter']);
  };

  const handleProductSelect = async (product: Product) => {
    setIsProductModalOpen(false);
    setIsGenerating(true);
    setTopic(`Promoting ${product.name}`);
    setPostType('promotion');
    setTone('urgent'); // Sales posts usually benefit from some urgency

    // Attach product image
    setGeneratedImage(product.image);

    // Generate content
    const platform = selectedPlatforms[0] || 'instagram'; // Default to visual platform for products
    const text = await generateProductPost(product.name, product.description, product.price, platform, 'persuasive');
    setContent(text);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 h-full flex flex-col overflow-hidden relative pb-24 md:pb-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Scheduling Modal */}
      {isScheduleModalOpen && (
        <div className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center">
                <CalendarClock className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                Schedule Post
              </h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input 
                  type="date" 
                  value={scheduleDate}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
                <input 
                  type="time" 
                  value={scheduleTime}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                <div className="text-sm text-indigo-900 dark:text-indigo-200">
                  <p className="font-semibold">AI Suggestion</p>
                  <p className="text-indigo-700/80 dark:text-indigo-300/70">Best time to post for your audience is tomorrow at 10:30 AM.</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end space-x-3">
              <button 
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleScheduleSubmit}
                disabled={!scheduleDate || !scheduleTime}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Picker Modal */}
      {isProductModalOpen && (
        <div className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh] border border-slate-200 dark:border-slate-800">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                Select Product
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_PRODUCTS.map(product => (
                  <div key={product.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex gap-4 bg-white dark:bg-slate-800" onClick={() => handleProductSelect(product)}>
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg bg-slate-100 dark:bg-slate-700" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{product.name}</h4>
                      <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mt-0.5">{product.price}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{product.description}</p>
                      <div className="mt-2 flex items-center text-xs text-slate-400">
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-medium">{product.inventory} in stock</span>
                      </div>
                    </div>
                  </div>
                ))}
                 <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors min-h-[120px]">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Sync New Product</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Post</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Craft perfect content for all your channels</p>
        </div>
        <div className="flex space-x-3">
             <button 
               onClick={() => setIsProductModalOpen(true)}
               className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center hidden sm:flex"
             >
               <ShoppingBag className="w-4 h-4 mr-2" />
               Promote Product
             </button>
             <button className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors hidden sm:block">
               Save Draft
             </button>
             <button 
                onClick={() => setIsScheduleModalOpen(true)}
                disabled={!content}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center shadow-lg shadow-indigo-500/30 dark:shadow-indigo-900/30 transition-all hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
             >
               <CalendarClock className="w-4 h-4 mr-2" />
               Schedule
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Left Column: Tools & Editor */}
        <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto pr-2">
          
          {/* Platform Selector */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-wrap gap-3">
              {platforms.map((p) => {
                const Icon = p.icon;
                const isSelected = selectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                      isSelected 
                        ? `${p.color} text-white border-transparent shadow-md scale-105` 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="capitalize font-medium text-sm">{p.id}</span>
                    {isSelected && <CheckCircle2 className="w-3 h-3 ml-1 text-white/90" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gemini AI Assistant */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm overflow-hidden ring-1 ring-indigo-50 dark:ring-indigo-900/30">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-4 py-3 border-b border-indigo-100 dark:border-indigo-900/30 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-indigo-900 dark:text-indigo-200">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-semibold text-sm">Gemini 3 Pro Assistant</span>
              </div>
              <div className="flex bg-white/50 dark:bg-slate-800/50 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveTab('write')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'write' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  Writer
                </button>
                <button 
                  onClick={() => setActiveTab('design')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'design' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  Designer
                </button>
              </div>
            </div>

            <div className="p-5 bg-indigo-50/30 dark:bg-indigo-900/10">
              {activeTab === 'write' ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">What's this post about?</label>
                    <input 
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Announcing our new eco-friendly packaging..."
                      className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tone</label>
                      <select 
                        value={tone} 
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="funny">Funny & Witty</option>
                        <option value="urgent">Urgent / FOMO</option>
                        <option value="inspiring">Inspiring</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Type</label>
                      <select 
                        value={postType} 
                        onChange={(e) => setPostType(e.target.value)}
                        className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                      >
                        <option value="general">General Update</option>
                        <option value="announcement">Big Announcement</option>
                        <option value="educational">Educational / Tips</option>
                        <option value="promotion">Sales / Promotion</option>
                        <option value="story">Personal Story</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Quick Templates */}
                  <div>
                     <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                       <LayoutTemplate className="w-3 h-3 mr-1" /> Quick Templates
                     </label>
                     <div className="flex flex-wrap gap-2">
                       {AI_TEMPLATES.map(tpl => (
                         <button
                            key={tpl.id}
                            onClick={() => handleTemplateSelect(tpl.name)}
                            className="text-xs bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white px-3 py-1.5 rounded-full transition-colors font-medium shadow-sm"
                         >
                           {tpl.label}
                         </button>
                       ))}
                     </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={handleTextGenerate}
                      disabled={isGenerating || !topic}
                      className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md shadow-indigo-200 dark:shadow-none transition-all active:scale-95 w-full sm:w-auto justify-center"
                    >
                      {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Wand2 className="w-4 h-4 mr-2" />}
                      Generate Draft
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Image Prompt</label>
                    <textarea 
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Describe the image you want to generate..."
                      className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm min-h-[80px] resize-none"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini 3 Pro Image (Paid Key Required)</p>
                    <button 
                      onClick={handleImageGenerate}
                      disabled={isGenerating || !imagePrompt}
                      className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md shadow-purple-200 dark:shadow-none transition-all active:scale-95"
                    >
                      {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <ImageIcon className="w-4 h-4 mr-2" />}
                      Generate Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text Editor */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[300px] relative group">
            <textarea
              className="flex-1 w-full p-6 resize-none outline-none text-base text-slate-800 dark:text-slate-200 bg-transparent leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-600"
              placeholder="Write your masterpiece here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            {/* Attached Image Preview */}
            {generatedImage && (
              <div className="px-6 pb-4">
                <div className="relative inline-block group/img">
                  <img 
                    src={generatedImage} 
                    alt="Generated asset" 
                    className="h-32 w-32 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" 
                  />
                  <button 
                    onClick={() => setGeneratedImage(null)}
                    className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 text-slate-500 hover:text-red-500 rounded-full p-1 shadow-md border border-slate-100 dark:border-slate-700 opacity-0 group-hover/img:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-center rounded-b-xl gap-3 sm:gap-0">
              <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors relative shrink-0">
                  <ImageIcon className="w-4 h-4" />
                </button>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 shrink-0"></div>
                 <button 
                    onClick={() => handleRefine("Make it shorter")}
                    disabled={!content || isGenerating}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-800 shrink-0"
                 >
                    Shorten
                 </button>
                 <button 
                    onClick={() => handleRefine("Make it more engaging")}
                    disabled={!content || isGenerating}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-800 shrink-0"
                 >
                    Rewrite
                 </button>
                 <button 
                    onClick={handleHashtags}
                    disabled={!content || isGenerating}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-800 shrink-0"
                 >
                    + Hashtags
                 </button>
              </div>
              <div className={`text-xs font-semibold px-2 py-1 rounded shrink-0 ${content.length > 280 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {content.length} chars
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-5 lg:border-l border-slate-200 dark:border-slate-800 lg:pl-8 overflow-y-auto hidden lg:block">
          <div className="sticky top-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Live Preview</h3>
              <div className="flex gap-2">
                 <span className="w-2 h-2 rounded-full bg-red-400"></span>
                 <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                 <span className="w-2 h-2 rounded-full bg-green-400"></span>
              </div>
            </div>
            
            <div className="space-y-6">
              {selectedPlatforms.map(platform => (
                  <div key={platform} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                              platform === 'twitter' ? 'bg-sky-500' :
                              platform === 'linkedin' ? 'bg-blue-700' :
                              platform === 'facebook' ? 'bg-blue-600' :
                              platform === 'instagram' ? 'bg-pink-600' :
                              platform === 'tiktok' ? 'bg-black' :
                              platform === 'youtube' ? 'bg-red-600' : 'bg-red-500'
                          }`}>
                              {platform === 'twitter' && <Twitter className="w-5 h-5 text-white" />}
                              {platform === 'linkedin' && <Linkedin className="w-5 h-5 text-white" />}
                              {platform === 'facebook' && <Facebook className="w-5 h-5 text-white" />}
                              {platform === 'instagram' && <Instagram className="w-5 h-5 text-white" />}
                              {platform === 'tiktok' && <Video className="w-5 h-5 text-white" />}
                              {platform === 'youtube' && <Youtube className="w-5 h-5 text-white" />}
                              {platform === 'pinterest' && <Pin className="w-5 h-5 text-white" />}
                          </div>
                          <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">SocialFlow</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Just now • <span className="capitalize">{platform}</span></p>
                          </div>
                      </div>
                      
                      <div className="text-[15px] text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-normal">
                          {content || <span className="text-slate-300 dark:text-slate-600 italic">Start writing to see how your post will look...</span>}
                      </div>

                      {generatedImage ? (
                        <div className="mt-4 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800">
                          <img src={generatedImage} alt="Post attachment" className="w-full h-auto object-cover" />
                        </div>
                      ) : (
                         <div className="mt-4 h-40 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 border-dashed flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2">
                            <ImageIcon className="w-6 h-6 opacity-50" />
                            <span className="text-xs font-medium">No media attached</span>
                         </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800 flex justify-between text-slate-400 dark:text-slate-600 px-2">
                          <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                          <div className="flex gap-4">
                            <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                            <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                          </div>
                      </div>
                  </div>
              ))}
              {selectedPlatforms.length === 0 && (
                  <div className="text-center py-12 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <PenTool className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Select a platform above to preview</p>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Composer;
