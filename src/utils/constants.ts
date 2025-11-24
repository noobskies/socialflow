import {
  Post,
  SocialAccount,
  Product,
  HashtagGroup,
  TeamMember,
  Folder,
  MediaAsset,
  RSSArticle,
  Bucket,
  ShortLink,
  BioPageConfig,
  Lead,
} from "@/types";

export const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    scheduledDate: "2023-10-03",
    platforms: ["twitter"],
    content: "Launching our new feature... 🚀",
    status: "published",
    time: "09:00",
  },
  {
    id: "2",
    scheduledDate: "2023-10-03",
    platforms: ["linkedin"],
    content: "Company growth update: We reached 10k users!",
    status: "published",
    time: "11:30",
  },
  {
    id: "3",
    scheduledDate: "2023-10-05",
    platforms: ["facebook"],
    content: "Community spotlight on our super users.",
    status: "scheduled",
    time: "14:00",
  },
  {
    id: "4",
    scheduledDate: "2023-10-08",
    platforms: ["twitter"],
    content: "Thread: 5 ways AI is changing content creation 🧵",
    status: "pending_review",
    time: "10:00",
  },
  {
    id: "5",
    scheduledDate: "2023-10-12",
    platforms: ["linkedin"],
    content: "We are hiring engineers! Apply now.",
    status: "draft",
    time: "13:00",
  },
  {
    id: "6",
    scheduledDate: "2023-10-15",
    platforms: ["twitter"],
    content: "Customer testimonial from @SarahJ.",
    status: "scheduled",
    time: "15:45",
  },
  {
    id: "7",
    scheduledDate: "2023-10-15",
    platforms: ["instagram"],
    content: "Team lunch photo at the new office! 🍕",
    status: "pending_review",
    time: "16:00",
    mediaUrl:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
    mediaType: "image",
  },
  {
    id: "8",
    scheduledDate: "2023-10-20",
    platforms: ["youtube"],
    content: "New Tutorial: Getting Started with SocialFlow",
    status: "scheduled",
    time: "12:00",
  },
  {
    id: "9",
    scheduledDate: "2023-10-22",
    platforms: ["pinterest"],
    content: "Summer Design Inspiration Board",
    status: "published",
    time: "17:00",
    mediaUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    mediaType: "image",
  },
  {
    id: "10",
    scheduledDate: "2023-10-25",
    platforms: ["tiktok"],
    content: "Day in the life of a Social Manager",
    status: "draft",
    time: "09:00",
  },
  {
    id: "11",
    scheduledDate: "2023-10-27",
    platforms: ["instagram"],
    content: "Product showcase teaser",
    status: "scheduled",
    time: "11:00",
    mediaUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    mediaType: "image",
  },
  {
    id: "12",
    scheduledDate: "2023-10-29",
    platforms: ["instagram"],
    content: "Monday Motivation 💪",
    status: "draft",
    time: "08:00",
    mediaUrl:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
    mediaType: "image",
  },
  {
    id: "13",
    scheduledDate: "2023-11-01",
    platforms: ["instagram"],
    content: "November Goals setting",
    status: "scheduled",
    time: "10:00",
    mediaUrl:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
    mediaType: "image",
  },
];

