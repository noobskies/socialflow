import React from "react";
import { Mail, Download, Users } from "lucide-react";
import { MOCK_LEADS } from "@/utils/constants";

export const LeadsTable: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-6">Email Address</th>
                <th className="py-4">Source</th>
                <th className="py-4">Captured</th>
                <th className="py-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {MOCK_LEADS.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-4 pl-6 font-medium text-slate-900 dark:text-white text-sm">
                    {lead.email}
                  </td>
                  <td className="py-4 text-sm text-slate-500 dark:text-slate-400">
                    {lead.source}
                  </td>
                  <td className="py-4 text-sm text-slate-500 dark:text-slate-400">
                    {lead.timestamp}
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      <Mail className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {MOCK_LEADS.length === 0 && (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No leads captured yet.</p>
          </div>
        )}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
          <button className="text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline flex items-center justify-center mx-auto">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};
