import React from "react";
import { Report, ToastType } from "@/types";
import { ReportBuilder } from "../widgets/ReportBuilder";
import { ReportHistory } from "../widgets/ReportHistory";

interface ReportsTabProps {
  reports: Report[];
  onCreateReport: () => void;
  showToast: (message: string, type: ToastType) => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  reports,
  onCreateReport,
  showToast,
}) => {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ReportBuilder onCreateReport={onCreateReport} />
        <ReportHistory reports={reports} showToast={showToast} />
      </div>
    </div>
  );
};
