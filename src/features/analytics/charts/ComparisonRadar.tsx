import React from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COMPETITOR_DATA = [
  { subject: "Followers", A: 120, B: 110, fullMark: 150 },
  { subject: "Engagement", A: 98, B: 130, fullMark: 150 },
  { subject: "Posts/Week", A: 86, B: 130, fullMark: 150 },
  { subject: "Reach", A: 99, B: 100, fullMark: 150 },
  { subject: "Growth", A: 85, B: 90, fullMark: 150 },
  { subject: "Sentiment", A: 65, B: 85, fullMark: 150 },
];

export const ComparisonRadar: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
        Performance Comparison
      </h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={COMPETITOR_DATA}
          >
            <PolarGrid stroke="#cbd5e1" strokeOpacity={0.2} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8" }} />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 150]}
              tick={{ fill: "#94a3b8" }}
            />
            <Radar
              name="You"
              dataKey="A"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.4}
            />
            <Radar
              name="Competitor"
              dataKey="B"
              stroke="#f43f5e"
              fill="#f43f5e"
              fillOpacity={0.4}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
