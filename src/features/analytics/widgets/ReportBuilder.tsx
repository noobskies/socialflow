import React from "react";
import { FileBarChart, Plus } from "lucide-react";

interface ReportBuilderProps {
  onCreateReport: () => void;
}

export const ReportBuilder: React.FC<ReportBuilderProps> = ({
  onCreateReport,
}) => {
  return (
    <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
      <div>
        <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
          <FileBarChart className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-2">Report Builder</h3>
        <p className="text-indigo-100 text-sm opacity-90 mb-6">
          Create professional, white-labeled reports for your clients or team in
          seconds.
        </p>
      </div>
      <button
        onClick={onCreateReport}
        className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-md flex items-center justify-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Create New Report
      </button>
    </div>
  );
};
