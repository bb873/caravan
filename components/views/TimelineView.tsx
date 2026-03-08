"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Plus, Calendar as CalendarIcon, MoreHorizontal } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useAppContext } from "../../context/AppContext";
import { TimelineEvent } from "../../types";

export function TimelineView({ projectId }: { projectId: number }) {
  const { timelineEvents, setTimelineEvents, addActivity, projects } = useAppContext();
  const projectEvents = timelineEvents.filter(e => e.projectId === projectId);
  const projectName = projects.find(p => p.id === projectId)?.name || "Unknown Project";
  
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState<Date | null>(new Date());
  const [newType, setNewType] = useState<'meeting' | 'deadline'>('meeting');

  const handleAdd = () => {
    if (!newTitle.trim() || !newDate) return;
    
    const formattedDate = format(newDate, "MMM d, h:mm a");
    
    const newEvent: TimelineEvent = {
      projectId,
      id: Date.now(),
      title: newTitle,
      date: formattedDate,
      type: newType
    };
    
    setTimelineEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    addActivity("added an event", newTitle, projectName);
    setIsAdding(false);
    setNewTitle("");
    setNewDate(new Date());
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-end">
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {isAdding && (
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              autoFocus
              placeholder="Event title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-indigo-500"
            />
            <div className="relative">
              <DatePicker
                selected={newDate}
                onChange={(date: Date | null) => setNewDate(date)}
                showTimeSelect
                timeFormat="h:mm aa"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-indigo-500"
                wrapperClassName="w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
              <input 
                type="radio" 
                checked={newType === 'meeting'} 
                onChange={() => setNewType('meeting')}
                className="accent-indigo-500"
              />
              Meeting
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
              <input 
                type="radio" 
                checked={newType === 'deadline'} 
                onChange={() => setNewType('deadline')}
                className="accent-amber-500"
              />
              Deadline
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Save Event
            </button>
            <button onClick={() => setIsAdding(false)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {projectEvents.length === 0 && !isAdding ? (
        <div className="text-center py-12 text-zinc-500">
          <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No events scheduled. Add a meeting or deadline.</p>
        </div>
      ) : (
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden">
          {projectEvents.map((event, i) => (
            <div key={event.id} className={`p-4 sm:p-6 flex items-center gap-4 hover:bg-zinc-800/30 transition-colors cursor-pointer ${i !== 0 ? 'border-t border-zinc-800/50' : ''}`}>
              <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${event.type === 'deadline' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                <span className="text-xs font-bold uppercase">{event.date.split(' ')[0]}</span>
                <span className="text-lg font-bold leading-none">{event.date.split(' ')[1]?.replace(',', '') || '25'}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-zinc-100">{event.title}</h3>
                <p className="text-sm text-zinc-500 mt-0.5">{event.date}</p>
              </div>
              <MoreHorizontal className="w-5 h-5 text-zinc-600" />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
