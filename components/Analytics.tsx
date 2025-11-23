import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  MousePointer2,
  Share2,
  MessageCircle,
  Trophy,
  Target,
  Download,
  FileText,
  Plus,
  Calendar,
  Loader2,
  FileBarChart,
  ThumbsUp,
  Eye,
  TrendingUp,
  Lock,
  Star,
  RefreshCw,
} from "lucide-react";
import { ToastType, Report, Platform, PlanTier, Draft } from "../types";

interface AnalyticsProps {
  showToast: (message: string, type: ToastType) => void;
  userPlan: PlanTier;
  onOpenUpgrade: () => void;
  onCompose?: (draft: Draft) => void;
}

const engagementData = [
  { name: "Mon", facebook: 4000, twitter: 2400, linkedin: 2400 },
  { name: "Tue", facebook: 3000, twitter: 1398, linkedin: 2210 },
  { name: "Wed", facebook: 2000, twitter: 9800, linkedin: 2290 },
  { name: "Thu", facebook: 2780, twitter: 3908, linkedin: 2000 },
  { name: "Fri", facebook: 1890, twitter: 4800, linkedin: 2181 },
  { name: "Sat", facebook: 2390, twitter: 3800, linkedin: 2500 },
  { name: "Sun", facebook: 3490, twitter: 4300, linkedin: 2100 },
];

const reachData = [
  { name: "Week 1", value: 12000 },
  { name: "Week 2", value: 19000 },
  { name: "Week 3", value: 15000 },
  { name: "Week 4", value: 28000 },
];

const competitorData = [
  { subject: "Followers", A: 120, B: 110, fullMark: 150 },
  { subject: "Engagement", A: 98, B: 130, fullMark: 150 },
  { subject: "Posts/Week", A: 86, B: 130, fullMark: 150 },
  { subject: "Reach", A: 99, B: 100, fullMark: 150 },
  { subject: "Growth", A: 85, B: 90, fullMark: 150 },
  { subject: "Sentiment", A: 65, B: 85, fullMark: 150 },
];

const MOCK_TOP_POSTS = [
  {
    id: 1,
    content: "Excited to announce our Series B funding! 🚀 #startup #growth",
    platform: "linkedin",
    impressions: "45.2K",
    engagement: "3.8K",
    ctr: "12.5%",
    date: "Oct 12",
  },
  {
    id: 2,
    content: "5 ways to improve your workflow today 🧵",
    platform: "twitter",
    impressions: "12.1K",
    engagement: "850",
    ctr: "5.2%",
    date: "Oct 15",
  },
  {
    id: 3,
    content: "Summer vibes at the office ☀️🍕",
    platform: "instagram",
    impressions: "28.4K",
    engagement: "2.1K",
    ctr: "8.1%",
    date: "Oct 10",
  },
  {
    id: 4,
    content: "New Tutorial: Getting Started with AI",
    platform: "youtube",
    impressions: "15.6K",
    engagement: "1.2K",
    ctr: "15.3%",
    date: "Oct 18",
  },
];

const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    name: "October Performance Summary",
    dateRange: "Oct 1 - Oct 31, 2023",
    createdAt: "2 days ago",
    status: "ready",
    format: "pdf",
  },
  {
    id: "2",
    name: "Q3 Executive Review",
    dateRange: "Jul 1 - Sep 30, 2023",
    createdAt: "1 month ago",
    status: "ready",
    format: "pdf",
  },
  {
    id: "3",
    name: "Competitor Analysis: TechCorp",
    dateRange: "Last 30 Days",
    createdAt: "Generating...",
    status: "generating",
    format: "csv",
  },
];

