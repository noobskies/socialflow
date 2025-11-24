import React, { useState } from "react";
import {
  Wand2,
  Loader2,
  Shuffle,
  Recycle,
  Copy,
  LayoutTemplate,
} from "lucide-react";
import {
  generatePostContent,
  generateVariations,
  repurposeContent,
} from "@/services/geminiService";
import { Platform, ToastType } from "@/types";
import { AI_TEMPLATES } from "@/utils/constants";

interface AIWriterProps {
  content: string;
  onContentChange: (content: string) => void;
  selectedPlatforms: Platform[];
  showToast: (message: string, type: ToastType) => void;
}

export const AIWriter: React.FC<AIWriterProps> = ({
  content,
  onContentChange,
  selectedPlatforms,
  showToast,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMode, setAiMode] = useState<"create" | "repurpose">("create");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [postType, setPostType] = useState("general");
  const [variations, setVariations] = useState<string[]>([]);
  const [sourceText, setSourceText] = useState("");
  const [repurposedContent, setRepurposedContent] = useState<{
    twitter: string[];
    linkedin: string;
    instagram: string;
  } | null>(null);

  const handleTextGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setVariations([]);
    const platform = selectedPlatforms[0] || "twitter";
    const text = await generatePostContent(topic, platform, tone, postType);
    onContentChange(text);
    setIsGenerating(false);
    showToast("Content generated successfully!", "success");
  };

  const handleGenerateVariations = async () => {
    if (!content) return;
    setIsGenerating(true);
    const platform = selectedPlatforms[0] || "linkedin";
    const newVariations = await generateVariations(content, platform);
    setVariations(newVariations);
    setIsGenerating(false);
    showToast("Variations generated!", "success");
  };

  const handleRepurpose = async () => {
    if (!sourceText) return;
    setIsGenerating(true);
    setRepurposedContent(null);
    const result = await repurposeContent(sourceText);
    setRepurposedContent(result);
    setIsGenerating(false);
    showToast("Content repurposed for multiple platforms!", "success");
  };

  const applyRepurposed = (text: string, platform: Platform) => {
    onContentChange(text);
    showToast(`Applied ${platform} version to editor`, "info");
  };

  const handleTemplateSelect = async (templateName: string) => {
    if (!topic) {
      showToast("Please enter a topic first.", "error");
      return;
    }
    setIsGenerating(true);
    setPostType(`using the ${templateName} framework`);
    const platform = selectedPlatforms[0] || "linkedin";
    const text = await generatePostContent(
      topic,
      platform,
      tone,
      `structured as ${templateName}`
    );
    onContentChange(text);
    setIsGenerating(false);
    showToast(`${templateName} template applied!`, "success");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex gap-4 border-b border-indigo-100 dark:border-indigo-900/30 pb-2 mb-2">
        <button
          onClick={() => setAiMode("create")}
          className={`text-xs font-bold uppercase tracking-wider pb-1 ${aiMode === "create" ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
        >
          Create New
        </button>
        <button
          onClick={() => setAiMode("repurpose")}
          className={`text-xs font-bold uppercase tracking-wider pb-1 ${aiMode === "repurpose" ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
        >
          Repurpose Content
        </button>
      </div>

      {aiMode === "create" ? (
        <>
          {variations.length > 0 && (
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {variations.map((v, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group relative"
                  onClick={() => onContentChange(v)}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                    Use
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                    {v}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              What's this post about?
            </label>
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
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Tone
              </label>
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
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Type
              </label>
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

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center">
              <LayoutTemplate className="w-3 h-3 mr-1" /> Quick Templates
            </label>
            <div className="flex flex-wrap gap-2">
              {AI_TEMPLATES.map((tpl) => (
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

          <div className="flex justify-end pt-2 gap-2">
            {content && (
              <button
                onClick={handleGenerateVariations}
                disabled={isGenerating}
                className="bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center transition-colors"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Shuffle className="w-4 h-4 mr-2" />
                )}
                Variations
              </button>
            )}
            <button
              onClick={handleTextGenerate}
              disabled={isGenerating || !topic}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md shadow-indigo-200 dark:shadow-none transition-all active:scale-95 w-full sm:w-auto justify-center"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Generate Draft
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Source Content
            </label>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Paste your blog post, article, or video transcript here..."
              className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm min-h-[100px]"
            />
          </div>

          {repurposedContent ? (
            <div className="grid grid-cols-1 gap-3 mt-2">
              <div
                className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 group"
                onClick={() =>
                  applyRepurposed(
                    repurposedContent.twitter.join("\n\n"),
                    "twitter"
                  )
                }
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                    Twitter Thread
                  </span>
                  <Copy className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {repurposedContent.twitter[0]}
                </p>
              </div>
              <div
                className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 group"
                onClick={() =>
                  applyRepurposed(repurposedContent.linkedin, "linkedin")
                }
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                    LinkedIn Post
                  </span>
                  <Copy className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {repurposedContent.linkedin}
                </p>
              </div>
              <div
                className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 group"
                onClick={() =>
                  applyRepurposed(repurposedContent.instagram, "instagram")
                }
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-pink-600 dark:text-pink-400">
                    Instagram Caption
                  </span>
                  <Copy className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {repurposedContent.instagram}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleRepurpose}
                disabled={isGenerating || !sourceText}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md shadow-indigo-200 dark:shadow-none transition-all active:scale-95 w-full sm:w-auto justify-center"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Recycle className="w-4 h-4 mr-2" />
                )}
                Repurpose
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIWriter;
