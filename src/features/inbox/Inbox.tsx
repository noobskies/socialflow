import React from "react";
import { Search, Filter } from "lucide-react";
import { ToastType } from "@/types";
import { useInbox } from "./useInbox";
import { MessagesTab } from "./tabs/MessagesTab";
import { ListeningTab } from "./tabs/ListeningTab";
import { ConversationView } from "./components/ConversationView";
import { MOCK_MESSAGES, MOCK_LISTENING } from "@/utils/constants";

interface InboxProps {
  showToast: (message: string, type: ToastType) => void;
}

export const Inbox: React.FC<InboxProps> = ({ showToast }) => {
  const inbox = useInbox();

  // Set initial selected message on mount
  React.useEffect(() => {
    if (!inbox.selectedMessageId && MOCK_MESSAGES.length > 0) {
      inbox.selectMessage(MOCK_MESSAGES[0].id);
    }
    // Intentionally only run on mount to set initial state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full flex flex-col md:flex-row bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-200">
      {/* Left Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => inbox.setActiveTab("messages")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  inbox.activeTab === "messages"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => inbox.setActiveTab("listening")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  inbox.activeTab === "listening"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Listening
              </button>
            </div>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={
                inbox.activeTab === "messages"
                  ? "Search messages..."
                  : "Search keywords..."
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {inbox.activeTab === "messages" ? (
            <MessagesTab
              messages={MOCK_MESSAGES}
              selectedMessageId={inbox.selectedMessageId}
              onSelectMessage={inbox.selectMessage}
            />
          ) : (
            <ListeningTab items={MOCK_LISTENING} />
          )}
        </div>
      </div>

      {/* Right Content: Conversation */}
      {inbox.activeTab === "messages" && inbox.selectedMessageId && (
        <ConversationView
          message={MOCK_MESSAGES.find((m) => m.id === inbox.selectedMessageId)!}
          replyText={inbox.replyText}
          onReplyChange={inbox.setReplyText}
          isGenerating={inbox.isGenerating}
          onGeneratingChange={inbox.setIsGenerating}
          onClearReply={inbox.clearReply}
          showToast={showToast}
        />
      )}
    </div>
  );
};

export default Inbox;
