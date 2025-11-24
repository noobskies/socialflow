import React from "react";
import { BioPageConfig, ToastType } from "@/types";
import { BioEditor } from "../components/BioEditor";
import { PhonePreview } from "../components/PhonePreview";

interface BioTabProps {
  config: BioPageConfig;
  onConfigChange: (updates: Partial<BioPageConfig>) => void;
  showToast: (message: string, type: ToastType) => void;
}

export const BioTab: React.FC<BioTabProps> = ({
  config,
  onConfigChange,
  showToast,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-200px)] animate-in fade-in duration-300">
      <BioEditor
        config={config}
        onConfigChange={onConfigChange}
        showToast={showToast}
      />
      <PhonePreview config={config} />
    </div>
  );
};
