"use client";

import React, { useRef } from "react";
import { motion } from "motion/react";
import { UploadCloud, FileText, FileImage, FileArchive, FileCode, FileSpreadsheet, Trash2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export function DocsView({ projectId }: { projectId: number }) {
  const { documents, setDocuments, addActivity, projects } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const projectFiles = documents.filter(d => d.projectId === projectId);
  const projectName = projects.find(p => p.id === projectId)?.name || "Unknown Project";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs = Array.from(files).map(file => {
      let sizeStr = "";
      if (file.size < 1024) sizeStr = file.size + " B";
      else if (file.size < 1024 * 1024) sizeStr = (file.size / 1024).toFixed(1) + " KB";
      else sizeStr = (file.size / (1024 * 1024)).toFixed(1) + " MB";

      return {
        projectId,
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.name.split('.').pop()?.toLowerCase() || "unknown",
        size: sizeStr,
        date: "Just now"
      };
    });

    setDocuments(prev => [...newDocs, ...prev]);
    
    newDocs.forEach(doc => {
      addActivity("uploaded a file", doc.name, projectName);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const deleteFile = (id: number) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-400" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg': return <FileImage className="w-5 h-5 text-emerald-400" />;
      case 'zip':
      case 'rar':
      case 'tar':
      case 'gz': return <FileArchive className="w-5 h-5 text-amber-400" />;
      case 'js':
      case 'ts':
      case 'html':
      case 'css':
      case 'json': return <FileCode className="w-5 h-5 text-blue-400" />;
      case 'xls':
      case 'xlsx':
      case 'csv': return <FileSpreadsheet className="w-5 h-5 text-green-400" />;
      default: return <FileText className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-end">
        <input 
          type="file" 
          multiple 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          <UploadCloud className="w-4 h-4" /> Upload Files
        </button>
      </div>
      
      {projectFiles.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <UploadCloud className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No files uploaded yet. Drag and drop or click to upload.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectFiles.map(file => (
            <div key={file.id} className="bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 rounded-2xl p-5 cursor-pointer transition-colors group relative">
              <button 
                onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                className="absolute top-3 right-3 p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-4 transition-colors">
                {getFileIcon(file.type)}
              </div>
              <h3 className="font-medium text-zinc-100 truncate mb-1 pr-6">{file.name}</h3>
              <p className="text-xs text-zinc-500">{file.size} • Uploaded {file.date}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
