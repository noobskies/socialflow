import React from "react";
import { SocialMessage } from "@/types";
import { MessageCard } from "./MessageCard";

interface MessageListProps {
  messages: SocialMessage[];
  selectedMessageId: string | null;
  onSelectMessage: (id: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  selectedMessageId,
  onSelectMessage,
}) => {
  return (
    <>
      {messages.map((msg) => (
        <MessageCard
          key={msg.id}
          message={msg}
          isSelected={selectedMessageId === msg.id}
          onSelect={onSelectMessage}
        />
      ))}
    </>
  );
};
