
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Editor from './components/Editor';
import Preview from './components/Preview';
import TableOfContents from './components/TableOfContents';
import { DEFAULT_MARKDOWN } from './lib/constants';
import { FileDown } from 'lucide-react';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(() => {
    const saved = localStorage.getItem('promark-content');
    return saved !== null ? saved : DEFAULT_MARKDOWN;
  });

  const [fileName, setFileName] = useState<string>(() => {
    return localStorage.getItem('promark-filename') || 'Untitled.md';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    localStorage.setItem('promark-content', markdown);
    localStorage.setItem('promark-filename', fileName);
  }, [markdown, fileName]);

  const handleUpload = (content: string, name: string = 'Document.md') => {
    setMarkdown(content);
    setFileName(name);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the editor? This cannot be undone.')) {
      setMarkdown('');
      setFileName('Untitled.md');
    }
  };

  // Drag and Drop Handlers
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we are leaving the main window
    if (e.currentTarget === e.target) {
        setIsDragging(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.md') || file.name.endsWith('.txt') || file.name.endsWith('.markdown'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        handleUpload(content, file.name);
      };
      reader.readAsText(file);
    }
  }, []);

  return (
    <div 
      className="flex flex-col h-screen overflow-hidden bg-custom-dark text-slate-200 print:h-auto print:overflow-visible print:bg-white relative"
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-brand-500/10 backdrop-blur-sm pointer-events-none">
          <div className="w-[90%] h-[90%] border-4 border-dashed border-brand-500 rounded-3xl flex flex-col items-center justify-center bg-custom-dark/80 transition-all duration-300 animate-in fade-in zoom-in-95">
            <div className="bg-brand-500 p-6 rounded-full mb-6 shadow-2xl shadow-brand-500/20">
              <FileDown className="w-12 h-12 text-white animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Drop it like it's hot! 🔥</h2>
            <p className="text-slate-400 text-lg">Release to load your Markdown file</p>
          </div>
        </div>
      )}

      <Header 
        onUpload={handleUpload} 
        onClear={handleClear} 
        isSidebarOpen={isSidebarOpen} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isEditorVisible={isEditorVisible}
        onToggleEditor={() => setIsEditorVisible(!isEditorVisible)}
        markdown={markdown}
        fileName={fileName}
      />
      
      <div className="flex-1 flex overflow-hidden relative print:h-auto print:overflow-visible print:block">
        
        {isSidebarOpen && (
            <aside className="w-64 bg-[#2a2a28] border-r border-white/5 flex-shrink-0 hidden md:block transition-all duration-300 no-print">
                <TableOfContents markdown={markdown} />
            </aside>
        )}

        <main className="flex-1 flex flex-col md:flex-row min-w-0 print:block print:h-auto print:overflow-visible">
          {isEditorVisible && (
             <div className="h-1/2 md:h-full md:w-1/2 border-r border-custom-border z-10 no-print min-w-0">
                <Editor value={markdown} onChange={setMarkdown} />
             </div>
          )}

          <div className={`h-full bg-custom-dark min-w-0 print:w-full print:h-auto print:overflow-visible print:bg-white ${isEditorVisible ? 'md:w-1/2' : 'w-full'}`}>
            <Preview markdown={markdown} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
