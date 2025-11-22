
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wand2, Image as ImageIcon, Smile, CalendarClock, Loader2, Twitter, Facebook, Linkedin, Instagram, CheckCircle2, Sparkles, PenTool, X, Calendar, ShoppingBag, Plus, LayoutTemplate, Youtube, Video, Pin, Sliders, Save, RotateCcw, Users, Send, MessageSquare, Repeat, FilePlus, Play, Scissors, Captions, UploadCloud, MapPin, Hash, Globe } from 'lucide-react';
import { generatePostContent, generateHashtags, refineContent, generateSocialImage, generateProductPost, generateVideoCaptions } from '../services/geminiService';
import { Platform, Draft, Product, ToastType, PostComment, VideoEditorConfig, PlatformOptions } from '../types';

interface ComposerProps {
  initialDraft?: Draft;
  showToast: (message: string, type: ToastType) => void;
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

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

const Composer: React.FC<ComposerProps> = ({ initialDraft, showToast }) => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['twitter']);
  
  // Platform Options State
  const [platformOptions, setPlatformOptions] = useState<PlatformOptions>({
    instagram: { firstComment: '', location: '' },
    pinterest: { destinationLink: '' },
    youtube: { visibility: 'public' }
  });

  // Workflow State
  const [workflowStatus, setWorkflowStatus] = useState<'draft' | 'pending_review' | 'approved' | 'rejected'>('draft');
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  
  // AI State
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [activeTab, setActiveTab] = useState<'write' | 'design' | 'team'>('write');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Writing State
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [postType, setPostType] = useState('general');
  
  // Media State (Image & Video)
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  
  // Drag and Drop State
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Image Editor State
  const [imagePrompt, setImagePrompt] = useState('');
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageFilters, setImageFilters] = useState({ brightness: 100, contrast: 100, grayscale: 0, sepia: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Video Editor State
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [videoConfig, setVideoConfig] = useState<VideoEditorConfig>({
    duration: 60, // Mock total duration
    trimStart: 0,
    trimEnd: 60,
    thumbnailTime: 0,
    captions: false
  });

  // Scheduling State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleTimezone, setScheduleTimezone] = useState('UTC');
  const [repeatInterval, setRepeatInterval] = useState('never');

  // Product Picker State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Initialize from Draft
  useEffect(() => {
    if (initialDraft) {
      if (initialDraft.content) setContent(initialDraft.content);
      if (initialDraft.mediaUrl) {
         setMediaUrl(initialDraft.mediaUrl);
         setMediaType(initialDraft.mediaType || 'image');
      }
      if (initialDraft.platforms) setSelectedPlatforms(initialDraft.platforms);
      if (initialDraft.status) setWorkflowStatus(initialDraft.status);
      if (initialDraft.comments) setComments(initialDraft.comments);
      
      if (initialDraft.scheduledDate) {
        setScheduleDate(initialDraft.scheduledDate);
        setIsScheduleModalOpen(true);
      }
      if (initialDraft.platformOptions) {
        setPlatformOptions(initialDraft.platformOptions);
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

  // --- FILE UPLOAD HANDLING ---

  const processFile = useCallback((file: File) => {
    const fileType = file.type.split('/')[0];
    
    if (fileType !== 'image' && fileType !== 'video') {
      showToast('Please upload an image or video file.', 'error');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setMediaUrl(objectUrl);
    setMediaType(fileType as 'image' | 'video');
    
    if (fileType === 'video') {
      setVideoConfig(prev => ({ ...prev, captions: false, captionsText: undefined }));
    }
    
    showToast(`${fileType === 'image' ? 'Image' : 'Video'} uploaded successfully!`, 'success');
  }, [showToast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // --- DRAG AND DROP HANDLERS ---

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // --- AI GENERATION HANDLERS ---

  const handleTextGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    const platform = selectedPlatforms[0] || 'twitter';
    const text = await generatePostContent(topic, platform, tone, postType);
    setContent(text);
    setIsGenerating(false);
    showToast('Content generated successfully!', 'success');
  };

  const handleTemplateSelect = async (templateName: string) => {
    if (!topic) {
      showToast('Please enter a topic first.', 'error');
      return;
    }
    setIsGenerating(true);
    setPostType(`using the ${templateName} framework`);
    const platform = selectedPlatforms[0] || 'linkedin';
    const text = await generatePostContent(topic, platform, tone, `structured as ${templateName}`);
    setContent(text);
    setIsGenerating(false);
    showToast(`${templateName} template applied!`, 'success');
  };

  const handleImageGenerate = async () => {
    if (!imagePrompt) return;
    
    if ((window as any).aistudio && !(await (window as any).aistudio.hasSelectedApiKey())) {
      try {
        await (window as any).aistudio.openSelectKey();
        if (!(await (window as any).aistudio.hasSelectedApiKey())) {
          showToast("API Key required for Image Generation.", 'error');
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
      if (imgData) {
        setMediaUrl(imgData);
        setMediaType('image');
        showToast('Image generated successfully!', 'success');
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to generate image.", 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyImageFilters = () => {
    if (!mediaUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = mediaUrl;
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.filter = `brightness(${imageFilters.brightness}%) contrast(${imageFilters.contrast}%) grayscale(${imageFilters.grayscale}%) sepia(${imageFilters.sepia}%)`;
        ctx.drawImage(img, 0, 0);
        const newDataUrl = canvas.toDataURL('image/png');
        setMediaUrl(newDataUrl);
        setIsEditingImage(false);
        showToast('Image filters applied!', 'success');
        setImageFilters({ brightness: 100, contrast: 100, grayscale: 0, sepia: 0 });
      }
    };
  };

  const handleGenerateCaptions = async () => {
    if (!mediaUrl || mediaType !== 'video') return;
    setIsGenerating(true);
    const captions = await generateVideoCaptions(topic || "Surfing video");
    setVideoConfig(prev => ({ ...prev, captions: true, captionsText: captions }));
    setIsGenerating(false);
    showToast('AI Captions generated!', 'success');
  };

  const handleRefine = async (instruction: string) => {
    if(!content) return;
    setIsGenerating(true);
    const refined = await refineContent(content, instruction);
    setContent(refined);
    setIsGenerating(false);
    showToast('Content refined!', 'success');
  };

  const handleHashtags = async () => {
    if(!content) return;
    setIsGenerating(true);
    const tags = await generateHashtags(content);
    setContent(prev => prev + '\n\n' + tags.join(' '));
    
    // Also auto-populate first comment for Instagram if empty
    if (selectedPlatforms.includes('instagram') && !platformOptions.instagram?.firstComment) {
       setPlatformOptions(prev => ({
          ...prev,
          instagram: { ...prev.instagram, firstComment: tags.join(' ') }
       }));
       showToast('Hashtags added to First Comment!', 'info');
    } else {
       setIsGenerating(false);
       showToast('Hashtags added!', 'success');
    }
    setIsGenerating(false);
  };

  const handleScheduleSubmit = () => {
    setIsScheduleModalOpen(false);
    const recurringMsg = repeatInterval !== 'never' ? ` (Repeats ${repeatInterval})` : '';
    showToast(`Post scheduled for ${scheduleDate} at ${scheduleTime} (${scheduleTimezone})${recurringMsg}`, 'success');
    setWorkflowStatus('approved');
    // Resetting form would happen here in real app
  };

  const handleProductSelect = async (product: Product) => {
    setIsProductModalOpen(false);
    setIsGenerating(true);
    setTopic(`Promoting ${product.name}`);
    setPostType('promotion');
    setTone('urgent'); 
    setMediaUrl(product.image);
    setMediaType('image');

    const platform = selectedPlatforms[0] || 'instagram';
    const text = await generateProductPost(product.name, product.description, product.price, platform, 'persuasive');
    setContent(text);
    
    if (platform === 'pinterest') {
       setPlatformOptions(prev => ({
          ...prev,
          pinterest: { ...prev.pinterest, destinationLink: `https://myshop.com/products/${product.id}` }
       }));
    }

    setIsGenerating(false);
    showToast('Product post generated!', 'success');
  };

  const handleSaveTemplate = () => {
    if (!content) {
      showToast('Cannot save empty content as template', 'error');
      return;
    }
    showToast('Saved as template to Content Library', 'success');
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment: PostComment = {
      id: Date.now().toString(),
      author: 'Alex Creator',
      avatar: 'https://picsum.photos/id/1011/100',
      content: newComment,
      timestamp: 'Just now'
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  const changeStatus = (newStatus: typeof workflowStatus) => {
    setWorkflowStatus(newStatus);
    let msg = '';
    switch(newStatus) {
      case 'pending_review': msg = 'Submitted for review'; break;
      case 'approved': msg = 'Post approved'; break;
      case 'rejected': msg = 'Post rejected. Check comments.'; break;
      case 'draft': msg = 'Moved back to draft'; break;
    }
    showToast(msg, newStatus === 'rejected' ? 'error' : 'success');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 h-full flex flex-col overflow-hidden relative pb-24 md:pb-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*,video/*" 
        onChange={handleFileSelect}
      />

      {/* Image Editor Modal */}
      {isEditingImage && mediaUrl && mediaType === 'image' && (
        <div className="absolute inset-0 bg-slate-900/80 z-[60] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row">
             <div className="flex-1 bg-slate-950 flex items-center justify-center p-6 relative">
                <img 
                  src={mediaUrl} 
                  alt="Editing" 
                  className="max-h-[60vh] max-w-full object-contain shadow-2xl" 
                  style={{
                    filter: `brightness(${imageFilters.brightness}%) contrast(${imageFilters.contrast}%) grayscale(${imageFilters.grayscale}%) sepia(${imageFilters.sepia}%)`
                  }}
                />
                <canvas ref={canvasRef} className="hidden" />
             </div>
             <div className="w-full md:w-80 bg-white dark:bg-slate-900 p-6 flex flex-col border-l border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center">
                  <Sliders className="w-5 h-5 mr-2" />
                  Adjustments
                </h3>
                <div className="space-y-6 flex-1">
                   {['Brightness', 'Contrast', 'Grayscale', 'Sepia'].map(filter => {
                     const key = filter.toLowerCase() as keyof typeof imageFilters;
                     const max = key === 'grayscale' || key === 'sepia' ? 100 : 200;
                     return (
                       <div key={filter}>
                          <div className="flex justify-between mb-2">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{filter}</label>
                            <span className="text-xs text-slate-700 dark:text-slate-300">{imageFilters[key]}%</span>
                          </div>
                          <input 
                            type="range" min="0" max={max} 
                            value={imageFilters[key]} 
                            onChange={(e) => setImageFilters({...imageFilters, [key]: parseInt(e.target.value)})}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                       </div>
                     );
                   })}
                </div>
                <div className="flex gap-3 mt-8">
                   <button 
                     onClick={() => {
                       setIsEditingImage(false);
                       setImageFilters({ brightness: 100, contrast: 100, grayscale: 0, sepia: 0 });
                     }}
                     className="flex-1 py-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium text-sm transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={applyImageFilters}
                     className="flex-1 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-sm transition-colors flex items-center justify-center"
                   >
                     <Save className="w-4 h-4 mr-2" />
                     Apply
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Video Editor Modal */}
      {isEditingVideo && mediaUrl && mediaType === 'video' && (
        <div className="absolute inset-0 bg-slate-900/80 z-[60] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row">
             <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-6 relative">
                <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden mb-4 shadow-2xl">
                   <video src={mediaUrl} className="w-full h-full object-cover" controls />
                   {videoConfig.captions && (
                     <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                       <span className="bg-black/60 text-white px-2 py-1 rounded text-sm font-semibold">
                         {videoConfig.captionsText?.split('\n')[0] || "Auto-generated captions appear here..."}
                       </span>
                     </div>
                   )}
                </div>
                
                {/* Timeline Trimmer Mock */}
                <div className="w-full max-w-md px-4">
                   <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>{videoConfig.trimStart}s</span>
                      <span>Trim Video</span>
                      <span>{videoConfig.trimEnd}s</span>
                   </div>
                   <div className="relative h-10 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                      {/* Fake timeline track */}
                      <div className="absolute inset-y-0 left-[10%] right-[10%] bg-indigo-500/30 border-x-2 border-indigo-500"></div>
                   </div>
                </div>
             </div>
             
             <div className="w-full md:w-80 bg-white dark:bg-slate-900 p-6 flex flex-col border-l border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center">
                  <Scissors className="w-5 h-5 mr-2" />
                  Video Tools
                </h3>
                <div className="space-y-6 flex-1">
                   <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">AI Captions</label>
                      <button 
                        onClick={handleGenerateCaptions}
                        disabled={isGenerating}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${videoConfig.captions ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                      >
                         <span className="flex items-center text-sm font-medium">
                           <Captions className="w-4 h-4 mr-2" />
                           {videoConfig.captions ? 'Captions On' : 'Generate Captions'}
                         </span>
                         {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : videoConfig.captions && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                   </div>

                   <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">Thumbnail</label>
                      <div className="grid grid-cols-3 gap-2">
                         {[1, 2, 3].map(i => (
                            <div key={i} className={`aspect-video bg-slate-100 dark:bg-slate-800 rounded cursor-pointer border-2 ${i === 1 ? 'border-indigo-500' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}></div>
                         ))}
                      </div>
                   </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                   <button 
                     onClick={() => setIsEditingVideo(false)}
                     className="flex-1 py-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium text-sm transition-colors"
                   >
                     Done
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

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
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
                  <input 
                    type="time" 
                    value={scheduleTime}
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Timezone</label>
                   <select 
                     value={scheduleTimezone}
                     onChange={(e) => setScheduleTimezone(e.target.value)}
                     className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                   >
                     {TIMEZONES.map(tz => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                     ))}
                   </select>
                </div>
              </div>
              
              {/* Recurring Options */}
              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Recurring</label>
                 <div className="flex gap-2">
                    <select 
                      value={repeatInterval}
                      onChange={(e) => setRepeatInterval(e.target.value)}
                      className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                       <option value="never">Does not repeat</option>
                       <option value="daily">Daily</option>
                       <option value="weekly">Weekly</option>
                       <option value="monthly">Monthly</option>
                    </select>
                    <div className="flex items-center justify-center w-10 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                       <Repeat className="w-5 h-5" />
                    </div>
                 </div>
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
             New Post
             {workflowStatus !== 'draft' && (
               <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold border ${
                 workflowStatus === 'approved' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 border-emerald-200' :
                 workflowStatus === 'rejected' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 border-rose-200' :
                 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 border-amber-200'
               }`}>
                 {workflowStatus.replace('_', ' ')}
               </span>
             )}
          </h1>
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
             
             {/* Workflow Actions */}
             {workflowStatus === 'draft' ? (
               <>
                <button 
                  onClick={handleSaveTemplate}
                  disabled={!content}
                  className="bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors hidden sm:flex items-center"
                  title="Save as Template"
                >
                   <FilePlus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => showToast('Draft saved!', 'info')}
                  className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors hidden sm:block"
                >
                  Save Draft
                </button>
                <button 
                    onClick={() => changeStatus('pending_review')}
                    disabled={!content}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center shadow-lg shadow-indigo-500/30 dark:shadow-indigo-900/30 transition-all hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Submit for Review
                </button>
               </>
             ) : workflowStatus === 'pending_review' ? (
               <>
                  <button 
                    onClick={() => changeStatus('rejected')}
                    className="bg-white dark:bg-slate-800 text-rose-600 border border-rose-200 dark:border-rose-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                  >
                    Reject
                  </button>
                  <button 
                      onClick={() => changeStatus('approved')}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center shadow-lg shadow-emerald-500/30 dark:shadow-emerald-900/30 transition-all hover:scale-105"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </button>
               </>
             ) : (
                <button 
                    onClick={() => setIsScheduleModalOpen(true)}
                    disabled={!content}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center shadow-lg shadow-indigo-500/30 dark:shadow-indigo-900/30 transition-all hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                >
                  <CalendarClock className="w-4 h-4 mr-2" />
                  Schedule
                </button>
             )}
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
          
          {/* Platform Specific Options */}
          {(selectedPlatforms.includes('instagram') || selectedPlatforms.includes('pinterest')) && (
             <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-top-2">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Platform Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {selectedPlatforms.includes('instagram') && (
                      <div className="space-y-2">
                         <label className="flex items-center text-sm font-medium text-pink-600 dark:text-pink-400">
                            <Instagram className="w-3 h-3 mr-1.5" /> Instagram First Comment
                         </label>
                         <textarea 
                            placeholder="Add hashtags here to keep your caption clean..."
                            value={platformOptions.instagram?.firstComment || ''}
                            onChange={(e) => setPlatformOptions({...platformOptions, instagram: {...platformOptions.instagram, firstComment: e.target.value}})}
                            className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-pink-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white h-20 resize-none"
                         />
                      </div>
                   )}
                   {selectedPlatforms.includes('pinterest') && (
                      <div className="space-y-2">
                         <label className="flex items-center text-sm font-medium text-red-600 dark:text-red-400">
                            <Pin className="w-3 h-3 mr-1.5" /> Destination Link
                         </label>
                         <input 
                            type="text"
                            placeholder="https://..."
                            value={platformOptions.pinterest?.destinationLink || ''}
                            onChange={(e) => setPlatformOptions({...platformOptions, pinterest: {...platformOptions.pinterest, destinationLink: e.target.value}})}
                            className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                         />
                      </div>
                   )}
                </div>
             </div>
          )}

          {/* Tools Panel (Gemini AI & Team) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm overflow-hidden ring-1 ring-indigo-50 dark:ring-indigo-900/30">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-4 py-3 border-b border-indigo-100 dark:border-indigo-900/30 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-indigo-900 dark:text-indigo-200">
                {activeTab === 'team' ? (
                   <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                ) : (
                   <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                )}
                <span className="font-semibold text-sm">{activeTab === 'team' ? 'Team Collaboration' : 'Gemini 3 Pro Assistant'}</span>
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
                <button 
                  onClick={() => setActiveTab('team')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${activeTab === 'team' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  Team
                  {comments.length > 0 && <span className="w-2 h-2 bg-rose-500 rounded-full"></span>}
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
              ) : activeTab === 'design' ? (
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
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300 h-[300px] flex flex-col">
                   <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                     {comments.length === 0 ? (
                        <div className="text-center text-slate-400 dark:text-slate-500 text-sm py-8">
                           <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                           No comments yet. Start the discussion!
                        </div>
                     ) : (
                        comments.map((comment) => (
                           <div key={comment.id} className="flex gap-3">
                              <img src={comment.avatar} className="w-8 h-8 rounded-full shrink-0" alt={comment.author} />
                              <div>
                                 <div className="flex items-baseline gap-2">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">{comment.author}</span>
                                    <span className="text-xs text-slate-400">{comment.timestamp}</span>
                                 </div>
                                 <p className="text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700 mt-1">
                                    {comment.content}
                                 </p>
                              </div>
                           </div>
                        ))
                     )}
                   </div>
                   <div className="relative mt-auto">
                      <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addComment()}
                        placeholder="Add a comment..."
                        className="w-full border border-slate-300 dark:border-slate-700 rounded-lg pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      <button 
                        onClick={addComment}
                        className="absolute right-1.5 top-1.5 p-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Text Editor with Drag & Drop */}
          <div 
            className={`bg-white dark:bg-slate-900 rounded-xl border shadow-sm flex flex-col min-h-[300px] relative group transition-colors duration-200 ${
              isDragging 
                ? 'border-indigo-500 border-2 bg-indigo-50/50 dark:bg-indigo-900/20' 
                : 'border-slate-200 dark:border-slate-800'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
             {/* Drag Overlay */}
             {isDragging && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl animate-in fade-in">
                   <UploadCloud className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mb-4" />
                   <p className="text-xl font-bold text-slate-800 dark:text-white">Drop to upload</p>
                   <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Images or Videos supported</p>
                </div>
             )}

            <textarea
              className="flex-1 w-full p-6 resize-none outline-none text-base text-slate-800 dark:text-slate-200 bg-transparent leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-600 relative z-10"
              placeholder="Write your masterpiece here... (or drag and drop media)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            {/* Attached Media Preview */}
            {mediaUrl && (
              <div className="px-6 pb-4 relative z-10">
                <div className="relative inline-block group/media">
                  {mediaType === 'video' ? (
                     <div className="h-32 w-32 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden bg-black flex items-center justify-center relative">
                         <video src={mediaUrl} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                             <Play className="w-8 h-8 text-white opacity-80" />
                         </div>
                     </div>
                  ) : (
                     <img 
                      src={mediaUrl} 
                      alt="Generated asset" 
                      className="h-32 w-32 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" 
                    />
                  )}
                  
                  <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover/media:opacity-100 transition-opacity">
                    <button 
                      onClick={() => mediaType === 'video' ? setIsEditingVideo(true) : setIsEditingImage(true)}
                      className="bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-500 rounded-full p-1 shadow-md border border-slate-100 dark:border-slate-700"
                      title="Edit Media"
                    >
                      <PenTool className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => { setMediaUrl(null); setMediaType(null); }}
                      className="bg-white dark:bg-slate-800 text-slate-500 hover:text-red-500 rounded-full p-1 shadow-md border border-slate-100 dark:border-slate-700"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-center rounded-b-xl gap-3 sm:gap-0 relative z-10">
              <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <button 
                  onClick={triggerFileUpload}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors relative shrink-0" 
                  title="Upload Image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button 
                   onClick={triggerFileUpload}
                   className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors relative shrink-0"
                   title="Upload Video"
                >
                   <Video className="w-4 h-4" />
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
                  <div key={platform} className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${platform === 'tiktok' || platform === 'instagram' ? 'rounded-2xl' : 'rounded-xl'}`}>
                      {/* Platform Header Simulation */}
                      <div className="flex items-center space-x-3 p-4 border-b border-slate-50 dark:border-slate-800/50">
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
                      
                      <div className="p-4 text-[15px] text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-normal">
                          {content || <span className="text-slate-300 dark:text-slate-600 italic">Start writing to see how your post will look...</span>}
                      </div>

                      {/* Media Rendering */}
                      {mediaUrl ? (
                        <div className={`${(platform === 'tiktok' || platform === 'instagram') ? 'aspect-[9/16] mx-4 mb-4' : 'aspect-video w-full'} bg-black rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 relative`}>
                          {mediaType === 'video' ? (
                            <>
                               <video src={mediaUrl} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                     <Play className="w-5 h-5 text-white fill-current" />
                                  </div>
                               </div>
                               {videoConfig.captions && (
                                 <div className="absolute bottom-8 left-4 right-4 text-center">
                                   <span className="inline-block bg-black/60 text-white text-sm px-2 py-1 rounded font-medium">
                                     {videoConfig.captionsText?.split('\n')[0] || "Video captions..."}
                                   </span>
                                 </div>
                               )}
                            </>
                          ) : (
                            <img src={mediaUrl} alt="Post attachment" className="w-full h-full object-cover" />
                          )}
                        </div>
                      ) : (
                         <div className="mx-4 mb-4 h-40 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 border-dashed flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2">
                            <ImageIcon className="w-6 h-6 opacity-50" />
                            <span className="text-xs font-medium">No media attached</span>
                         </div>
                      )}

                      {/* Platform Specific Footer Preview */}
                      {platform === 'instagram' && platformOptions.instagram?.firstComment && (
                         <div className="px-4 pb-4 pt-0 text-sm">
                            <span className="font-bold text-slate-900 dark:text-white mr-2">socialflow</span>
                            <span className="text-slate-700 dark:text-slate-300">{platformOptions.instagram.firstComment}</span>
                         </div>
                      )}

                      {/* Platform Footer Simulation */}
                      <div className="px-4 py-3 border-t border-slate-50 dark:border-slate-800 flex justify-between text-slate-400 dark:text-slate-600">
                          {platform === 'twitter' ? (
                             <div className="flex w-full justify-between px-2">
                                <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"></div>
                                <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"></div>
                                <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"></div>
                                <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"></div>
                             </div>
                          ) : (
                             <>
                               <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                               <div className="flex gap-4">
                                  <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                  <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                               </div>
                             </>
                          )}
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
