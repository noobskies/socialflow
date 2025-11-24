import React, { useState } from "react";
import { RSSArticle, Draft, ToastType } from "@/types";
import { RSSFeedInput } from "../components/RSSFeedInput";
import { ArticleCard } from "../components/ArticleCard";
import { MOCK_RSS } from "@/utils/constants";
import { generatePostFromRSS } from "@/services/geminiService";

interface RSSTabProps {
  onCompose: (draft: Draft) => void;
  showToast: (message: string, type: ToastType) => void;
}

export const RSSTab: React.FC<RSSTabProps> = ({ onCompose, showToast }) => {
  const [rssUrl, setRssUrl] = useState("");
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleAddFeed = () => {
    if (!rssUrl) return;
    showToast("Feed added successfully!", "success");
    setRssUrl("");
  };

  const handleUseArticle = async (article: RSSArticle) => {
    setGeneratingId(article.id);
    const postContent = await generatePostFromRSS(
      article.title,
      article.snippet,
      article.source
    );
    setGeneratingId(null);

    onCompose({
      content: `${postContent}\n\n${article.url}`,
      mediaUrl: article.imageUrl,
      mediaType: "image",
      platforms: ["twitter", "linkedin"],
    });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <RSSFeedInput value={rssUrl} onChange={setRssUrl} onAdd={handleAddFeed} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_RSS.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onUse={handleUseArticle}
            isGenerating={generatingId === article.id}
          />
        ))}
      </div>
    </div>
  );
};
