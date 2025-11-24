import React, { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Comment } from "@/types";

interface TeamCollaborationProps {
  comments?: Comment[];
  onAddComment?: (comment: string) => void;
  workflowStatus?: string;
  onChangeStatus?: (status: string) => void;
}

export const TeamCollaboration: React.FC<TeamCollaborationProps> = ({
  comments = [],
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim() || !onAddComment) return;
    onAddComment(newComment);
    setNewComment("");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 h-[300px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {comments.length === 0 ? (
          <div className="text-center text-slate-400 dark:text-slate-500 text-sm py-8">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No comments yet. Start the discussion!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img
                src={comment.avatar}
                className="w-8 h-8 rounded-full shrink-0"
                alt={comment.author}
              />
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {comment.author}
                  </span>
                  <span className="text-xs text-slate-400">
                    {comment.timestamp}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700 mt-1">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="relative mt-auto">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          placeholder="Add a comment..."
          className="w-full border border-slate-300 dark:border-slate-700 rounded-lg pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
        <button
          onClick={handleAddComment}
          className="absolute right-1.5 top-1.5 p-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TeamCollaboration;
