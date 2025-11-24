import React from "react";
import { SocialMessage } from "@/types";
import { MessageList } from "../components/MessageList";

interface MessagesTabProps {
  messages: SocialMessage[];
  selectedMessageId: string | null;
  onSelectMessage: (id: string) => void;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
  messages,
  selectedMessageId,
  onSelectMessage,
}) => {
  return (
    <MessageList
      messages={messages}
      selectedMessageId={selectedMessageId}
      onSelectMessage={onSelectMessage}
    />
  );
};
