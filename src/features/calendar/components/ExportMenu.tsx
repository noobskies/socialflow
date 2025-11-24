import React from "react";
import { Download, FileText, Table, UploadCloud } from "lucide-react";

interface ExportMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
  onImport: () => void;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({
  isOpen,
  onToggle,
  onExportPDF,
  onExportCSV,
  onImport,
}) => {
  return (
    <>
      {/* Import Button */}
      <button
        onClick={onImport}
        className="flex items-center px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
        title="Import CSV (date, time, content, platform)"
      >
        <UploadCloud className="w-4 h-4 mr-2" />
        Import
      </button>

      {/* Export Menu */}
      <div className="relative">
        <button
          onClick={onToggle}
          className="flex items-center px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={onToggle}></div>
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-40 animate-in fade-in zoom-in-95">
              <button
                onClick={onExportPDF}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center"
              >
                <FileText className="w-4 h-4 mr-2 text-red-500" /> Save as PDF
              </button>
              <button
                onClick={onExportCSV}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center border-t border-slate-100 dark:border-slate-800"
              >
                <Table className="w-4 h-4 mr-2 text-green-500" /> Export CSV
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
