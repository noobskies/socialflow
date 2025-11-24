import React, { useState } from "react";
import { BioPageConfig, ToastType } from "@/types";
import { BioProfileSection } from "./BioProfileSection";
import { LeadCaptureToggle } from "./LeadCaptureToggle";
import { BioLinksEditor } from "./BioLinksEditor";
import { generateBio } from "@/services/geminiService";

interface BioEditorProps {
  config: BioPageConfig;
  onConfigChange: (updates: Partial<BioPageConfig>) => void;
  showToast: (message: string, type: ToastType) => void;
}

export const BioEditor: React.FC<BioEditorProps> = ({
  config,
  onConfigChange,
  showToast,
}) => {
  const [bioNiche, setBioNiche] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBio = async () => {
    if (!bioNiche) {
      showToast("Please enter your niche first", "error");
      return;
    }
    setIsGenerating(true);

    try {
      const newBio = await generateBio(
        config.displayName,
        bioNiche,
        config.theme
      );
      onConfigChange({ bio: newBio });
      showToast("Bio generated successfully!", "success");
    } catch (error) {
      console.error("Bio generation error:", error);
      showToast("Failed to generate bio. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-white">
          Profile & Links
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <BioProfileSection
          config={config}
          onConfigChange={onConfigChange}
          onGenerateBio={handleGenerateBio}
          bioNiche={bioNiche}
          onBioNicheChange={setBioNiche}
          isGenerating={isGenerating}
        />

        <hr className="border-slate-100 dark:border-slate-800" />

        <LeadCaptureToggle config={config} onConfigChange={onConfigChange} />

        <hr className="border-slate-100 dark:border-slate-800" />

        <BioLinksEditor
          links={config.links}
          onLinksChange={(links) => onConfigChange({ links })}
        />
      </div>
    </div>
  );
};
