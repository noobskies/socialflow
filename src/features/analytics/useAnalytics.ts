import { useState } from "react";
import { Report } from "@/types";

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

export function useAnalytics() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "competitors" | "reports"
  >("overview");
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);

  const createReport = (showToast: (message: string, type: string) => void) => {
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

  return {
    activeTab,
    setActiveTab,
    reports,
    createReport,
  };
}
