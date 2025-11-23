import React from "react";
import {
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  MessageSquare,
} from "lucide-react";
import { Notification } from "../types";

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "mention",
    title: "New Mention",
    message: 'Sarah mentioned you in "Summer Campaign"',
    timestamp: "10m ago",
    read: false,
  },
  {
    id: "2",
    type: "success",
    title: "Post Published",
    message: "Your post to LinkedIn was published successfully",
    timestamp: "1h ago",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "System Update",
    message: "SocialFlow AI has been updated to version 2.0",
    timestamp: "1d ago",
    read: true,
  },
  {
    id: "4",
    type: "warning",
    title: "Connection Lost",
    message: "Please reconnect your Instagram account",
    timestamp: "2d ago",
    read: true,
  },
];

const Notifications: React.FC<NotificationsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "mention":
        return <MessageSquare className="w-5 h-5 text-indigo-500" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl z-[70] border-l border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              Notifications
            </h2>
            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold px-2 py-0.5 rounded-full">
              2 New
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-70px)]">
          {MOCK_NOTIFICATIONS.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notif.read ? "bg-indigo-50/30 dark:bg-indigo-900/10" : ""}`}
            >
              <div className="flex gap-3">
                <div
                  className={`mt-1 p-2 rounded-lg h-fit ${
                    notif.type === "mention"
                      ? "bg-indigo-100 dark:bg-indigo-900/30"
                      : notif.type === "success"
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : notif.type === "warning"
                          ? "bg-amber-100 dark:bg-amber-900/30"
                          : "bg-blue-100 dark:bg-blue-900/30"
                  }`}
                >
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3
                      className={`text-sm font-semibold ${!notif.read ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}
                    >
                      {notif.title}
                    </h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  {!notif.read && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                        Mark as read
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="p-4 text-center">
            <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
