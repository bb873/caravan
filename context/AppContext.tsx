"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AppContextType, Project, TodoList, Activity, Message, TimelineEvent, User, DocumentFile } from "../types";

export const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("Missing AppContext");
  return ctx;
}

const PROJECTS: Project[] = [
  { id: 1, name: "Website Redesign", lastActive: "2 hours ago", color: "bg-indigo-500" },
  { id: 2, name: "Q3 Marketing Campaign", lastActive: "1 day ago", color: "bg-emerald-500" },
  { id: 3, name: "Mobile App Launch", lastActive: "3 days ago", color: "bg-amber-500" },
];

const RECENT_ACTIVITY: Activity[] = [
  { id: 1, user: "Sarah J.", action: "completed a to-do", target: "Update hero image", project: "Website Redesign", time: "10 min ago" },
  { id: 2, user: "Mike T.", action: "posted a message", target: "Weekly Sync Notes", project: "Q3 Marketing Campaign", time: "1 hour ago" },
  { id: 3, user: "You", action: "uploaded a file", target: "Q3_Budget.pdf", project: "Q3 Marketing Campaign", time: "2 hours ago" },
];

export function AppProvider({ children, user }: { children: React.ReactNode, user: User | null }) {
  const [todoLists, setTodoLists] = useState<TodoList[]>([
    {
      projectId: 1,
      id: 1, title: "Phase 1: Research", tasks: [
        { id: 101, text: "Competitor analysis", done: true, assignee: "Sarah J." },
        { id: 102, text: "User interviews", done: false, assignee: "Mike T." },
      ]
    },
    {
      projectId: 1,
      id: 2, title: "Phase 2: Design", tasks: [
        { id: 201, text: "Wireframes", done: false, assignee: "You" },
        { id: 202, text: "High-fidelity mockups", done: false, assignee: null },
        { id: 203, text: "Design system", done: false, assignee: null },
      ]
    },
    {
      projectId: 2,
      id: 3, title: "Marketing Assets", tasks: [
        { id: 301, text: "Draft launch email", done: false, assignee: "You" },
        { id: 302, text: "Approve ad spend", done: false, assignee: "You" },
      ]
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>(RECENT_ACTIVITY);

  const [messages, setMessages] = useState<Message[]>([
    { projectId: 1, id: 1, title: "Welcome to the new project!", content: "Let's get started on the redesign.", author: "Sarah J.", date: "Oct 12", comments: 3 },
    { projectId: 1, id: 2, title: "Design System Updates", content: "I've uploaded the new color palette.", author: "Mike T.", date: "Oct 14", comments: 12 },
    { projectId: 2, id: 3, title: "Weekly Sync Notes", content: "Here are the notes from our sync.", author: "You", date: "Yesterday", comments: 0 },
  ]);

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    { projectId: 1, id: 1, title: "Kickoff Meeting", date: "Oct 20, 10:00 AM", type: "meeting" },
    { projectId: 1, id: 2, title: "Phase 1 Deadline", date: "Oct 25", type: "deadline" },
    { projectId: 2, id: 3, title: "Design Review", date: "Nov 2, 2:00 PM", type: "meeting" },
  ]);

  const [documents, setDocuments] = useState<DocumentFile[]>([
    { projectId: 1, id: 1, name: "Project_Brief.pdf", type: "pdf", size: "2.4 MB", date: "Oct 10" },
    { projectId: 1, id: 2, name: "Brand_Assets.zip", type: "zip", size: "14.1 MB", date: "Oct 12" },
    { projectId: 2, id: 3, name: "Meeting_Notes_Oct15.docx", type: "doc", size: "124 KB", date: "Oct 15" },
  ]);

  const addActivity = (action: string, target: string, projectName: string) => {
    const newActivity = {
      id: Date.now() + Math.random(),
      user: user?.name?.split(' ')[0] || "You",
      action,
      target,
      project: projectName,
      time: "Just now"
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  return (
    <AppContext.Provider value={{ 
      projects: PROJECTS, 
      todoLists, setTodoLists, 
      activities, setActivities, 
      messages, setMessages,
      timelineEvents, setTimelineEvents,
      documents, setDocuments,
      user, addActivity 
    }}>
      {children}
    </AppContext.Provider>
  );
}
