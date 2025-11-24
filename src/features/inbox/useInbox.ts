import { useState } from "react";

export function useInbox() {
  const [activeTab, setActiveTab] = useState<"messages" | "listening">(
    "messages"
  );
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [replyText, setReplyText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const selectMessage = (id: string) => setSelectedMessageId(id);
  const clearReply = () => setReplyText("");

  return {
    activeTab,
    setActiveTab,
    selectedMessageId,
    selectMessage,
    replyText,
    setReplyText,
    isGenerating,
    setIsGenerating,
    clearReply,
  };
}