const Analytics: React.FC<AnalyticsProps> = ({
  showToast,
  userPlan,
  onOpenUpgrade,
  onCompose,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "competitors" | "reports"
  >("overview");
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);

  const handleExport = () => {
    showToast("Generating PDF report... Download will start shortly.", "info");
    setTimeout(() => {
      showToast("Report downloaded successfully", "success");
    }, 2000);
  };

  const handleRecycle = (post: any) => {
    if (onCompose) {
      onCompose({
        content: post.content,
        platforms: [post.platform],
        status: "draft",
      });
      showToast("Post content recycled to composer!", "success");
    }
  };

  const createReport = () => {
    const newReport: Report = {
      id: Date.now().toString(),
      name: "New Custom Report",
      dateRange: "Last 30 Days",
      createdAt: "Just now",
      status: "generating",
      format: "pdf",
    };
    setReports([newReport, ...reports]);
    showToast("Started generating report...", "info");

    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) => (r.id === newReport.id ? { ...r, status: "ready" } : r))
      );
      showToast("Report ready for download", "success");
    }, 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-full transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Performance metrics across all channels
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "overview" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("competitors")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${activeTab === "competitors" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              Competitors
              {userPlan === "free" && (
                <Lock className="w-3 h-3 text-slate-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "reports" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              Reports
            </button>
          </div>
        </div>
      </div>

      {activeTab === "reports" ? (
        <div className="animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
              <div>
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <FileBarChart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Report Builder</h3>
                <p className="text-indigo-100 text-sm opacity-90 mb-6">
                  Create professional, white-labeled reports for your clients or
                  team in seconds.
                </p>
              </div>
              <button
                onClick={createReport}
                className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-md flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Report
              </button>
            </div>

            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Report History
                </h3>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last 6 Months
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="pb-4 pl-2">Report Name</th>
                      <th className="pb-4">Date Range</th>
                      <th className="pb-4">Created</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {reports.map((report) => (
                      <tr
                        key={report.id}
                        className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-4 pl-2">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-slate-400 mr-3" />
                            <span className="font-medium text-slate-900 dark:text-white text-sm">
                              {report.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-slate-600 dark:text-slate-400">
                          {report.dateRange}
                        </td>
                        <td className="py-4 text-sm text-slate-500 dark:text-slate-400">
                          {report.createdAt}
                        </td>
                        <td className="py-4">
                          {report.status === "ready" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                              Ready
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400">
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />{" "}
                              Generating
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-right pr-2">
                          <button
                            disabled={report.status !== "ready"}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() =>
                              showToast(
                                `Downloading ${report.format.toUpperCase()}...`,
                                "success"
                              )
                            }
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "overview" ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Total Reach",
                value: "128.4K",
                change: "+12.5%",
                trend: "up",
                icon: Users,
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-50 dark:bg-blue-900/20",
              },
              {
                label: "Engagement",
                value: "14.2K",
                change: "+8.2%",
                trend: "up",
                icon: MousePointer2,
                color: "text-purple-600 dark:text-purple-400",
                bg: "bg-purple-50 dark:bg-purple-900/20",
              },
              {
                label: "Shares",
                value: "3.4K",
                change: "-2.1%",
                trend: "down",
                icon: Share2,
                color: "text-indigo-600 dark:text-indigo-400",
                bg: "bg-indigo-50 dark:bg-indigo-900/20",
              },
              {
                label: "Comments",
                value: "1.8K",
                change: "+5.4%",
                trend: "up",
                icon: MessageCircle,
                color: "text-emerald-600 dark:text-emerald-400",
                bg: "bg-emerald-50 dark:bg-emerald-900/20",
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <span
                      className={`flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${stat.trend === "up" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400"}`}
                    >
                      {stat.change}
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 ml-1" />
                      )}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Engagement Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Engagement by Platform
                </h3>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={engagementData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                      strokeOpacity={0.1}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        borderRadius: "8px",
                        border: "none",
                        color: "#fff",
                      }}
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    />
                    <Bar
                      dataKey="facebook"
                      name="Facebook"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      stackId="a"
                    />
                    <Bar
                      dataKey="twitter"
                      name="Twitter"
                      fill="#0ea5e9"
                      radius={[4, 4, 0, 0]}
                      stackId="a"
                    />
                    <Bar
                      dataKey="linkedin"
                      name="LinkedIn"
                      fill="#0284c7"
                      radius={[4, 4, 0, 0]}
                      stackId="a"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Growth Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                Audience Growth
              </h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={reachData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                      strokeOpacity={0.1}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        borderRadius: "8px",
                        border: "none",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Performing Posts Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Top Performing Content
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-4 pl-6">Post Content</th>
                    <th className="py-4">Platform</th>
                    <th className="py-4">Impressions</th>
                    <th className="py-4">Engagement</th>
                    <th className="py-4">CTR / ROI</th>
                    <th className="py-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {MOCK_TOP_POSTS.map((post) => (
                    <tr
                      key={post.id}
                      className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-4 pl-6 max-w-xs">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {post.content}
                          </p>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {post.date}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            post.platform === "linkedin"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                              : post.platform === "twitter"
                                ? "bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300"
                                : post.platform === "instagram"
                                  ? "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                          }`}
                        >
                          {post.platform}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center text-sm text-slate-700 dark:text-slate-300 font-medium">
                          <Eye className="w-4 h-4 mr-2 text-slate-400" />
                          {post.impressions}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center text-sm text-slate-700 dark:text-slate-300 font-medium">
                          <ThumbsUp className="w-4 h-4 mr-2 text-slate-400" />
                          {post.engagement}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {post.ctr}
                        </div>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <button
                          onClick={() => handleRecycle(post)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-xs flex items-center justify-end ml-auto"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" /> Recycle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 text-center">
              <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                View Full Analytics
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300 relative">
          {/* Feature Gating Overlay */}
          {userPlan === "free" && (
            <div className="absolute inset-0 z-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Competitor Analysis Locked
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
                Upgrade to Pro to track competitor performance, benchmark your
                growth, and spy on their best content.
              </p>
              <button
                onClick={onOpenUpgrade}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
              >
                Upgrade to Pro
              </button>
            </div>
          )}

          {/* Competitor Header */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 opacity-50 select-none pointer-events-none">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                You
              </div>
              <div className="text-slate-400 font-bold text-xl">VS</div>
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-xl">
                Comp
              </div>
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Competitive Landscape
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                You are outperforming your main competitor in{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Engagement
                </span>{" "}
                but trailing in{" "}
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  Post Volume
                </span>
                .
              </p>
            </div>
            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
              Add Competitor
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 opacity-50 select-none pointer-events-none">
            {/* Radar Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                Performance Comparison
              </h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={competitorData}
                  >
                    <PolarGrid stroke="#cbd5e1" strokeOpacity={0.2} />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#94a3b8" }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 150]}
                      tick={{ fill: "#94a3b8" }}
                    />
                    <Radar
                      name="You"
                      dataKey="A"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name="Competitor"
                      dataKey="B"
                      stroke="#f43f5e"
                      fill="#f43f5e"
                      fillOpacity={0.4}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                Head-to-Head Stats
              </h3>
              <div className="space-y-6">
                {[
                  {
                    label: "Follower Growth",
                    you: "+5.2%",
                    comp: "+3.1%",
                    win: true,
                  },
                  {
                    label: "Avg. Engagement",
                    you: "4.8%",
                    comp: "2.1%",
                    win: true,
                  },
                  {
                    label: "Posting Frequency",
                    you: "5/week",
                    comp: "12/week",
                    win: false,
                  },
                  {
                    label: "Video Content",
                    you: "15%",
                    comp: "45%",
                    win: false,
                  },
                  { label: "Response Time", you: "2h", comp: "5h", win: true },
                ].map((metric, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-300 w-1/3">
                      {metric.label}
                    </span>
                    <div className="flex-1 flex items-center justify-center gap-8">
                      <div
                        className={`font-bold ${metric.win ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}
                      >
                        {metric.you}
                      </div>
                      <div
                        className={`font-bold ${!metric.win ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}
                      >
                        {metric.comp}
                      </div>
                    </div>
                    <div className="w-8 flex justify-end">
                      {metric.win ? (
                        <Trophy className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Target className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
