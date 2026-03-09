"use client";

import React, { useState, forwardRef, memo } from "react";
import { motion } from "motion/react";
import { Plus, Check, X, UserPlus, Edit2, Trash2, ChevronUp, ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useAppContext } from "../../context/AppContext";

const TaskItem = memo(({
  task,
  listId,
  editingTask,
  editingTaskText,
  setEditingTask,
  setEditingTaskText,
  updateTask,
  toggleTask,
  assignTask,
  setTaskDueDate,
  deleteTask,
  USERS
}: {
  task: any;
  listId: number;
  editingTask: number | null;
  editingTaskText: string;
  setEditingTask: (id: number | null) => void;
  setEditingTaskText: (text: string) => void;
  updateTask: (listId: number, taskId: number) => void;
  toggleTask: (listId: number, taskId: number) => void;
  assignTask: (listId: number, taskId: number, assignee: string | null) => void;
  setTaskDueDate: (listId: number, taskId: number, date: Date | null) => void;
  deleteTask: (listId: number, taskId: number) => void;
  USERS: string[];
}) => (
  <div className="group flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-zinc-800/30 transition-colors">
    <button 
      onClick={() => toggleTask(listId, task.id)}
      className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${task.done ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-2 border-zinc-600 hover:border-indigo-500'}`}
    >
      {task.done && <Check className="w-3.5 h-3.5" />}
    </button>
    
    {editingTask === task.id ? (
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          autoFocus
          value={editingTaskText}
          onChange={(e) => setEditingTaskText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && updateTask(listId, task.id)}
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1 text-zinc-100 focus:outline-none focus:border-indigo-500 text-sm"
        />
        <button onClick={() => updateTask(listId, task.id)} className="p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
          <Check className="w-3 h-3" />
        </button>
        <button onClick={() => setEditingTask(null)} className="p-1.5 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700">
          <X className="w-3 h-3" />
        </button>
      </div>
    ) : (
      <div className="flex-1">
        <p className={`text-sm text-zinc-100 ${task.done ? 'line-through text-zinc-500' : ''}`}>{task.text}</p>
        <div className="flex items-center gap-2 mt-2">
          {task.assignee && (
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-400">
                {task.assignee.charAt(0)}
              </div>
              <span className="text-xs text-zinc-500">{task.assignee}</span>
            </div>
          )}
          {task.dueDate && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${new Date(task.dueDate + " " + new Date().getFullYear()) < new Date() ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {task.dueDate}
            </span>
          )}
        </div>
      </div>
    )}

    {!editingTask && (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Assignee Dropdown */}
        <div className="relative">
          <button className="p-1 text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800 rounded transition-colors">
            <UserPlus className="w-3.5 h-3.5" />
          </button>
          <div className="absolute right-0 top-full mt-1 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            <button 
              onClick={() => assignTask(listId, task.id, null)}
              className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Unassigned
            </button>
            {USERS.map(u => (
              <button 
                key={u}
                onClick={() => assignTask(listId, task.id, u)}
                className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-400">
                  {u.charAt(0)}
                </div>
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date Picker */}
        <div className="relative">
          <DatePicker
            selected={task.dueDate ? new Date(task.dueDate + " " + new Date().getFullYear()) : null}
            onChange={(date: Date | null) => setTaskDueDate(listId, task.id, date)}
            dateFormat="MMM d"
            customInput={
              <button className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors ${task.dueDate ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}>
                <CalendarIcon className="w-3.5 h-3.5" />
                {task.dueDate || "Due Date"}
              </button>
            }
            popperPlacement="bottom-end"
          />
        </div>

        {/* Task Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => { setEditingTask(task.id); setEditingTaskText(task.text); }}
            className="p-1 text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800 rounded transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => deleteTask(listId, task.id)}
            className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )}
  </div>
));

export function TodosView({ projectId }: { projectId: number }) {
  const { todoLists, setTodoLists, user, projects, addActivity } = useAppContext();
  
  const lists = todoLists.filter(l => l.projectId === projectId);
  const project = projects.find(p => p.id === projectId);
  const projectName = project?.name || "Unknown Project";

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  
  const [addingTaskToList, setAddingTaskToList] = useState<number | null>(null);
  const [newTaskText, setNewTaskText] = useState("");
  
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState("");

  const [editingList, setEditingList] = useState<number | null>(null);
  const [editingListTitle, setEditingListTitle] = useState("");

  const currentUser = user?.name?.split(' ')[0] || "You";
  const USERS = ["Sarah J.", "Mike T.", currentUser, "Alex R."].filter((v, i, a) => a.indexOf(v) === i);

  const toggleTask = (listId: number, taskId: number) => {
    setTodoLists(prev => prev.map(list => {
      if (list.id === listId) {
        const task = list.tasks.find(t => t.id === taskId);
        if (task && !task.done) {
           addActivity("completed a to-do", task.text, projectName);
        } else if (task && task.done) {
           addActivity("un-completed a to-do", task.text, projectName);
        }
        return {
          ...list,
          tasks: list.tasks.map(t => 
            t.id === taskId ? { ...t, done: !t.done } : t
          )
        };
      }
      return list;
    }));
  };

  const addList = () => {
    if (!newListTitle.trim()) return;
    setTodoLists(prev => [...prev, { projectId, id: Date.now(), title: newListTitle, tasks: [] }]);
    addActivity("created a list", newListTitle, projectName);
    setNewListTitle("");
    setIsAddingList(false);
  };

  const deleteList = (listId: number) => {
    setTodoLists(prev => prev.filter(l => l.id !== listId));
  };

  const updateListTitle = (listId: number) => {
    if (!editingListTitle.trim()) return;
    setTodoLists(prev => prev.map(l => l.id === listId ? { ...l, title: editingListTitle } : l));
    setEditingList(null);
  };

  const addTask = (listId: number) => {
    if (!newTaskText.trim()) return;
    setTodoLists(prev => prev.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          tasks: [...list.tasks, { id: Date.now(), text: newTaskText, done: false, assignee: null }]
        };
      }
      return list;
    }));
    addActivity("added a to-do", newTaskText, projectName);
    setNewTaskText("");
    setAddingTaskToList(null);
  };

  const deleteTask = (listId: number, taskId: number) => {
    setTodoLists(prev => prev.map(list => {
      if (list.id === listId) {
        return { ...list, tasks: list.tasks.filter(t => t.id !== taskId) };
      }
      return list;
    }));
  };

  const updateTask = (listId: number, taskId: number) => {
    if (!editingTaskText.trim()) return;
    setTodoLists(prev => prev.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          tasks: list.tasks.map(t => t.id === taskId ? { ...t, text: editingTaskText } : t)
        };
      }
      return list;
    }));
    setEditingTask(null);
  };

  const assignTask = (listId: number, taskId: number, assignee: string | null) => {
    setTodoLists(prev => prev.map(list => {
      if (list.id === listId) {
        const task = list.tasks.find(t => t.id === taskId);
        if (task && assignee) {
           addActivity("assigned a to-do to " + assignee, task.text, projectName);
        }
        return {
          ...list,
          tasks: list.tasks.map(t => t.id === taskId ? { ...t, assignee } : t)
        };
      }
      return list;
    }));
  };

  const setTaskDueDate = (listId: number, taskId: number, date: Date | null) => {
    setTodoLists(prev => prev.map(list => {
      if (list.id === listId) {
        const task = list.tasks.find(t => t.id === taskId);
        const formattedDate = date ? format(date, "MMM d") : null;
        if (task && formattedDate) {
           addActivity("set due date to " + formattedDate, task.text, projectName);
        }
        return {
          ...list,
          tasks: list.tasks.map(t => t.id === taskId ? { ...t, dueDate: formattedDate } : t)
        };
      }
      return list;
    }));
  };

  const moveList = (listId: number, direction: 'up' | 'down') => {
    setTodoLists(prev => {
      const listIndex = prev.findIndex(l => l.id === listId);
      if (listIndex === -1) return prev;
      
      const list = prev[listIndex];
      const projectLists = prev.filter(l => l.projectId === projectId);
      const relativeIndex = projectLists.findIndex(l => l.id === listId);
      
      if (direction === 'up' && relativeIndex > 0) {
        const swapTarget = projectLists[relativeIndex - 1];
        const swapIndex = prev.findIndex(l => l.id === swapTarget.id);
        const newPrev = [...prev];
        newPrev[listIndex] = swapTarget;
        newPrev[swapIndex] = list;
        return newPrev;
      } else if (direction === 'down' && relativeIndex < projectLists.length - 1) {
        const swapTarget = projectLists[relativeIndex + 1];
        const swapIndex = prev.findIndex(l => l.id === swapTarget.id);
        const newPrev = [...prev];
        newPrev[listIndex] = swapTarget;
        newPrev[swapIndex] = list;
        return newPrev;
      }
      return prev;
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    if (result.type === "list") {
      // Reorder lists
      const reorderedLists = Array.from(lists);
      const [removed] = reorderedLists.splice(result.source.index, 1);
      reorderedLists.splice(result.destination.index, 0, removed);
      setTodoLists(prev => {
        const otherLists = prev.filter(l => l.projectId !== projectId);
        return [...otherLists, ...reorderedLists];
      });
    } else if (result.type === "task") {
      const sourceListId = parseInt(result.source.droppableId.split('-')[1]);
      const destListId = parseInt(result.destination.droppableId.split('-')[1]);

      if (sourceListId === destListId) {
        // Reorder within same list
        setTodoLists(prev => prev.map(list => {
          if (list.id === sourceListId) {
            const reorderedTasks = Array.from(list.tasks);
            const [removed] = reorderedTasks.splice(result.source.index, 1);
            reorderedTasks.splice(result.destination.index, 0, removed);
            return { ...list, tasks: reorderedTasks };
          }
          return list;
        }));
      } else {
        // Move between lists
        setTodoLists(prev => {
          const sourceList = prev.find(l => l.id === sourceListId);
          const destList = prev.find(l => l.id === destListId);
          if (!sourceList || !destList) return prev;

          const task = sourceList.tasks[result.source.index];
          const newSourceTasks = sourceList.tasks.filter((_, i) => i !== result.source.index);
          const newDestTasks = [...destList.tasks];
          newDestTasks.splice(result.destination.index, 0, task);

          return prev.map(list => {
            if (list.id === sourceListId) return { ...list, tasks: newSourceTasks };
            if (list.id === destListId) return { ...list, tasks: newDestTasks };
            return list;
          });
        });
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      <div className="flex justify-end">
        <button 
          onClick={() => setIsAddingList(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New List
        </button>
      </div>

      {isAddingList && (
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
          <input
            type="text"
            autoFocus
            placeholder="Name this list..."
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addList()}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-indigo-500 mb-4"
          />
          <div className="flex gap-2">
            <button onClick={addList} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Save List
            </button>
            <button onClick={() => setIsAddingList(false)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="list" direction="vertical">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-8">
              {lists.map((list, listIndex) => (
                <Draggable key={list.id} draggableId={`list-${list.id}`} index={listIndex}>
                  {(provided) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.draggableProps} 
                      className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4 group/list" {...provided.dragHandleProps}>
                        {editingList === list.id ? (
                          <div className="flex-1 flex gap-2 mr-4">
                            <input
                              type="text"
                              autoFocus
                              value={editingListTitle}
                              onChange={(e) => setEditingListTitle(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && updateListTitle(list.id)}
                              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1 text-zinc-100 focus:outline-none focus:border-indigo-500"
                            />
                            <button onClick={() => updateListTitle(list.id)} className="p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingList(null)} className="p-1.5 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <h3 className="text-lg font-medium text-zinc-100">{list.title}</h3>
                        )}
                        
                        {editingList !== list.id && (
                          <div className="flex items-center gap-2 opacity-0 group-hover/list:opacity-100 transition-opacity">
                            <button 
                              onClick={() => moveList(list.id, 'up')}
                              className="p-1.5 text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800 rounded-md transition-colors"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => moveList(list.id, 'down')}
                              className="p-1.5 text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800 rounded-md transition-colors"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => { setEditingList(list.id); setEditingListTitle(list.title); }}
                              className="p-1.5 text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800 rounded-md transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteList(list.id)}
                              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <Droppable droppableId={`list-${list.id}`} type="task">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3 min-h-[10px]">
                            {list.tasks.map((task, taskIndex) => (
                              <Draggable key={task.id} draggableId={`task-${task.id}`} index={taskIndex}>
                                {(provided) => (
                                  <div 
                                    ref={provided.innerRef} 
                                    {...provided.draggableProps} 
                                    {...provided.dragHandleProps}
                                    className="group flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-zinc-800/30 transition-colors"
                                  >
                                    <button 
                                      onClick={() => toggleTask(list.id, task.id)}
                                      className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${task.done ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-2 border-zinc-600 hover:border-indigo-500'}`}
                                    >
                                      {task.done && <Check className="w-3.5 h-3.5" />}
                                    </button>
                                    
                                    {editingTask === task.id ? (
                                      <div className="flex-1 flex gap-2">
                                        <input
                                          type="text"
                                          autoFocus
                                          value={editingTaskText}
                                          onChange={(e) => setEditingTaskText(e.target.value)}
                                          onKeyDown={(e) => e.key === 'Enter' && updateTask(list.id, task.id)}
                                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1 text-zinc-100 focus:outline-none focus:border-indigo-500 text-sm"
                                        />
                                        <button onClick={() => updateTask(list.id, task.id)} className="p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                                          <Check className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => setEditingTask(null)} className="p-1.5 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700">
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <span className={`text-base transition-colors ${task.done ? 'text-zinc-500 line-through' : 'text-zinc-300 group-hover:text-zinc-100'}`}>
                                          {task.text}
                                        </span>
                                        
                                        <div className="flex items-center gap-3">
                                          {/* Assignee Dropdown/Button */}
                                          <div className="relative group/assignee">
                                            <button className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors ${task.assignee ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}>
                                              {task.assignee ? (
                                                <>
                                                  <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center text-[8px] font-bold">
                                                    {task.assignee.charAt(0)}
                                                  </div>
                                                  {task.assignee}
                                                </>
                                              ) : (
                                                <>
                                                  <UserPlus className="w-3.5 h-3.5" />
                                                  Assign
                                                </>
                                              )}
                                            </button>
                                            
                                            {/* Simple dropdown on hover for assigning */}
                                            <div className="absolute right-0 top-full mt-1 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover/assignee:opacity-100 group-hover/assignee:visible transition-all z-10 py-1">
                                              <button 
                                                onClick={() => assignTask(list.id, task.id, null)}
                                                className="w-full text-left px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                                              >
                                                Unassigned
                                              </button>
                                              {USERS.map(u => (
                                                <button 
                                                  key={u}
                                                  onClick={() => assignTask(list.id, task.id, u)}
                                                  className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 flex items-center gap-2"
                                                >
                                                  <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-400">
                                                    {u.charAt(0)}
                                                  </div>
                                                  {u}
                                                </button>
                                              ))}
                                            </div>
                                          </div>

                                          {/* Due Date Picker */}
                                          <div className="relative">
                                            <DatePicker
                                              selected={task.dueDate ? new Date(task.dueDate + " " + new Date().getFullYear()) : null}
                                              onChange={(date: Date | null) => setTaskDueDate(list.id, task.id, date)}
                                              dateFormat="MMM d"
                                              customInput={
                                                <button className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors ${task.dueDate ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}>
                                                  <CalendarIcon className="w-3.5 h-3.5" />
                                                  {task.dueDate || "Due Date"}
                                                </button>
                                              }
                                              popperPlacement="bottom-end"
                                            />
                                          </div>

                                          {/* Task Actions */}
                                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                              onClick={() => { setEditingTask(task.id); setEditingTaskText(task.text); }}
                                              className="p-1 text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800 rounded transition-colors"
                                            >
                                              <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                              onClick={() => deleteTask(list.id, task.id)}
                                              className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {addingTaskToList === list.id ? (
                        <div className="mt-2 flex gap-2">
                          <input
                            type="text"
                            autoFocus
                            placeholder="What needs to be done?"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTask(list.id)}
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                          />
                          <button onClick={() => addTask(list.id)} className="px-3 py-1.5 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors">
                            Add
                          </button>
                          <button onClick={() => setAddingTaskToList(null)} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setAddingTaskToList(list.id); setNewTaskText(""); }}
                          className="mt-2 text-sm text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors p-1 -ml-1 rounded-md hover:bg-zinc-800/50"
                        >
                          <Plus className="w-4 h-4" /> Add a to-do
                        </button>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </motion.div>
  );
}
