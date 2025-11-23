import {
  Post,
  SocialAccount,
  Product,
  HashtagGroup,
  TeamMember,
  SocialMessage,
  ListeningResult,
  Folder,
  MediaAsset,
  RSSArticle,
  Bucket,
  ShortLink,
  Lead,
  Integration,
  Workflow,
  Report,
  Workspace,
} from '@/types';

export const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    scheduledDate: '2023-10-03',
    platforms: ['twitter'],
    content: 'Launching our new feature... 🚀',
    status: 'published',
    time: '09:00',
  },
  {
    id: '2',
    scheduledDate: '2023-10-03',
    platforms: ['linkedin'],
    content: 'Company growth update: We reached 10k users!',
    status: 'published',
    time: '11:30',
  },
  {
    id: '3',
    scheduledDate: '2023-10-05',
    platforms: ['facebook'],
    content: 'Community spotlight on our super users.',
    status: 'scheduled',
    time: '14:00',
  },
  {
    id: '4',
    scheduledDate: '2023-10-08',
    platforms: ['twitter'],
    content: 'Thread: 5 ways AI is changing content creation 🧵',
    status: 'pending_review',
    time: '10:00',
  },
  {
    id: '5',
    scheduledDate: '2023-10-12',
    platforms: ['linkedin'],
    content: 'We are hiring engineers! Apply now.',
    status: 'draft',
    time: '13:00',
  },
  {
    id: '6',
    scheduledDate: '2023-10-15',
    platforms: ['twitter'],
    content: 'Customer testimonial from @SarahJ.',
    status: 'scheduled',
    time: '15:45',
  },
  {
    id: '7',
    scheduledDate: '2023-10-15',
    platforms: ['instagram'],
    content: 'Team lunch photo at the new office! 🍕',
    status: 'pending_review',
    time: '16:00',
    mediaUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
    mediaType: 'image',
  },
  {
    id: '8',
    scheduledDate: '2023-10-20',
    platforms: ['youtube'],
    content: 'New Tutorial: Getting Started with SocialFlow',
    status: 'scheduled',
    time: '12:00',
  },
  {
    id: '9',
    scheduledDate: '2023-10-22',
    platforms: ['pinterest'],
    content: 'Summer Design Inspiration Board',
    status: 'published',
    time: '17:00',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    mediaType: 'image',
  },
  {
    id: '10',
    scheduledDate: '2023-10-25',
    platforms: ['tiktok'],
    content: 'Day in the life of a Social Manager',
    status: 'draft',
    time: '09:00',
  },
  {
    id: '11',
    scheduledDate: '2023-10-27',
    platforms: ['instagram'],
    content: 'Product showcase teaser',
    status: 'scheduled',
    time: '11:00',
    mediaUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    mediaType: 'image',
  },
  {
    id: '12',
    scheduledDate: '2023-10-29',
    platforms: ['instagram'],
    content: 'Monday Motivation 💪',
    status: 'draft',
    time: '08:00',
    mediaUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
    mediaType: 'image',
  },
  {
    id: '13',
    scheduledDate: '2023-11-01',
    platforms: ['instagram'],
    content: 'November Goals setting',
    status: 'scheduled',
    time: '10:00',
    mediaUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
    mediaType: 'image',
  },
];

export const INITIAL_ACCOUNTS: SocialAccount[] = [
  { id: '1', platform: 'twitter', username: '@socialflow', avatar: '', connected: true },
  { id: '2', platform: 'linkedin', username: 'SocialFlow Inc.', avatar: '', connected: true },
  { id: '3', platform: 'facebook', username: 'SocialFlow', avatar: '', connected: false },
  { id: '4', platform: 'instagram', username: '@socialflow.ai', avatar: '', connected: true },
  { id: '5', platform: 'tiktok', username: '@socialflow_tok', avatar: '', connected: false },
  { id: '6', platform: 'youtube', username: 'SocialFlow TV', avatar: '', connected: false },
  { id: '7', platform: 'pinterest', username: 'SocialFlow Pins', avatar: '', connected: false },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Leather Bag',
    price: '$129.00',
    description: 'Handcrafted Italian leather messenger bag. Perfect for the modern professional.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    inventory: 12,
  },
  {
    id: '2',
    name: 'Wireless Noise-Cancelling Headphones',
    price: '$249.99',
    description: 'Immerse yourself in music with industry-leading noise cancellation.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    inventory: 45,
  },
  {
    id: '3',
    name: 'Organic Coffee Blend',
    price: '$18.50',
    description: 'Rich, smooth medium roast. Ethically sourced and roasted in small batches.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    inventory: 120,
  },
];

