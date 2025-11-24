import React, { useState, useRef, useCallback } from "react";
import {
  Image as ImageIcon,
  Video,
  ListChecks,
  Hash,
  BarChart2,
  UploadCloud,
  Sparkles,
  Loader2,
} from "lucide-react";
import { generateHashtags } from "@/services/geminiService";
import { ToastType, HashtagGroup } from "@/types";
import { MOCK_HASHTAG_GROUPS } from "@/utils/constants";

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
  onMediaUpload: (url: string, type: "image" | "video") => void;
  isPollActive: boolean;
  onTogglePoll: () => void;
  onAnalyze?: () => void;
  onRefine?: (instruction: string) => void;
  showToast: (message: string, type: ToastType) => void;
  isGenerating?: boolean;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  content,
  onChange,
  onMediaUpload,
  isPollActive,
  onTogglePoll,
  onAnalyze,
  onRefine,
  showToast,
  isGenerating = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHashtagOpen, setIsHashtagOpen] = useState(false);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      const fileType = file.type.split("/")[0];

      if (fileType !== "image" && fileType !== "video") {
        showToast("Please upload an image or video file.", "error");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      onMediaUpload(objectUrl, fileType as "image" | "video");

      showToast(
        `${fileType === "image" ? "Image" : "Video"} uploaded successfully!`,
        "success"
      );
    },
    [onMediaUpload, showToast]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

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

  const handleAiHashtags = async () => {
    if (!content) return;
    setIsGeneratingHashtags(true);
    setIsHashtagOpen(false);
    const tags = await generateHashtags(content);
    onChange(content + "\n\n" + tags.join(" "));
    setIsGeneratingHashtags(false);
    showToast("AI Hashtags added!", "success");
  };

  const handleInsertHashtagGroup = (group: HashtagGroup) => {
    onChange(content + "\n\n" + group.tags.join(" "));
    setIsHashtagOpen(false);
    showToast(`Inserted "${group.name}" tags`, "success");
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl border shadow-sm flex flex-col min-h-[300px] relative group transition-colors duration-200 ${
        isDragging
          ? "border-indigo-500 border-2 bg-indigo-50/50 dark:bg-indigo-900/20"
          : "border-slate-200 dark:border-slate-800"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileSelect}
      />

      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl animate-in fade-in">
          <UploadCloud className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mb-4" />
          <p className="text-xl font-bold text-slate-800 dark:text-white">
            Drop to upload
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Images or Videos supported
          </p>
        </div>
      )}

      <textarea
        className="flex-1 w-full p-6 resize-none outline-none text-base text-slate-800 dark:text-slate-200 bg-transparent leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-600 relative z-10"
        placeholder="Write your masterpiece here... (or drag and drop media)"
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />

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
          <button
            onClick={onTogglePoll}
            className={`p-2 rounded-lg transition-colors relative shrink-0 ${isPollActive ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
            title="Create Poll"
          >
            <ListChecks className="w-4 h-4" />
          </button>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 shrink-0"></div>
          {onRefine && (
            <>
              <button
                onClick={() => onRefine("Make it shorter")}
                disabled={!content || isGenerating}
                className="px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-800 shrink-0 disabled:opacity-50"
              >
                Shorten
              </button>
              <button
                onClick={() => onRefine("Make it more engaging")}
                disabled={!content || isGenerating}
                className="px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-800 shrink-0 disabled:opacity-50"
              >
                Rewrite
              </button>
            </>
          )}
          {onAnalyze && (
            <button
              onClick={onAnalyze}
              disabled={!content || isGenerating}
              className="px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-800 shrink-0 flex items-center disabled:opacity-50"
            >
              <BarChart2 className="w-3 h-3 mr-1" /> Analyze
            </button>
          )}

          {/* Hashtag Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsHashtagOpen(!isHashtagOpen)}
              disabled={!content && isGenerating}
              className="px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-800 shrink-0 flex items-center disabled:opacity-50"
            >
              {isGeneratingHashtags ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Hash className="w-3 h-3 mr-1" />
              )}{" "}
              Hashtags
            </button>
            {isHashtagOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 z-50">
                <button
                  onClick={handleAiHashtags}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center border-b border-slate-100 dark:border-slate-800"
                >
                  <Sparkles className="w-3 h-3 mr-2 text-indigo-500" /> Generate
                  AI Tags
                </button>
                <div className="py-1">
                  <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase">
                    Saved Groups
                  </div>
                  {MOCK_HASHTAG_GROUPS.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => handleInsertHashtagGroup(group)}
                      className="w-full text-left px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 truncate"
                    >
                      {group.name}
                    </button>
                  ))}
                  {MOCK_HASHTAG_GROUPS.length === 0 && (
                    <div className="px-4 py-2 text-xs text-slate-400 italic">
                      No saved groups
                    </div>
                  )}
                </div>
              </div>
            )}
            {isHashtagOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsHashtagOpen(false)}
              ></div>
            )}
          </div>
        </div>
        <div
          className={`text-xs font-semibold px-2 py-1 rounded shrink-0 ${content.length > 280 ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "text-slate-400 dark:text-slate-500"}`}
        >
          {content.length} chars
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
