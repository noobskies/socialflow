import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ENGAGEMENT_DATA = [
  { name: "Mon", facebook: 4000, twitter: 2400, linkedin: 2400 },
  { name: "Tue", facebook: 3000, twitter: 1398, linkedin: 2210 },
  { name: "Wed", facebook: 2000, twitter: 9800, linkedin: 2290 },
  { name: "Thu", facebook: 2780, twitter: 3908, linkedin: 2000 },
  { name: "Fri", facebook: 1890, twitter: 4800, linkedin: 2181 },
  { name: "Sat", facebook: 2390, twitter: 3800, linkedin: 2500 },
  { name: "Sun", facebook: 3490, twitter: 4300, linkedin: 2100 },
];

export const EngagementChart: React.FC = () => {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Engagement by Platform
        </h3>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ENGAGEMENT_DATA}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
              strokeOpacity={0.1}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
              }}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <Bar
              dataKey="facebook"
              name="Facebook"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="twitter"
              name="Twitter"
              fill="#0ea5e9"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="linkedin"
              name="LinkedIn"
              fill="#0284c7"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
