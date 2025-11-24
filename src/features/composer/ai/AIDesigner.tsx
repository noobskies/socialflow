import React, { useState } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { generateSocialImage } from "@/services/geminiService";
import { ToastType } from "@/types";

interface AIDesignerProps {
  onImageGenerated: (url: string) => void;
  showToast: (message: string, type: ToastType) => void;
}

export const AIDesigner: React.FC<AIDesignerProps> = ({
  onImageGenerated,
  showToast,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");

  const handleImageGenerate = async () => {
    if (!imagePrompt) return;

    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      try {
        await window.aistudio.openSelectKey();
        if (!(await window.aistudio.hasSelectedApiKey())) {
          showToast("API Key required for Image Generation.", "error");
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
        onImageGenerated(imgData);
        showToast("Image generated successfully!", "success");
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to generate image.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Image Prompt
        </label>
        <textarea
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm min-h-[80px] resize-none"
        />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Powered by Gemini 3 Pro Image (Paid Key Required)
        </p>
        <button
          onClick={handleImageGenerate}
          disabled={isGenerating || !imagePrompt}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md shadow-purple-200 dark:shadow-none transition-all active:scale-95"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ImageIcon className="w-4 h-4 mr-2" />
          )}
          Generate Image
        </button>
      </div>
    </div>
  );
};

export default AIDesigner;