export const AI_TEMPLATES = [
  { id: 'pas', name: 'Problem-Agitate-Solve', label: 'PAS Framework' },
  { id: 'aida', name: 'Attention-Interest-Desire-Action', label: 'AIDA Framework' },
  { id: 'story', name: 'Storytelling', label: "Hero's Journey" },
  { id: 'viral', name: 'Viral Hook', label: 'Controversial/Viral' },
];

export const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

export const MOCK_HASHTAG_GROUPS: HashtagGroup[] = [
  {
    id: '1',
    name: 'Tech Startups',
    tags: ['#startup', '#tech', '#innovation', '#saas', '#growth'],
  },
  { id: '2', name: 'Summer Vibes', tags: ['#summer', '#summervibes', '#sunshine', '#fun'] },
  {
    id: '3',
    name: 'Monday Motivation',
    tags: ['#mondaymotivation', '#grind', '#success', '#goals'],
  },
];

export const MOCK_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Creator',
    email: 'alex@socialflow.ai',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop',
    status: 'active',
  },
  {
    id: '2',
    name: 'Sarah Design',
    email: 'sarah@socialflow.ai',
    role: 'editor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop',
    status: 'active',
  },
  {
    id: '3',
    name: 'Mike Analyst',
    email: 'mike@socialflow.ai',
    role: 'viewer',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&fit=crop',
    status: 'invited',
  },
];

export const MOCK_AUDIT_LOG = [
  {
    id: 1,
    action: 'Login Success',
    user: 'Alex Creator',
    ip: '192.168.1.42',
    location: 'San Francisco, US',
    date: 'Just now',
  },
  {
    id: 2,
    action: 'Updated Billing Plan',
    user: 'Alex Creator',
    ip: '192.168.1.42',
    location: 'San Francisco, US',
    date: '2 days ago',
  },
  {
    id: 3,
    action: 'Invited Team Member',
    user: 'Alex Creator',
    ip: '192.168.1.42',
    location: 'San Francisco, US',
    date: '1 week ago',
  },
  {
    id: 4,
    action: 'Connected Twitter',
    user: 'Sarah Design',
    ip: '10.0.0.15',
    location: 'New York, US',
    date: '1 week ago',
  },
];

export const MOCK_MESSAGES: SocialMessage[] = [
  {
    id: '1',
    platform: 'twitter',
    author: 'Sarah Jenkins',
    authorHandle: '@sarahj_tech',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop',
    content:
      'Just tried the new features in SocialFlow and I am blown away! The AI captions are spot on. 🚀',
    timestamp: '10m ago',
    type: 'mention',
    unread: true,
  },
  {
    id: '2',
    platform: 'linkedin',
    author: 'David Miller',
    authorHandle: 'david-miller-pm',
    authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&fit=crop',
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
    authorAvatar: 'https://images.unsplash.com/photo-1572044162444-ad6021194360?w=100&fit=crop',
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
    authorAvatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&fit=crop',
    content: 'Great video! When is the next tutorial coming out?',
    timestamp: '5h ago',
    type: 'comment',
    unread: false,
  },
];

export const MOCK_LISTENING: ListeningResult[] = [
  {
    id: 'l1',
    keyword: 'SocialFlow',
    platform: 'twitter',
    author: 'Mark Growth',
    content:
      'Comparing @Buffer vs #SocialFlow for my agency. Any thoughts? The pricing on SF looks way better.',
    sentiment: 'neutral',
    timestamp: '15m ago',
  },
  {
    id: 'l2',
    keyword: 'Social Media Tool',
    platform: 'linkedin',
    author: 'Jessica Lee',
    content:
      'Finally found a tool that actually uses AI for content gen, not just a wrapper. #SocialFlow is a game changer.',
    sentiment: 'positive',
    timestamp: '2h ago',
  },
  {
    id: 'l3',
    keyword: 'CompetitorX',
    platform: 'twitter',
    author: 'AngryUser123',
    content: 'CompetitorX is down AGAIN? I need a reliable alternative asap. Recommendations?',
    sentiment: 'negative',
    timestamp: '3h ago',
  },
];

export const MOCK_FOLDERS: Folder[] = [
  { id: 'all', name: 'All Uploads', type: 'system', icon: 'folder-open' },
  { id: 'campaign-a', name: 'Summer Campaign', type: 'user' },
  { id: 'evergreen', name: 'Evergreen', type: 'user' },
  { id: 'videos', name: 'Video Assets', type: 'user' },
];

