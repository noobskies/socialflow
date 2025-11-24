import React, { useState } from "react";
import { CalendarClock, ShoppingBag } from "lucide-react";
import { PlatformSelector } from "./components/PlatformSelector";
import { PlatformOptions } from "./components/PlatformOptions";
import { ContentEditor } from "./components/ContentEditor";
import { MediaPreview } from "./components/MediaPreview";
import { PollCreator } from "./components/PollCreator";
import { AIPanel } from "./ai/AIPanel";
import { SchedulingModal } from "./modals/SchedulingModal";
import { ProductPickerModal } from "./modals/ProductPickerModal";
import { AnalysisModal } from "./modals/AnalysisModal";
import { PreviewPanel } from "./components/PreviewPanel";
import { useComposer } from "./useComposer";
import { useModal } from "@/hooks/useModal";
import {
  Draft,
  Post,
  ToastType,
  PlanTier,
  Product,
  DraftAnalysis,
} from "@/types";
import {
  refineContent,
  analyzeDraft,
  generateProductPost,
} from "@/services/geminiService";

interface ComposerProps {
  initialDraft?: Draft;
  showToast: (message: string, type: ToastType) => void;
  onPostCreated?: (post: Post) => void;
  userPlan?: PlanTier;
}

export const Composer: React.FC<ComposerProps> = ({
  initialDraft,
  showToast,
  onPostCreated,
  userPlan = "free",
}) => {
  const composer = useComposer(initialDraft);
  const schedulingModal = useModal();
  const productModal = useModal();
  const analysisModal = useModal();

  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DraftAnalysis | null>(
    null
  );

  const isAgency = userPlan === "agency";

  const handleRefine = async (instruction: string) => {
    if (!composer.content) return;
    setIsGenerating(true);
    const refined = await refineContent(composer.content, instruction);
    composer.setContent(refined);
    setIsGenerating(false);
    showToast("Content refined!", "success");
  };

  const handleAnalyze = async () => {
    if (!composer.content) return;
    setIsGenerating(true);
    const platform = composer.selectedPlatforms[0] || "linkedin";
    const result = await analyzeDraft(composer.content, platform);
    setAnalysisResult(result);
    setIsGenerating(false);
    analysisModal.openModal();
  };

  const handleProductSelect = async (product: Product) => {
    setIsGenerating(true);
    composer.handleMediaUpload(product.image, "image");
    composer.setAltText(`Product image of ${product.name}`);

    const platform = composer.selectedPlatforms[0] || "instagram";
    const text = await generateProductPost(
      product.name,
      product.description,
      product.price,
      platform,
      "persuasive"
    );
    composer.setContent(text);

    if (platform === "pinterest") {
      composer.setPlatformOptions({
        ...composer.platformOptions,
        pinterest: {
          ...composer.platformOptions.pinterest,
          destinationLink: `https://myshop.com/products/${product.id}`,
        },
      });
    }

    setIsGenerating(false);
    showToast("Product post generated!", "success");
  };

  const handleSchedule = (date: string, time: string, timezone: string) => {
    if (!composer.content.trim()) {
      showToast("Please add content before scheduling", "error");
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      content: composer.content,
      platforms: composer.selectedPlatforms,
      scheduledDate: date,
      status: "scheduled",
      time,
      timezone,
      mediaUrl: composer.mediaUrl || undefined,
      mediaType: composer.mediaType || undefined,
      platformOptions: composer.platformOptions,
      poll: composer.isPollActive
        ? {
            options: composer.pollOptions.filter((o) => o.trim() !== ""),
            duration: composer.pollDuration,
          }
        : undefined,
    };

    onPostCreated?.(newPost);
    composer.clearDraft();
    showToast("Post scheduled successfully", "success");
  };

  const handleSaveDraft = () => {
    if (!composer.content) return;
    localStorage.setItem("draft_content", composer.content);
    showToast("Draft saved locally", "info");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 h-full flex flex-col overflow-hidden relative pb-24 md:pb-6 bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            New Post
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Craft perfect content for all your channels
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={productModal.openModal}
            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors hidden sm:flex items-center"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Promote Product
          </button>

          <button
            onClick={handleSaveDraft}
            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors hidden sm:block"
          >
            Save Draft
          </button>

          <button
            onClick={schedulingModal.openModal}
            disabled={!composer.content}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center shadow-lg disabled:opacity-50"
          >
            <CalendarClock className="w-4 h-4 mr-2" />
            Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto">
          <PlatformSelector
            selectedPlatforms={composer.selectedPlatforms}
            onToggle={composer.togglePlatform}
          />

          <PlatformOptions
            selectedPlatforms={composer.selectedPlatforms}
            options={composer.platformOptions}
            onChange={composer.setPlatformOptions}
          />

          <AIPanel
            content={composer.content}
            onContentChange={composer.setContent}
            selectedPlatforms={composer.selectedPlatforms}
            showToast={showToast}
            userPlan={userPlan}
            isAgency={isAgency}
          />

          <ContentEditor
            content={composer.content}
            onChange={composer.setContent}
            onMediaUpload={composer.handleMediaUpload}
            isPollActive={composer.isPollActive}
            onTogglePoll={composer.togglePoll}
            onAnalyze={handleAnalyze}
            onRefine={handleRefine}
            showToast={showToast}
            isGenerating={isGenerating}
          />

          {composer.mediaUrl && (
            <MediaPreview
              url={composer.mediaUrl}
              type={composer.mediaType!}
              altText={composer.altText}
              onRemove={composer.removeMedia}
            />
          )}

          {composer.isPollActive && (
            <PollCreator
              options={composer.pollOptions}
              setOptions={composer.setPollOptions}
              duration={composer.pollDuration}
              setDuration={composer.setPollDuration}
              onClose={composer.togglePoll}
            />
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="lg:col-span-5 hidden lg:block">
          <PreviewPanel
            content={composer.content}
            platforms={composer.selectedPlatforms}
            mediaUrl={composer.mediaUrl}
            mediaType={composer.mediaType}
            poll={
              composer.isPollActive
                ? {
                    options: composer.pollOptions,
                    duration: composer.pollDuration,
                  }
                : undefined
            }
            platformOptions={composer.platformOptions}
          />
        </div>
      </div>

      {/* Modals */}
      <SchedulingModal
        isOpen={schedulingModal.isOpen}
        onClose={schedulingModal.closeModal}
        onSchedule={handleSchedule}
      />

      <ProductPickerModal
        isOpen={productModal.isOpen}
        onClose={productModal.closeModal}
        onSelect={handleProductSelect}
      />

      <AnalysisModal
        isOpen={analysisModal.isOpen}
        onClose={analysisModal.closeModal}
        result={analysisResult}
      />
    </div>
  );
};

export default Composer;
