"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  Zap,
  ZapOff,
  Search,
  Bell,
  User,
  Home,
  CheckSquare,
  Clock,
  Settings,
  Plus,
  Folder,
  ChevronRight,
  MessageSquare,
  FileText,
  Calendar
} from "lucide-react";
import { AppProvider, useAppContext } from "../context/AppContext";
import { ProjectView } from "./ProjectView";
import { CommandPalette } from "./CommandPalette";
import { User as UserType } from "../types";

function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 group ${
        active
          ? "bg-indigo-500/10 text-indigo-400 font-medium"
          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
      }`}
    >
      <div
        className={`w-5 h-5 flex items-center justify-center transition-colors ${
          active ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
        }`}
      >
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </div>
  );
}

function ToolIcon({ icon, count }: { icon: React.ReactNode; count: number }) {
  return (
    <div className="relative group/icon cursor-pointer">
      <div className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-zinc-400 group-hover/icon:text-indigo-400 group-hover/icon:bg-indigo-500/10 transition-colors">
        {icon}
      </div>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-500 border-2 border-zinc-900 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );
}

function CaravanAppContent() {
  const { projects, todoLists, activities, user } = useAppContext();
  const [adhdMode, setAdhdMode] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [cmdOpen, setCmdOpen] = useState(false);

  const toggleAdhdMode = () => setAdhdMode(!adhdMode);

  const myAssignments = todoLists.flatMap(list => 
    list.tasks
      .filter(t => !t.done && (t.assignee === "You" || (user && t.assignee === user.name?.split(' ')[0])))
      .map(t => ({
        id: t.id,
        title: t.text,
        project: projects.find(p => p.id === list.projectId)?.name || "Unknown Project",
        due: t.dueDate || "Upcoming",
        listId: list.id,
        projectId: list.projectId
      }))
  );

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${adhdMode ? "bg-zinc-950" : "bg-zinc-950"}`}>
      {/* Top Navigation */}
      <header className={`sticky top-0 z-50 flex items-center justify-between px-4 h-14 border-b transition-all duration-300 ${adhdMode ? "bg-zinc-950 border-zinc-800/50" : "bg-zinc-900/50 backdrop-blur-md border-zinc-800"}`}>
        <div className="flex items-center gap-4">
          {!adhdMode && (
            <button className="p-2 -ml-2 text-zinc-400 hover:text-zinc-100 rounded-md hover:bg-zinc-800/50 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveProject(null); setActiveTab("home"); }}>
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className={`font-semibold tracking-tight ${adhdMode ? "text-xl text-white" : "text-lg text-zinc-100"}`}>Caravan</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {!adhdMode && (
            <div className="hidden sm:flex items-center relative" onClick={() => setCmdOpen(true)}>
              <Search className="w-4 h-4 absolute left-3 text-zinc-500" />
              <input type="text" placeholder="Jump to... (Cmd+K)" className="bg-zinc-900 border border-zinc-800 rounded-full pl-9 pr-4 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all w-48 lg:w-64 placeholder:text-zinc-600 cursor-pointer" readOnly />
            </div>
          )}
          <button onClick={toggleAdhdMode} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${adhdMode ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"}`} title="Toggle Focus Mode">
            {adhdMode ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{adhdMode ? "Focus Mode On" : "Focus Mode"}</span>
          </button>
          {!adhdMode && (
            <>
              <button className="p-2 text-zinc-400 hover:text-zinc-100 rounded-full hover:bg-zinc-800/50 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-zinc-950"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden cursor-pointer">
                {user?.picture ? <img src={user.picture} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <User className="w-4 h-4 text-zinc-400" />}
              </div>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <CommandPalette open={cmdOpen} setOpen={setCmdOpen} onSelectProject={(id) => { setActiveProject(id); setActiveTab("project"); }} />
        {/* Sidebar */}
        <AnimatePresence>
          {!adhdMode && (
            <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 240, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="hidden md:flex flex-col border-r border-zinc-800/50 bg-zinc-900/20 overflow-y-auto">
              <nav className="p-4 space-y-1">
                <SidebarItem icon={<Home />} label="Home" active={activeTab === "home"} onClick={() => { setActiveTab("home"); setActiveProject(null); }} />
                <SidebarItem icon={<CheckSquare />} label="My Assignments" active={activeTab === "assignments"} onClick={() => setActiveTab("assignments")} />
                <SidebarItem icon={<Clock />} label="Recent Activity" active={activeTab === "activity"} onClick={() => setActiveTab("activity")} />
              </nav>
              <div className="px-4 py-2 mt-4">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  <span>Projects</span>
                  <button className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-100 transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                </div>
                <div className="space-y-1">
                  {projects.map(p => (
                    <SidebarItem key={p.id} icon={<Folder />} label={p.name} active={activeProject === p.id} onClick={() => { setActiveProject(p.id); setActiveTab("project"); }} />
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 relative">
          <div className={`mx-auto w-full p-4 sm:p-8 lg:p-12 transition-all duration-500 ${adhdMode ? "max-w-3xl pt-20" : "max-w-7xl"}`}>
            {activeProject ? (
              <ProjectView projectId={activeProject} onBack={() => { setActiveProject(null); setActiveTab("home"); }} />
            ) : activeTab === "assignments" ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-semibold text-zinc-100 mb-8">My Assignments</h1>
                <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden">
                  {myAssignments.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500">No assignments right now. You're all caught up!</div>
                  ) : (
                    myAssignments.map((assignment, i) => (
                      <div key={assignment.id} onClick={() => { setActiveProject(assignment.projectId); setActiveTab("project"); }} className={`p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors cursor-pointer ${i !== 0 ? 'border-t border-zinc-800/50' : ''}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0"><CheckSquare className="w-5 h-5" /></div>
                          <div>
                            <h3 className="font-medium text-zinc-100">{assignment.title}</h3>
                            <p className="text-sm text-zinc-500 mt-0.5">{assignment.project} • {assignment.due}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-600" />
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            ) : activeTab === "activity" ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-semibold text-zinc-100 mb-8">Recent Activity</h1>
                <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden p-6">
                  <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[15px] before:w-px before:bg-zinc-800">
                    {activities.map((activity, i) => (
                      <div key={activity.id} className="relative flex gap-6">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border-4 border-zinc-950 flex items-center justify-center flex-shrink-0 z-10 text-xs font-bold text-zinc-400">{activity.user.charAt(0)}</div>
                        <div className="flex-1 pb-6">
                          <p className="text-base text-zinc-300"><span className="font-medium text-zinc-200">{activity.user}</span> {activity.action} <span className="text-zinc-100 font-medium">{activity.target}</span></p>
                          <div className="flex items-center gap-2 mt-1.5 text-sm text-zinc-500"><span>{activity.project}</span><span>•</span><span>{activity.time}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                {adhdMode ? (
                  <div className="text-center space-y-8">
                    <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-100">Up Next For You</h1>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
                      {myAssignments.length > 0 ? (
                        <div className="space-y-6">
                          {myAssignments.slice(0, 3).map((assignment, i) => (
                            <div key={assignment.id} onClick={() => { setActiveProject(assignment.projectId); setActiveTab("project"); }} className={`flex items-start gap-4 text-left cursor-pointer group ${i !== 0 ? 'pt-6 border-t border-zinc-800/50' : ''}`}>
                              <div className="mt-1 w-6 h-6 rounded border-2 border-zinc-700 group-hover:border-indigo-500 transition-colors flex-shrink-0" />
                              <div>
                                <h3 className="text-xl font-medium text-zinc-100 group-hover:text-indigo-400 transition-colors">{assignment.title}</h3>
                                <p className="text-zinc-500 mt-1">{assignment.project}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-start gap-4 text-left">
                          <div className="mt-1 w-6 h-6 rounded border-2 border-zinc-700 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-medium text-zinc-100">You're all caught up!</h3>
                            <p className="text-zinc-500 mt-1">Enjoy your free time.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Projects</h1>
                      <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Project
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {projects.map((project, i) => (
                        <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => { setActiveProject(project.id); setActiveTab("project"); }} className="group bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 rounded-3xl p-6 cursor-pointer transition-all hover:shadow-xl hover:shadow-black/20">
                          <div className="flex items-start justify-between mb-6">
                            <div className={`w-12 h-12 rounded-2xl ${project.color} flex items-center justify-center shadow-lg`}>
                              <span className="text-white font-bold text-xl">{project.name.charAt(0)}</span>
                            </div>
                            <button className="text-zinc-500 hover:text-zinc-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Settings className="w-5 h-5" /></button>
                          </div>
                          <h3 className="text-xl font-medium text-zinc-100 mb-1 group-hover:text-indigo-400 transition-colors">{project.name}</h3>
                          <p className="text-sm text-zinc-500 mb-6">Active {project.lastActive}</p>
                          <div className="flex items-center gap-2 pt-4 border-t border-zinc-800/50">
                            <ToolIcon icon={<MessageSquare className="w-4 h-4" />} count={2} />
                            <ToolIcon icon={<CheckSquare className="w-4 h-4" />} count={5} />
                            <ToolIcon icon={<FileText className="w-4 h-4" />} count={0} />
                            <ToolIcon icon={<Calendar className="w-4 h-4" />} count={1} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                      <div>
                        <h2 className="text-sm font-medium text-zinc-100 mb-4 flex items-center gap-2"><CheckSquare className="w-4 h-4 text-zinc-400" /> My Assignments</h2>
                        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden">
                          {myAssignments.slice(0, 4).map((assignment, i) => (
                            <div key={assignment.id} onClick={() => { setActiveProject(assignment.projectId); setActiveTab("project"); }} className={`p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors cursor-pointer ${i !== 0 ? 'border-t border-zinc-800/50' : ''}`}>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0"><CheckSquare className="w-4 h-4" /></div>
                                <div>
                                  <h3 className="text-sm font-medium text-zinc-100">{assignment.title}</h3>
                                  <p className="text-xs text-zinc-500 mt-0.5">{assignment.project}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-sm font-medium text-zinc-100 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-zinc-400" /> Recent Activity</h2>
                        <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-zinc-800">
                          {activities.slice(0, 5).map((activity, i) => (
                            <div key={activity.id} className="relative flex gap-4">
                              <div className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center flex-shrink-0 z-10 text-[10px] font-bold text-zinc-400">{activity.user.charAt(0)}</div>
                              <div className="flex-1 pb-4">
                                <p className="text-sm text-zinc-300"><span className="font-medium text-zinc-200">{activity.user}</span> {activity.action} <span className="text-zinc-100">{activity.target}</span></p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500"><span>{activity.project}</span><span>•</span><span>{activity.time}</span></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CaravanApp() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) return;
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setUser(event.data.user);
        setIsLoggingIn(false);
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        console.error('OAuth error:', event.data.error);
        setIsLoggingIn(false);
        alert('Authentication failed. Please try again.');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnect = async () => {
    try {
      setIsLoggingIn(true);
      const currentOrigin = window.location.origin;
      const response = await fetch(`/api/auth/google/url?origin=${encodeURIComponent(currentOrigin)}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to get auth URL');

      const authWindow = window.open(data.url, 'oauth_popup', 'width=600,height=700');
      if (!authWindow) {
        setIsLoggingIn(false);
        alert('Please allow popups for this site to connect your account.');
      }
    } catch (error: any) {
      console.error('OAuth error:', error);
      setIsLoggingIn(false);
      alert(error.message || 'Failed to start authentication.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 mb-2">Welcome to Caravan</h1>
          <p className="text-zinc-400 mb-8">A modern, minimalist project management tool. Log in with your Google Workspace or personal Gmail account to continue.</p>
          <button onClick={handleConnect} disabled={isLoggingIn} className="w-full bg-white hover:bg-zinc-100 text-zinc-900 px-4 py-3 rounded-xl text-base font-medium transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoggingIn ? <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" /> : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            {isLoggingIn ? 'Connecting...' : 'Continue with Google'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <AppProvider user={user}>
      <CaravanAppContent />
    </AppProvider>
  );
}