export const MOCK_ASSETS_INIT: MediaAsset[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
    name: 'Summer Campaign Hero',
    createdAt: '2 days ago',
    tags: ['summer', 'hero'],
    folderId: 'campaign-a',
  },
  {
    id: '2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    name: 'Product Teaser v2',
    createdAt: '3 days ago',
    tags: ['product', 'teaser'],
  },
  {
    id: '3',
    type: 'template',
    content: 'Exciting news! 🚀 We are thrilled to announce [Product Name]...',
    name: 'Product Launch Template',
    createdAt: '1 week ago',
    tags: ['launch', 'announcement'],
    folderId: 'evergreen',
  },
  {
    id: '4',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80',
    name: 'Behind the Scenes',
    createdAt: '1 week ago',
    tags: ['bts', 'video'],
    folderId: 'videos',
  },
  {
    id: '5',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
    name: 'Team Offsite',
    createdAt: '2 weeks ago',
    tags: ['team', 'culture'],
  },
  {
    id: '6',
    type: 'template',
    content: 'Join us for our upcoming webinar on [Topic] this [Day]! 📅 Register here: [Link]',
    name: 'Webinar Invite',
    createdAt: '2 weeks ago',
    tags: ['webinar', 'event'],
  },
];

export const MOCK_RSS: RSSArticle[] = [
  {
    id: '1',
    title: 'The Future of AI in Marketing',
    source: 'TechCrunch',
    url: 'https://techcrunch.com',
    publishedAt: '2 hours ago',
    snippet: 'How generative AI is reshaping the landscape of digital marketing agencies...',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80',
  },
  {
    id: '2',
    title: 'Social Media Trends for 2025',
    source: 'Social Media Today',
    url: 'https://socialmediatoday.com',
    publishedAt: '4 hours ago',
    snippet: 'Video content continues to dominate as platforms shift prioritization...',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80',
  },
  {
    id: '3',
    title: '5 Tips for Better Engagement',
    source: 'The Verge',
    url: 'https://theverge.com',
    publishedAt: '1 day ago',
    snippet: 'Stop chasing algorithms and start building community with these simple steps...',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
  },
];

export const MOCK_BUCKETS: Bucket[] = [
  {
    id: '1',
    name: 'Inspirational Quotes',
    postCount: 42,
    schedule: 'Every Mon, Wed',
    color: 'bg-purple-500',
  },
  {
    id: '2',
    name: 'Blog Promotions',
    postCount: 15,
    schedule: 'Every Tuesday',
    color: 'bg-blue-500',
  },
  {
    id: '3',
    name: 'Product Highlights',
    postCount: 28,
    schedule: 'Weekends',
    color: 'bg-emerald-500',
  },
];

export const MOCK_STOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c2236034?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
];

export const MOCK_LINKS: ShortLink[] = [
  {
    id: '1',
    title: 'Summer Sale Landing Page',
    originalUrl: 'https://myshop.com/summer-sale-2024',
    shortCode: 'smr24',
    clicks: 1243,
    createdAt: '2 days ago',
    tags: ['campaign', 'sales'],
  },
  {
    id: '2',
    title: 'Latest Blog Post',
    originalUrl: 'https://blog.myshop.com/5-tips-for-summer',
    shortCode: 'tips5',
    clicks: 856,
    createdAt: '5 days ago',
    tags: ['content'],
  },
  {
    id: '3',
    title: 'Newsletter Signup',
    originalUrl: 'https://myshop.com/newsletter',
    shortCode: 'join',
    clicks: 342,
    createdAt: '2 weeks ago',
    tags: ['growth'],
  },
];

export const MOCK_LEADS: Lead[] = [
  { id: '1', email: 'sarah.j@example.com', source: 'Bio Link', capturedAt: '2 hours ago' },
  { id: '2', email: 'mike.dev@tech.co', source: 'Bio Link', capturedAt: '5 hours ago' },
  { id: '3', email: 'designer@creative.studio', source: 'Bio Link', capturedAt: '1 day ago' },
  { id: '4', email: 'hello@startup.io', source: 'Bio Link', capturedAt: '2 days ago' },
];