export const INITIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: "1",
    platform: "twitter",
    username: "@socialflow",
    avatar: "",
    connected: true,
  },
  {
    id: "2",
    platform: "linkedin",
    username: "SocialFlow Inc.",
    avatar: "",
    connected: true,
  },
  {
    id: "3",
    platform: "facebook",
    username: "SocialFlow",
    avatar: "",
    connected: false,
  },
  {
    id: "4",
    platform: "instagram",
    username: "@socialflow.ai",
    avatar: "",
    connected: true,
  },
  {
    id: "5",
    platform: "tiktok",
    username: "@socialflow_tok",
    avatar: "",
    connected: false,
  },
  {
    id: "6",
    platform: "youtube",
    username: "SocialFlow TV",
    avatar: "",
    connected: false,
  },
  {
    id: "7",
    platform: "pinterest",
    username: "SocialFlow Pins",
    avatar: "",
    connected: false,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Leather Bag",
    price: "$129.00",
    description:
      "Handcrafted Italian leather messenger bag. Perfect for the modern professional.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    inventory: 12,
  },
  {
    id: "2",
    name: "Wireless Noise-Cancelling Headphones",
    price: "$249.99",
    description:
      "Immerse yourself in music with industry-leading noise cancellation.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    inventory: 45,
  },
  {
    id: "3",
    name: "Organic Coffee Blend",
    price: "$18.50",
    description:
      "Rich, smooth medium roast. Ethically sourced and roasted in small batches.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    inventory: 120,
  },
];

export const AI_TEMPLATES = [
  { id: "pas", name: "Problem-Agitate-Solve", label: "PAS Framework" },
  {
    id: "aida",
    name: "Attention-Interest-Desire-Action",
    label: "AIDA Framework",
  },
  { id: "story", name: "Storytelling", label: "Hero's Journey" },
  { id: "viral", name: "Viral Hook", label: "Controversial/Viral" },
];

export const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "New York (EST)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
];

