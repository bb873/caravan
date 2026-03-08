export type Task = { id: number; text: string; done: boolean; assignee: string | null; dueDate?: string | null };
export type TodoList = { projectId: number; id: number; title: string; tasks: Task[] };
export type Activity = { id: number; user: string; action: string; target: string; project: string; time: string };
export type Message = { projectId: number; id: number; title: string; content: string; author: string; date: string; comments: number };
export type TimelineEvent = { projectId: number; id: number; title: string; date: string; type: 'meeting' | 'deadline' };
export type Project = { id: number; name: string; lastActive: string; color: string };
export type User = { name: string; email: string; picture?: string };
export type DocumentFile = { projectId: number; id: number; name: string; type: string; size: string; date: string; url?: string };

export type AppContextType = {
  projects: Project[];
  todoLists: TodoList[];
  setTodoLists: React.Dispatch<React.SetStateAction<TodoList[]>>;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  timelineEvents: TimelineEvent[];
  setTimelineEvents: React.Dispatch<React.SetStateAction<TimelineEvent[]>>;
  documents: DocumentFile[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentFile[]>>;
  user: User | null;
  addActivity: (action: string, target: string, projectName: string) => void;
};