export const MOCK_INTEGRATIONS: Integration[] = [
  { id: '1', name: 'Shopify', category: 'ecommerce', icon: 'shopping-bag', connected: true },
  { id: '2', name: 'Slack', category: 'communication', icon: 'slack', connected: false },
  { id: '3', name: 'WordPress', category: 'content', icon: 'globe', connected: true },
  { id: '4', name: 'Mailchimp', category: 'communication', icon: 'mail', connected: false },
];

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: '1',
    name: 'Promote New Products',
    description: 'When a new product is added to Shopify, generate and schedule a post.',
    trigger: 'New Shopify Product',
    action: 'Draft Social Post',
    active: true,
    stats: { runs: 12, lastRun: '2 hours ago' },
    icon: 'shopping-bag',
  },
  {
    id: '2',
    name: 'Blog Cross-Post',
    description: 'Auto-share new WordPress posts to LinkedIn and Twitter.',
    trigger: 'New WP Post',
    action: 'Publish to Socials',
    active: true,
    stats: { runs: 45, lastRun: '1 day ago' },
    icon: 'globe',
  },
  {
    id: '3',
    name: 'Negative Sentiment Alert',
    description: 'If a comment has negative sentiment, send a Slack notification.',
    trigger: 'Negative Comment',
    action: 'Notify Team',
    active: false,
    stats: { runs: 0, lastRun: 'Never' },
    icon: 'alert-triangle',
  },
];

export const engagementData = [
  { name: 'Mon', facebook: 4000, twitter: 2400, linkedin: 2400 },
  { name: 'Tue', facebook: 3000, twitter: 1398, linkedin: 2210 },
  { name: 'Wed', facebook: 2000, twitter: 9800, linkedin: 2290 },
  { name: 'Thu', facebook: 2780, twitter: 3908, linkedin: 2000 },
  { name: 'Fri', facebook: 1890, twitter: 4800, linkedin: 2181 },
  { name: 'Sat', facebook: 2390, twitter: 3800, linkedin: 2500 },
  { name: 'Sun', facebook: 3490, twitter: 4300, linkedin: 2100 },
];

export const reachData = [
  { name: 'Week 1', value: 12000 },
  { name: 'Week 2', value: 19000 },
  { name: 'Week 3', value: 15000 },
  { name: 'Week 4', value: 28000 },
];

export const competitorData = [
  { subject: 'Followers', A: 120, B: 110, fullMark: 150 },
  { subject: 'Engagement', A: 98, B: 130, fullMark: 150 },
  { subject: 'Posts/Week', A: 86, B: 130, fullMark: 150 },
  { subject: 'Reach', A: 99, B: 100, fullMark: 150 },
  { subject: 'Growth', A: 85, B: 90, fullMark: 150 },
  { subject: 'Sentiment', A: 65, B: 85, fullMark: 150 },
];

export const MOCK_TOP_POSTS = [
  {
    id: 1,
    content: 'Excited to announce our Series B funding! 🚀 #startup #growth',
    platform: 'linkedin',
    impressions: '45.2K',
    engagement: '3.8K',
    ctr: '12.5%',
    date: 'Oct 12',
  },
  {
    id: 2,
    content: '5 ways to improve your workflow today 🧵',
    platform: 'twitter',
    impressions: '12.1K',
    engagement: '850',
    ctr: '5.2%',
    date: 'Oct 15',
  },
  {
    id: 3,
    content: 'Summer vibes at the office ☀️🍕',
    platform: 'instagram',
    impressions: '28.4K',
    engagement: '2.1K',
    ctr: '8.1%',
    date: 'Oct 10',
  },
  {
    id: 4,
    content: 'New Tutorial: Getting Started with AI',
    platform: 'youtube',
    impressions: '15.6K',
    engagement: '1.2K',
    ctr: '15.3%',
    date: 'Oct 18',
  },
];

export const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    name: 'October Performance Summary',
    dateRange: 'Oct 1 - Oct 31, 2023',
    createdAt: '2 days ago',
    status: 'ready',
    format: 'pdf',
  },
  {
    id: '2',
    name: 'Q3 Executive Review',
    dateRange: 'Jul 1 - Sep 30, 2023',
    createdAt: '1 month ago',
    status: 'ready',
    format: 'pdf',
  },
  {
    id: '3',
    name: 'Competitor Analysis: TechCorp',
    dateRange: 'Last 30 Days',
    createdAt: 'Generating...',
    status: 'generating',
    format: 'csv',
  },
];

export const AGENCY_WORKSPACES: Workspace[] = [
  { id: '1', name: 'SocialFlow Agency', role: 'owner' },
  { id: '2', name: 'Client: TechCorp', role: 'member' },
  { id: '3', name: 'Client: GreenFoods', role: 'owner' },
];

export const PERSONAL_WORKSPACE: Workspace[] = [{ id: '1', name: 'My Workspace', role: 'owner' }];
