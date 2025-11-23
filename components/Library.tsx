import React, { useState, useRef } from "react";
import {
  Search,
  Filter,
  Image as ImageIcon,
  FileText,
  Video,
  MoreHorizontal,
  Upload,
  Plus,
  Download,
  Trash2,
  Rss,
  ExternalLink,
  PenSquare,
  RefreshCw,
  Archive,
  Repeat,
  Search as SearchIcon,
  Hash,
  X,
  Clock,
  Save,
  Loader2,
  CalendarCheck,
  Zap,
  Folder as FolderIcon,
  FolderOpen,
} from "lucide-react";
import {
  MediaAsset,
  Draft,
  RSSArticle,
  Bucket,
  PlanTier,
  HashtagGroup,
  Post,
  Folder,
} from "../types";
import { generatePostFromRSS } from "../services/geminiService";

interface LibraryProps {
  onCompose: (draft: Draft) => void;
  userPlan: PlanTier;
  onOpenUpgrade: () => void;
  onPostCreated?: (post: Post) => void;
}

const MOCK_FOLDERS: Folder[] = [
  { id: "all", name: "All Uploads", type: "system", icon: "folder-open" },
  { id: "campaign-a", name: "Summer Campaign", type: "user" },
  { id: "evergreen", name: "Evergreen", type: "user" },
  { id: "videos", name: "Video Assets", type: "user" },
];

const MOCK_ASSETS_INIT: MediaAsset[] = [
  {
    id: "1",
    type: "image",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    name: "Summer Campaign Hero",
    createdAt: "2 days ago",
    tags: ["summer", "hero"],
    folderId: "campaign-a",
  },
  {
    id: "2",
    type: "image",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    name: "Product Teaser v2",
    createdAt: "3 days ago",
    tags: ["product", "teaser"],
  },
  {
    id: "3",
    type: "template",
    content: "Exciting news! 🚀 We are thrilled to announce [Product Name]...",
    name: "Product Launch Template",
    createdAt: "1 week ago",
    tags: ["launch", "announcement"],
    folderId: "evergreen",
  },
  {
    id: "4",
    type: "video",
    url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80",
    name: "Behind the Scenes",
    createdAt: "1 week ago",
    tags: ["bts", "video"],
    folderId: "videos",
  },
  {
    id: "5",
    type: "image",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80",
    name: "Team Offsite",
    createdAt: "2 weeks ago",
    tags: ["team", "culture"],
  },
  {
    id: "6",
    type: "template",
    content:
      "Join us for our upcoming webinar on [Topic] this [Day]! 📅 Register here: [Link]",
    name: "Webinar Invite",
    createdAt: "2 weeks ago",
    tags: ["webinar", "event"],
  },
];

const MOCK_RSS: RSSArticle[] = [
  {
    id: "1",
    title: "The Future of AI in Marketing",
    source: "TechCrunch",
    url: "https://techcrunch.com",
    publishedAt: "2 hours ago",
    snippet:
      "How generative AI is reshaping the landscape of digital marketing agencies...",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80",
  },
  {
    id: "2",
    title: "Social Media Trends for 2025",
    source: "Social Media Today",
    url: "https://socialmediatoday.com",
    publishedAt: "4 hours ago",
    snippet:
      "Video content continues to dominate as platforms shift prioritization...",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
  },
  {
    id: "3",
    title: "5 Tips for Better Engagement",
    source: "The Verge",
    url: "https://theverge.com",
    publishedAt: "1 day ago",
    snippet:
      "Stop chasing algorithms and start building community with these simple steps...",
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80",
  },
];

const MOCK_BUCKETS: Bucket[] = [
  {
    id: "1",
    name: "Inspirational Quotes",
    postCount: 42,
    schedule: "Every Mon, Wed",
    color: "bg-purple-500",
  },
  {
    id: "2",
    name: "Blog Promotions",
    postCount: 15,
    schedule: "Every Tuesday",
    color: "bg-blue-500",
  },
  {
    id: "3",
    name: "Product Highlights",
    postCount: 28,
    schedule: "Weekends",
    color: "bg-emerald-500",
  },
];

