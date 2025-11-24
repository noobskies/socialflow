import React from "react";
import { Users } from "lucide-react";
import { TeamMember, PlanTier } from "@/types";
import { TeamMemberRow } from "../widgets/TeamMemberRow";
import { FeatureGateOverlay } from "@/components/ui/FeatureGateOverlay";

interface TeamTabProps {
  userPlan: PlanTier;
  onOpenUpgrade: () => void;
  team: TeamMember[];
  setTeam: (team: TeamMember[]) => void;
}

export const TeamTab: React.FC<TeamTabProps> = ({
  userPlan,
  onOpenUpgrade,
  team,
  setTeam,
}) => {
  const handleUpdateRole = (memberId: string, role: TeamMember["role"]) => {
    setTeam(
      team.map((member) =>
        member.id === memberId ? { ...member, role } : member
      )
    );
  };

  const handleDelete = (memberId: string) => {
    setTeam(team.filter((member) => member.id !== memberId));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      {userPlan !== "agency" && (
        <FeatureGateOverlay
          icon={Users}
          title="Team Features Locked"
          description="Collaborate with your team, assign roles, and manage approval workflows with the Agency plan."
          onUpgrade={onOpenUpgrade}
          upgradeButtonText="Upgrade to Agency"
        />
      )}
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 ${
          userPlan !== "agency"
            ? "opacity-50 pointer-events-none select-none"
            : ""
        }`}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Team Members
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Manage access and roles for your workspace.
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
            <Users className="w-4 h-4 mr-2" />
            Invite Member
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Member</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {team.map((member) => (
                <TeamMemberRow
                  key={member.id}
                  member={member}
                  onUpdateRole={handleUpdateRole}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
