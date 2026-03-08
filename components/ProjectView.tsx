"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  MessageSquare, 
  CheckSquare, 
  FileText, 
  Calendar 
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { MessageBoardView } from "./views/MessageBoardView";
import { TodosView } from "./views/TodosView";
import { DocsView } from "./views/DocsView";
import { TimelineView } from "./views/TimelineView";

export function ProjectView({ projectId, onBack }: { projectId: number, onBack: () => void }) {
  const { projects } = useAppContext();
  const project = projects.find(p => p.id === projectId);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  if (!project) return null;

  const tools = [
    {
      id: "message_board",
      name: "Message Board",
      icon: <MessageSquare />,
      desc: "Post announcements, pitch ideas, and keep updates in one place.",
    },
    {
      id: "todos",
      name: "To-dos",
      icon: <CheckSquare />,
      desc: "Make lists of work that needs to get done, assign items, set due dates.",
    },
    {
      id: "docs",
      name: "Docs & Files",
      icon: <FileText />,
      desc: "Share images, PDFs, spreadsheets, and organize them in folders.",
    },
    {
      id: "timeline",
      name: "Timeline",
      icon: <Calendar />,
      desc: "Set important dates on a shared timeline.",
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl mx-auto"
    >
      <div className="mb-8">
        <button 
          onClick={() => activeTool ? setActiveTool(null) : onBack()}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-6 group"
        >
          <div className="p-1.5 rounded-full bg-zinc-900 group-hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">
            {activeTool ? "Back to Project" : "Back to Home"}
          </span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl ${project.color} flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-xl">{project.name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight">{project.name}</h1>
            {activeTool && (
              <p className="text-zinc-500 mt-1 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                {tools.find(t => t.id === activeTool)?.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {activeTool === "message_board" ? (
        <MessageBoardView projectId={project.id} />
      ) : activeTool === "todos" ? (
        <TodosView projectId={project.id} />
      ) : activeTool === "docs" ? (
        <DocsView projectId={project.id} />
      ) : activeTool === "timeline" ? (
        <TimelineView projectId={project.id} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveTool(tool.id)}
              className="group bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 rounded-3xl p-6 sm:p-8 cursor-pointer transition-all hover:shadow-xl hover:shadow-black/20"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 text-zinc-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 flex items-center justify-center mb-6 transition-colors">
                {tool.icon}
              </div>
              <h3 className="text-xl font-medium text-zinc-100 mb-2 group-hover:text-indigo-400 transition-colors">{tool.name}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{tool.desc}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
