import React, { useState } from "react";
import { HashtagGroup, Draft } from "@/types";
import { HashtagCreateForm } from "../components/HashtagCreateForm";
import { HashtagGroupCard } from "../components/HashtagGroupCard";
import { MOCK_HASHTAGS } from "@/utils/constants";

interface HashtagsTabProps {
  onCompose: (draft: Draft) => void;
}

export const HashtagsTab: React.FC<HashtagsTabProps> = ({ onCompose }) => {
  const [hashtags, setHashtags] = useState<HashtagGroup[]>(MOCK_HASHTAGS);
  const [newTagName, setNewTagName] = useState("");
  const [newTagContent, setNewTagContent] = useState("");

  const handleCreate = () => {
    if (!newTagName || !newTagContent) return;
    const tags = newTagContent.split(" ").filter((t) => t.startsWith("#"));
    if (tags.length === 0) return;

    const newGroup: HashtagGroup = {
      id: Date.now().toString(),
      name: newTagName,
      tags,
    };
    setHashtags([newGroup, ...hashtags]);
    setNewTagName("");
    setNewTagContent("");
  };

  const handleUse = (group: HashtagGroup) => {
    onCompose({ content: `\n\n${group.tags.join(" ")}` });
  };

  const handleDelete = (id: string) => {
    setHashtags(hashtags.filter((h) => h.id !== id));
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HashtagCreateForm
          name={newTagName}
          onNameChange={setNewTagName}
          content={newTagContent}
          onContentChange={setNewTagContent}
          onSubmit={handleCreate}
        />

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {hashtags.map((group) => (
            <HashtagGroupCard
              key={group.id}
              group={group}
              onUse={handleUse}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
