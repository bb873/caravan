"use client";

import React, { useState, useEffect } from "react";
import { Command } from "cmdk";
import { Search, Folder, CheckSquare, FileText, Calendar, MessageSquare } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";

export function CommandPalette({ open, setOpen, onSelectProject }: { open: boolean, setOpen: (open: boolean) => void, onSelectProject: (id: number) => void }) {
  const { projects, todoLists, documents, timelineEvents, messages } = useAppContext();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const allTasks = todoLists.flatMap(list => list.tasks.map(t => ({ ...t, listId: list.id, projectId: list.projectId })));

  return (
    <Command.Dialog 
      open={open} 
      onOpenChange={setOpen} 
      label="Global Command Menu"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center px-4 border-b border-zinc-800">
          <Search className="w-5 h-5 text-zinc-500 mr-2" />
          <Command.Input 
            value={search}
            onValueChange={setSearch}
            placeholder="Search projects, tasks, docs, and more..." 
            className="flex-1 bg-transparent py-4 text-zinc-100 placeholder:text-zinc-500 focus:outline-none text-lg"
          />
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-zinc-500">No results found.</Command.Empty>

          <Command.Group heading="Projects" className="text-xs font-medium text-zinc-500 px-2 py-1">
            {projects.map((project) => (
              <Command.Item 
                key={`project-${project.id}`} 
                onSelect={() => {
                  onSelectProject(project.id);
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg cursor-pointer text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 data-[selected=true]:bg-zinc-800 data-[selected=true]:text-zinc-100"
              >
                <Folder className="w-4 h-4 text-indigo-400" />
                <span>{project.name}</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Tasks" className="text-xs font-medium text-zinc-500 px-2 py-1 mt-2">
            {allTasks.map((task) => (
              <Command.Item 
                key={`task-${task.id}`} 
                onSelect={() => {
                  onSelectProject(task.projectId);
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg cursor-pointer text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 data-[selected=true]:bg-zinc-800 data-[selected=true]:text-zinc-100"
              >
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <div className="flex flex-col">
                  <span>{task.text}</span>
                  <span className="text-xs text-zinc-500">{projects.find(p => p.id === task.projectId)?.name}</span>
                </div>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Documents" className="text-xs font-medium text-zinc-500 px-2 py-1 mt-2">
            {documents.map((doc) => (
              <Command.Item 
                key={`doc-${doc.id}`} 
                onSelect={() => {
                  onSelectProject(doc.projectId);
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg cursor-pointer text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 data-[selected=true]:bg-zinc-800 data-[selected=true]:text-zinc-100"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <div className="flex flex-col">
                  <span>{doc.name}</span>
                  <span className="text-xs text-zinc-500">{projects.find(p => p.id === doc.projectId)?.name}</span>
                </div>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Timeline Events" className="text-xs font-medium text-zinc-500 px-2 py-1 mt-2">
            {timelineEvents.map((event) => (
              <Command.Item 
                key={`event-${event.id}`} 
                onSelect={() => {
                  onSelectProject(event.projectId);
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg cursor-pointer text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 data-[selected=true]:bg-zinc-800 data-[selected=true]:text-zinc-100"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <div className="flex flex-col">
                  <span>{event.title}</span>
                  <span className="text-xs text-zinc-500">{event.date} • {projects.find(p => p.id === event.projectId)?.name}</span>
                </div>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Messages" className="text-xs font-medium text-zinc-500 px-2 py-1 mt-2">
            {messages.map((msg) => (
              <Command.Item 
                key={`msg-${msg.id}`} 
                onSelect={() => {
                  onSelectProject(msg.projectId);
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg cursor-pointer text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 data-[selected=true]:bg-zinc-800 data-[selected=true]:text-zinc-100"
              >
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <div className="flex flex-col">
                  <span>{msg.title}</span>
                  <span className="text-xs text-zinc-500">by {msg.author} • {projects.find(p => p.id === msg.projectId)?.name}</span>
                </div>
              </Command.Item>
            ))}
          </Command.Group>

        </Command.List>
      </div>
    </Command.Dialog>
  );
}
