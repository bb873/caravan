"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Plus, MessageSquare } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export function MessageBoardView({ projectId }: { projectId: number }) {
  const { messages, setMessages, user, addActivity, projects } = useAppContext();
  const projectMessages = messages.filter(m => m.projectId === projectId);
  const projectName = projects.find(p => p.id === projectId)?.name || "Unknown Project";
  
  const [isComposing, setIsComposing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handlePost = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const newMsg = {
      projectId,
      id: Date.now(),
      title: newTitle,
      content: newContent,
      author: user?.name?.split(' ')[0] || "You",
      date: "Just now",
      comments: 0
    };
    setMessages(prev => [newMsg, ...prev]);
    addActivity("posted a message", newTitle, projectName);
    setIsComposing(false);
    setNewTitle("");
    setNewContent("");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-end">
        <button 
          onClick={() => setIsComposing(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Message
        </button>
      </div>

      {isComposing && (
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
          <input
            type="text"
            autoFocus
            placeholder="Message title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-indigo-500 mb-4 font-medium"
          />
          <textarea
            placeholder="Write your message here..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={4}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-300 focus:outline-none focus:border-indigo-500 mb-4 resize-none"
          />
          <div className="flex gap-2">
            <button onClick={handlePost} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Post Message
            </button>
            <button onClick={() => setIsComposing(false)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {projectMessages.length === 0 && !isComposing ? (
        <div className="text-center py-12 text-zinc-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden">
          {projectMessages.map((msg, i) => (
            <div key={msg.id} className={`p-4 sm:p-6 flex items-start gap-4 hover:bg-zinc-800/30 transition-colors cursor-pointer ${i !== 0 ? 'border-t border-zinc-800/50' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center flex-shrink-0 text-sm font-bold text-zinc-400">
                {msg.author.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-zinc-100 hover:text-indigo-400 transition-colors">{msg.title}</h3>
                <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{msg.content}</p>
                <p className="text-xs text-zinc-500 mt-2">Posted by {msg.author} • {msg.date}</p>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-500">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">{msg.comments}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
