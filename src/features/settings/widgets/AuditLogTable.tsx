import React from "react";
import { MOCK_AUDIT_LOG } from "@/utils/constants";

export const AuditLogTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <th className="pb-3 pl-2">Action</th>
            <th className="pb-3">User</th>
            <th className="pb-3">Location</th>
            <th className="pb-3 text-right pr-2">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {MOCK_AUDIT_LOG.map((log) => (
            <tr
              key={log.id}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <td className="py-3 pl-2 text-sm font-medium text-slate-900 dark:text-white">
                {log.action}
              </td>
              <td className="py-3 text-sm text-slate-600 dark:text-slate-300">
                {log.user}
              </td>
              <td className="py-3 text-xs text-slate-500 dark:text-slate-400">
                {log.ip} • {log.location}
              </td>
              <td className="py-3 text-xs text-slate-500 dark:text-slate-400 text-right pr-2">
                {log.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
