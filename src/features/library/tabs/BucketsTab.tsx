import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Bucket, Post } from "@/types";
import { BucketCard } from "../components/BucketCard";
import { BucketModal } from "../components/BucketModal";
import { MOCK_BUCKETS } from "@/utils/constants";

interface BucketsTabProps {
  onPostCreated?: (post: Post) => void;
}

export const BucketsTab: React.FC<BucketsTabProps> = ({ onPostCreated }) => {
  const [editingBucket, setEditingBucket] = useState<Bucket | null>(null);

  const handleAutoSchedule = (bucket: Bucket) => {
    if (!onPostCreated) return;

    // Simulate creating posts
    const mockPosts: Post[] = [
      {
        id: Date.now().toString(),
        content: `${bucket.name} Post 1`,
        scheduledDate: "2023-11-06",
        time: "09:00",
        platforms: ["twitter"],
        status: "scheduled",
      },
      {
        id: (Date.now() + 1).toString(),
        content: `${bucket.name} Post 2`,
        scheduledDate: "2023-11-08",
        time: "09:00",
        platforms: ["linkedin"],
        status: "scheduled",
      },
    ];

    mockPosts.forEach((p) => onPostCreated(p));
    alert(`Scheduled ${mockPosts.length} posts from ${bucket.name} bucket!`);
  };

  return (
    <div className="animate-in fade-in duration-300">
      {editingBucket && (
        <BucketModal
          bucket={editingBucket}
          onClose={() => setEditingBucket(null)}
          onSave={() => setEditingBucket(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-full flex justify-end mb-4">
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Bucket
          </button>
        </div>

        {MOCK_BUCKETS.map((bucket) => (
          <BucketCard
            key={bucket.id}
            bucket={bucket}
            onAutoSchedule={handleAutoSchedule}
            onConfigure={setEditingBucket}
          />
        ))}

        {/* Create New Placeholder */}
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer min-h-[240px]">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-600 dark:text-slate-400 mb-1">
            Create New Bucket
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Organize evergreen content for auto-posting
          </p>
        </div>
      </div>
    </div>
  );
};
