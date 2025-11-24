import React from "react";
import { FileText, Loader2, Calendar } from "lucide-react";
import { Report, ToastType } from "@/types";

interface ReportHistoryProps {
  reports: Report[];
  showToast: (message: string, type: ToastType) => void;
}

export const ReportHistory: React.FC<ReportHistoryProps> = ({
  reports,
  showToast,
}) => {
  return (
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
  );
};
