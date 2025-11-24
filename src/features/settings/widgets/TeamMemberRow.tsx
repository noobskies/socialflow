import React from "react";
import { Trash2 } from "lucide-react";
import { TeamMember } from "@/types";

interface TeamMemberRowProps {
  member: TeamMember;
  onUpdateRole: (memberId: string, role: string) => void;
  onDelete: (memberId: string) => void;
}

export const TeamMemberRow: React.FC<TeamMemberRowProps> = ({
  member,
  onUpdateRole,
  onDelete,
}) => {
  return (
    <tr className="group">
      <td className="py-4 pl-2">
        <div className="flex items-center space-x-3">
          <img
            src={member.avatar}
            className="w-10 h-10 rounded-full object-cover"
            alt={member.name}
          />
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {member.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {member.email}
            </p>
          </div>
        </div>
      </td>
      <td className="py-4">
        <select
          value={member.role}
          onChange={(e) => onUpdateRole(member.id, e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg px-2 py-1 font-medium outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
      </td>
      <td className="py-4">
        {member.status === "active" ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400">
            Invited
          </span>
        )}
      </td>
      <td className="py-4 text-right pr-2">
        <button
          onClick={() => onDelete(member.id)}
          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};
