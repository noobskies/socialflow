import {
  Post,
  SocialAccount,
  Product,
  HashtagGroup,
  TeamMember,
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
