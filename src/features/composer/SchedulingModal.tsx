import React, { useState } from "react";
import { X, CalendarClock, Sparkles, Repeat } from "lucide-react";
import { TIMEZONES } from "@/utils/constants";

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: string, time: string, timezone: string) => void;
}

export const SchedulingModal: React.FC<SchedulingModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
}) => {
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleTimezone, setScheduleTimezone] = useState("UTC");
  const [repeatInterval, setRepeatInterval] = useState("never");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!scheduleDate || !scheduleTime) return;
    onSchedule(scheduleDate, scheduleTime, scheduleTimezone);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center">
            <CalendarClock className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Schedule Post
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={scheduleDate}
              className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Time
              </label>
              <input
                type="time"
                value={scheduleTime}
                className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Timezone
              </label>
              <select
                value={scheduleTimezone}
                onChange={(e) => setScheduleTimezone(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Recurring
            </label>
            <div className="flex gap-2">
              <select
                value={repeatInterval}
                onChange={(e) => setRepeatInterval(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="never">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <div className="flex items-center justify-center w-10 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                <Repeat className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div className="text-sm text-indigo-900 dark:text-indigo-200">
              <p className="font-semibold">AI Suggestion</p>
              <p className="text-indigo-700/80 dark:text-indigo-300/70">
                Best time to post for your audience is tomorrow at 10:30 AM.
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!scheduleDate || !scheduleTime}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulingModal;