const MOCK_STOCK_PHOTOS = [
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1551434678-e076c2236034?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
];

const MOCK_HASHTAGS: HashtagGroup[] = [
  {
    id: "1",
    name: "Tech Startups",
    tags: ["#startup", "#tech", "#innovation", "#saas", "#growth"],
  },
  {
    id: "2",
    name: "Summer Vibes",
    tags: ["#summer", "#summervibes", "#sunshine", "#fun"],
  },
  {
    id: "3",
    name: "Monday Motivation",
    tags: ["#mondaymotivation", "#grind", "#success", "#goals"],
  },
];

const Library: React.FC<LibraryProps> = ({
  onCompose,
  userPlan,
  onOpenUpgrade,
  onPostCreated,
}) => {
  const [activeTab, setActiveTab] = useState<
    "library" | "rss" | "buckets" | "stock" | "hashtags"
  >("library");
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [folders, setFolders] = useState<Folder[]>(MOCK_FOLDERS);
  const [assets, setAssets] = useState<MediaAsset[]>(MOCK_ASSETS_INIT);

  const [activeFilter, setActiveFilter] = useState<
    "all" | "image" | "video" | "template"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rssUrl, setRssUrl] = useState("");
  const [hashtags, setHashtags] = useState<HashtagGroup[]>(MOCK_HASHTAGS);
  const [editingBucket, setEditingBucket] = useState<Bucket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [generatingRssId, setGeneratingRssId] = useState<string | null>(null);

  // Hashtag local state
  const [newTagName, setNewTagName] = useState("");
  const [newTagContent, setNewTagContent] = useState("");

  const filteredAssets = assets.filter((asset) => {
    const matchesFolder =
      activeFolder === "all" || asset.folderId === activeFolder;
    const matchesFilter = activeFilter === "all" || asset.type === activeFilter;
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesFolder && matchesFilter && matchesSearch;
  });

  const handleUseAsset = (asset: MediaAsset) => {
    onCompose({
      mediaUrl: asset.type !== "template" ? asset.url : undefined,
      content: asset.type === "template" ? asset.content : undefined,
      mediaType: asset.type as "image" | "video" | undefined,
    });
  };

  const handleUseArticle = async (article: RSSArticle) => {
    setGeneratingRssId(article.id);
    const postContent = await generatePostFromRSS(
      article.title,
      article.snippet,
      article.source
    );
    setGeneratingRssId(null);

    onCompose({
      content: `${postContent}\n\n${article.url}`,
      mediaUrl: article.imageUrl,
      mediaType: "image",
      platforms: ["twitter", "linkedin"],
    });
  };

  const handleAutoSchedule = (bucket: Bucket) => {
    if (!onPostCreated) return;

    // Simulate creating posts
    const mockPosts: Post[] = [
      {
        id: Date.now().toString(),
        content: `${bucket.name} Post 1`,
        scheduledDate: "2023-11-06",
        time: "09:00",
        platforms: ["twitter"],
        status: "scheduled",
      },
      {
        id: (Date.now() + 1).toString(),
        content: `${bucket.name} Post 2`,
        scheduledDate: "2023-11-08",
        time: "09:00",
        platforms: ["linkedin"],
        status: "scheduled",
      },
      {
        id: (Date.now() + 2).toString(),
        content: `${bucket.name} Post 3`,
        scheduledDate: "2023-11-10",
        time: "09:00",
        platforms: ["instagram"],
        status: "scheduled",
      },
    ];

    mockPosts.forEach((p) => onPostCreated(p));
    alert(`Scheduled ${mockPosts.length} posts from ${bucket.name} bucket!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const type = file.type.startsWith("video") ? "video" : "image";
      const url = URL.createObjectURL(file);

      const newAsset: MediaAsset = {
        id: Date.now().toString(),
        type,
        url,
        name: file.name,
        createdAt: "Just now",
        tags: ["uploaded"],
        folderId: activeFolder !== "all" ? activeFolder : undefined,
      };

      setAssets([newAsset, ...assets]);
    }
  };

  const handleCreateHashtagGroup = () => {
    if (!newTagName || !newTagContent) return;
    const tags = newTagContent.split(" ").filter((t) => t.startsWith("#"));
    if (tags.length === 0) return;

    const newGroup: HashtagGroup = {
      id: Date.now().toString(),
      name: newTagName,
      tags,
    };
    setHashtags([newGroup, ...hashtags]);
    setNewTagName("");
    setNewTagContent("");
  };

  const handleDeleteHashtagGroup = (id: string) => {
    setHashtags((prev) => prev.filter((h) => h.id !== id));
  };

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) {
      setFolders([
        ...folders,
        { id: name.toLowerCase().replace(/\s+/g, "-"), name, type: "user" },
      ]);
    }
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,video/*"
      />

      {/* Bucket Config Modal */}
      {editingBucket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <Archive className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                Configure Queue
              </h3>
              <button
                onClick={() => setEditingBucket(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bucket Name
                </label>
                <input
                  type="text"
                  value={editingBucket.name}
                  readOnly
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                />
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" /> Posting Schedule
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded border border-indigo-100 dark:border-indigo-900/50">
                    <span>Mondays</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">
                      09:00 AM
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded border border-indigo-100 dark:border-indigo-900/50">
                    <span>Wednesdays</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">
                      02:30 PM
                    </span>
                  </div>
                </div>
                <button className="mt-3 w-full py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                  + Add Time Slot
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Repeat className="w-4 h-4" />
                <span>Recycle posts after publishing?</span>
                <input
                  type="checkbox"
                  checked
                  className="ml-auto w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setEditingBucket(null)}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setEditingBucket(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Content Hub
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage assets and curate content
          </p>
        </div>

        <div className="flex bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1 shadow-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab("library")}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === "library" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Media
          </button>
          <button
            onClick={() => setActiveTab("rss")}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === "rss" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <Rss className="w-4 h-4 mr-2" />
            Feeds
          </button>
          <button
            onClick={() => setActiveTab("buckets")}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === "buckets" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <Archive className="w-4 h-4 mr-2" />
            Buckets
          </button>
          <button
            onClick={() => setActiveTab("hashtags")}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === "hashtags" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <Hash className="w-4 h-4 mr-2" />
            Hashtags
          </button>
          <button
            onClick={() => setActiveTab("stock")}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === "stock" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <SearchIcon className="w-4 h-4 mr-2" />
            Stock
          </button>
        </div>
      </div>

      {activeTab === "library" ? (
        <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
          {/* Folder Sidebar */}
          <div className="w-full lg:w-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col shadow-sm h-fit lg:h-auto overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider">
                Folders
              </h3>
              <button
                onClick={handleCreateFolder}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setActiveFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFolder === folder.id
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {folder.id === "all" ? (
                      <FolderOpen className="w-4 h-4" />
                    ) : (
                      <FolderIcon className="w-4 h-4" />
                    )}
                    <span className="truncate max-w-[120px]">
                      {folder.name}
                    </span>
                  </div>
                  {folder.id !== "all" && (
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-1.5 rounded-full text-slate-500 dark:text-slate-400">
                      {assets.filter((a) => a.folderId === folder.id).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filters and Search */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                {["all", "image", "video", "template"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(type as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      activeFilter === type
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </button>
                <button className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-10 pr-2">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
                >
                  {/* Preview Area */}
                  <div className="relative h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    {asset.type === "image" || asset.type === "video" ? (
                      <>
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                        />
                        {asset.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                              <Video className="w-5 h-5 text-slate-900 ml-1" />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-6 w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex flex-col">
                        <FileText className="w-8 h-8 text-indigo-400 mb-3" />
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed font-medium">
                          {asset.content}
                        </p>
                      </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleUseAsset(asset)}
                        className="p-2 bg-white rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
                        title="Use in Composer"
                      >
                        <PenSquare className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 bg-white rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {asset.type === "image" && (
                            <ImageIcon className="w-4 h-4 text-slate-400" />
                          )}
                          {asset.type === "video" && (
                            <Video className="w-4 h-4 text-slate-400" />
                          )}
                          {asset.type === "template" && (
                            <FileText className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                            {asset.type}
                          </span>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <h3
                        className="font-semibold text-slate-900 dark:text-white truncate mb-1 text-sm"
                        title={asset.name}
                      >
                        {asset.name}
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {asset.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
                      Added {asset.createdAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === "hashtags" ? (
        <div className="animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create New Group */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                Create New Group
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Campaign"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Hashtags
                  </label>
                  <textarea
                    placeholder="#summer #sun #fun"
                    value={newTagContent}
                    onChange={(e) => setNewTagContent(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                  />
                </div>
                <button
                  onClick={handleCreateHashtagGroup}
                  disabled={!newTagName || !newTagContent}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Group
                </button>
              </div>
            </div>

            {/* Group List */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {hashtags.map((group) => (
                <div
                  key={group.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Hash className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {group.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDeleteHashtagGroup(group.id)}
                      className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {group.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        onCompose({ content: `\n\n${group.tags.join(" ")}` })
                      }
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-2 py-1 rounded transition-colors"
                    >
                      Use in Composer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === "stock" ? (
        <div className="animate-in fade-in duration-300 relative h-full flex flex-col">
          {/* Search Header */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <SearchIcon className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Unsplash Stock Photos
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search free high-resolution photos..."
                className="flex-1 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button className="px-6 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Stock Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-10">
            {MOCK_STOCK_PHOTOS.map((url, i) => (
              <div
                key={i}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800"
              >
                <img
                  src={url}
                  alt="Stock"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() =>
                      onCompose({ mediaUrl: url, mediaType: "image" })
                    }
                    className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors"
                  >
                    Use Image
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 text-[10px] text-white/80 opacity-0 group-hover:opacity-100 font-medium drop-shadow-md">
                  Photo by Unsplash
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "buckets" ? (
        <div className="animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-full flex justify-end mb-4">
              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                New Bucket
              </button>
            </div>

            {MOCK_BUCKETS.map((bucket) => (
              <div
                key={bucket.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl ${bucket.color} flex items-center justify-center text-white shadow-lg`}
                  >
                    <Archive className="w-6 h-6" />
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {bucket.name}
                </h3>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-6">
                  <Repeat className="w-4 h-4 mr-2" />
                  {bucket.schedule}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleAutoSchedule(bucket)}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors border border-indigo-100 dark:border-indigo-800"
                  >
                    <CalendarCheck className="w-4 h-4 mr-2" />
                    Auto-Fill Calendar
                  </button>
                  <button
                    onClick={() => setEditingBucket(bucket)}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    Configure Rules
                  </button>
                </div>
              </div>
            ))}

            {/* Create New Placeholder */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer min-h-[240px]">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-600 dark:text-slate-400 mb-1">
                Create New Bucket
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Organize evergreen content for auto-posting
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          {/* RSS Input */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Add Content Source
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={rssUrl}
                onChange={(e) => setRssUrl(e.target.value)}
                placeholder="Enter RSS Feed URL (e.g. https://techcrunch.com/feed)"
                className="flex-1 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Feed
              </button>
            </div>
          </div>

          {/* Articles List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {MOCK_RSS.map((article) => (
              <div
                key={article.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow"
              >
                <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      {article.source}
                    </span>
                    <span className="text-xs text-slate-400">
                      {article.publishedAt}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3 flex-1">
                    {article.snippet}
                  </p>
                  <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleUseArticle(article)}
                      disabled={generatingRssId === article.id}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-75"
                    >
                      {generatingRssId === article.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4 mr-2" />
                      )}
                      {generatingRssId === article.id
                        ? "Generating..."
                        : "Create AI Post"}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
