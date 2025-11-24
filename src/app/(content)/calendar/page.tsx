"use client";

import Calendar from "@/features/calendar/Calendar";
import { useAppContext } from "../../AppContext";

export default function CalendarPage() {
  const { posts, onCompose, onUpdatePost, onPostCreated, userPlan } =
    useAppContext();

  return (
    <Calendar
      posts={posts}
      onCompose={onCompose}
      onUpdatePost={onUpdatePost}
      onPostCreated={onPostCreated}
      userPlan={userPlan}
    />
  );
}