export const MOCK_HASHTAG_GROUPS: HashtagGroup[] = [
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

export const MOCK_TEAM: TeamMember[] = [
  {
    id: "1",
    name: "Alex Creator",
    email: "alex@socialflow.ai",
    role: "admin",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop",
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Design",
    email: "sarah@socialflow.ai",
    role: "editor",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop",
    status: "active",
  },
  {
    id: "3",
    name: "Mike Analyst",
    email: "mike@socialflow.ai",
    role: "viewer",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&fit=crop",
    status: "invited",
  },
];

export const MOCK_AUDIT_LOG = [
  {
    id: 1,
    action: "Login Success",
    user: "Alex Creator",
    ip: "192.168.1.42",
    location: "San Francisco, US",
    date: "Just now",
  },
  {
    id: 2,
    action: "Updated Billing Plan",
    user: "Alex Creator",
    ip: "192.168.1.42",
    location: "San Francisco, US",
    date: "2 days ago",
  },
  {
    id: 3,
    action: "Invited Team Member",
    user: "Alex Creator",
    ip: "192.168.1.42",
    location: "San Francisco, US",
    date: "1 week ago",
  },
  {
    id: 4,
    action: "Connected Twitter",
    user: "Sarah Design",
    ip: "10.0.0.15",
    location: "New York, US",
    date: "1 week ago",
  },
];

export const MOCK_MESSAGES = [
  {
    id: "1",
    platform: "twitter" as const,
    author: "Sarah Jenkins",
    authorHandle: "@sarahj_tech",
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop",
    content:
      "Just tried the new features in SocialFlow and I am blown away! The AI captions are spot on. 🚀",
    timestamp: "10m ago",
    type: "mention" as const,
    unread: true,
  },
  {
    id: "2",
    platform: "linkedin" as const,
    author: "David Miller",
    authorHandle: "david-miller-pm",
    authorAvatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&fit=crop",
    content:
      "Can we schedule carousel posts for LinkedIn yet? Looking to move our agency over.",
    timestamp: "45m ago",
    type: "comment" as const,
    unread: true,
  },
  {
    id: "3",
    platform: "instagram" as const,
    author: "Creative Studio",
    authorHandle: "@creativestudio.io",
    authorAvatar:
      "https://images.unsplash.com/photo-1572044162444-ad6021194360?w=100&fit=crop",
    content:
      "Love the aesthetic of your recent posts! What tool are you using for templates?",
    timestamp: "2h ago",
    type: "dm" as const,
    unread: false,
  },
  {
    id: "4",
    platform: "youtube" as const,
    author: "Tech Reviews",
    authorHandle: "TechReviewsChannel",
    authorAvatar:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&fit=crop",
    content: "Great video! When is the next tutorial coming out?",
    timestamp: "5h ago",
    type: "comment" as const,
    unread: false,
  },
];

export const MOCK_LISTENING = [
  {
    id: "l1",
    keyword: "SocialFlow",
    platform: "twitter" as const,
    author: "Mark Growth",
    content:
      "Comparing @Buffer vs #SocialFlow for my agency. Any thoughts? The pricing on SF looks way better.",
    sentiment: "neutral" as const,
    timestamp: "15m ago",
  },
  {
    id: "l2",
    keyword: "Social Media Tool",
    platform: "linkedin" as const,
    author: "Jessica Lee",
    content:
      "Finally found a tool that actually uses AI for content gen, not just a wrapper. #SocialFlow is a game changer.",
    sentiment: "positive" as const,
    timestamp: "2h ago",
  },
  {
    id: "l3",
    keyword: "CompetitorX",
    platform: "twitter" as const,
    author: "AngryUser123",
    content:
      "CompetitorX is down AGAIN? I need a reliable alternative asap. Recommendations?",
    sentiment: "negative" as const,
    timestamp: "3h ago",
  },
];

export const MOCK_FOLDERS: Folder[] = [
  { id: "all", name: "All Uploads", type: "system", icon: "folder-open" },
  { id: "campaign-a", name: "Summer Campaign", type: "user" },
  { id: "evergreen", name: "Evergreen", type: "user" },
  { id: "videos", name: "Video Assets", type: "user" },
];

export const MOCK_ASSETS_INIT: MediaAsset[] = [
  {
    id: "1",
    type: "image",
    url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800",
    name: "Gradient Background",
    createdAt: "2 days ago",
    tags: ["background", "gradient", "abstract"],
    folderId: "campaign-a",
  },
  {
    id: "2",
    type: "video",
    url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
    name: "Product Demo",
    createdAt: "1 week ago",
    tags: ["product", "demo"],
    folderId: "videos",
  },
  {
    id: "3",
    type: "template",
    content:
      "🚀 Exciting news! We're launching [PRODUCT] next week. Early bird pricing available for the first 100 customers. Join the waitlist: [LINK]",
    name: "Product Launch Template",
    createdAt: "3 days ago",
    tags: ["launch", "announcement"],
    folderId: "evergreen",
  },
  {
    id: "4",
    type: "image",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    name: "Beach Sunset",
    createdAt: "1 day ago",
    tags: ["summer", "beach", "sunset"],
    folderId: "campaign-a",
  },
  {
    id: "5",
    type: "template",
    content:
      "💡 Monday Motivation: [QUOTE]\n\nTag someone who needs to see this! 👇",
    name: "Monday Motivation",
    createdAt: "5 days ago",
    tags: ["motivation", "monday"],
    folderId: "evergreen",
  },
];

export const MOCK_RSS: RSSArticle[] = [
  {
    id: "1",
    title: "The Future of AI in Content Creation",
    snippet:
      "Artificial intelligence is revolutionizing how we create and distribute content across social media platforms...",
    source: "TechCrunch",
    url: "https://techcrunch.com/ai-content",
    publishedAt: "2 hours ago",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
  },
  {
    id: "2",
    title: "Social Media Trends for 2024",
    snippet:
      "Short-form video continues to dominate, but authentic storytelling is making a comeback...",
    source: "Social Media Today",
    url: "https://socialmediatoday.com/trends-2024",
    publishedAt: "5 hours ago",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
  },
  {
    id: "3",
    title: "Instagram Algorithm Update Explained",
    snippet:
      "Meta announces major changes to how content is ranked and displayed in user feeds...",
    source: "Buffer Blog",
    url: "https://buffer.com/instagram-algorithm",
    publishedAt: "1 day ago",
    imageUrl:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800",
  },
];

export const MOCK_BUCKETS: Bucket[] = [
  {
    id: "1",
    name: "Tips & Tricks",
    description: "Evergreen educational content",
    postCount: 24,
    icon: "💡",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    schedule: "Mon/Wed/Fri at 9:00 AM",
  },
  {
    id: "2",
    name: "Behind the Scenes",
    description: "Team culture and office life",
    postCount: 12,
    icon: "📸",
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    schedule: "Thursdays at 2:30 PM",
  },
  {
    id: "3",
    name: "Customer Stories",
    description: "User testimonials and case studies",
    postCount: 8,
    icon: "⭐",
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    schedule: "Tuesdays at 11:00 AM",
  },
];

export const MOCK_HASHTAGS = MOCK_HASHTAG_GROUPS;

export const MOCK_STOCK_PHOTOS: string[] = [
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=400",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400",
  "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400",
  "https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=400",
  "https://images.unsplash.com/photo-1557682260-96773eb01377?w=400",
  "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=400",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400",
  "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=400",
  "https://images.unsplash.com/photo-1550684403-7c3e6d3a3e3c?w=400",
  "https://images.unsplash.com/photo-1550682848-6b4e8b6d8b1b?w=400",
  "https://images.unsplash.com/photo-1550681560-af9bc1cb339e?w=400",
  "https://images.unsplash.com/photo-1550677584-5e8f6d5f3e1f?w=400",
];

export const MOCK_LINKS: ShortLink[] = [
  {
    id: "1",
    title: "Product Launch Page",
    shortCode: "launch2024",
    originalUrl: "https://socialflow.ai/products/new-features",
    clicks: 1247,
    createdAt: "Oct 15, 2023",
    tags: ["product", "launch"],
  },
  {
    id: "2",
    title: "Blog: AI Content Tips",
    shortCode: "ai-tips",
    originalUrl: "https://socialflow.ai/blog/ai-content-creation-guide",
    clicks: 892,
    createdAt: "Oct 10, 2023",
    tags: ["blog", "ai"],
  },
  {
    id: "3",
    title: "Free Trial Signup",
    shortCode: "freetrial",
    originalUrl: "https://socialflow.ai/signup?ref=social",
    clicks: 2156,
    createdAt: "Oct 5, 2023",
    tags: ["conversion", "trial"],
  },
  {
    id: "4",
    title: "Webinar Registration",
    shortCode: "webinar-nov",
    originalUrl: "https://socialflow.ai/events/november-webinar",
    clicks: 543,
    createdAt: "Oct 1, 2023",
    tags: ["event", "webinar"],
  },
];

export const INITIAL_BIO_CONFIG: BioPageConfig = {
  username: "@alexcreator",
  displayName: "Alex Creator",
  bio: "Digital creator passionate about tech & design. 🎨✨",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop",
  theme: "colorful",
  links: [
    {
      id: "1",
      title: "Latest YouTube Video",
      url: "https://youtube.com/@alexcreator",
      active: true,
    },
    {
      id: "2",
      title: "My Portfolio",
      url: "https://alexcreator.com",
      active: true,
    },
    {
      id: "3",
      title: "Book a Consultation",
      url: "https://cal.com/alexcreator",
      active: true,
    },
    {
      id: "4",
      title: "Shop My Presets",
      url: "https://gumroad.com/alexcreator",
      active: true,
    },
  ],
  enableLeadCapture: true,
  leadCaptureText: "Join my weekly newsletter for tips!",
};

export const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    email: "sarah.tech@gmail.com",
    source: "Bio Page - Newsletter",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    email: "mike.designer@yahoo.com",
    source: "Bio Page - Newsletter",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    email: "emma.marketing@company.com",
    source: "Bio Page - Newsletter",
    timestamp: "1 day ago",
  },
  {
    id: "4",
    email: "john.dev@startup.io",
    source: "Bio Page - Newsletter",
    timestamp: "2 days ago",
  },
  {
    id: "5",
    email: "lisa.content@agency.com",
    source: "Bio Page - Newsletter",
    timestamp: "3 days ago",
  },
];
