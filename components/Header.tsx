
import React, { useRef, useState, useEffect } from 'react';
import { Upload, Trash2, Printer, PanelLeft, PenLine, Download, FileText, FileCode, ChevronDown, FileJson } from 'lucide-react';

interface HeaderProps {
  onUpload: (content: string, name: string) => void;
  onClear: () => void;
  fileName: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isEditorVisible: boolean;
  onToggleEditor: () => void;
  markdown: string;
}

const Header: React.FC<HeaderProps> = ({ 
    onUpload, 
    onClear, 
    fileName,
    isSidebarOpen, 
    onToggleSidebar,
    isEditorVisible,
    onToggleEditor,
    markdown
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onUpload(content, file.name);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = (extension: 'md' | 'txt') => {
    const baseName = fileName.replace(/\.[^/.]+$/, ""); // Remove extension
    const blob = new Blob([markdown], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
  };

  const handlePrint = () => {
    window.print();
    setIsExportMenuOpen(false);
  };

  return (
    <header className="h-14 bg-custom-dark border-b border-custom-border flex items-center justify-between px-4 no-print z-20 relative shadow-sm">
      <div className="flex items-center gap-4 min-w-0">
        <button 
            onClick={onToggleSidebar}
            className={`p-1.5 rounded-md transition-colors ${isSidebarOpen ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            title="Toggle Sidebar"
        >
            <PanelLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 overflow-hidden">
            <h1 className="font-semibold text-slate-200 text-sm tracking-wide hidden lg:block shrink-0">ProMark <span className="opacity-50 font-normal">Viewer</span></h1>
            <div className="hidden lg:block w-px h-4 bg-white/10 mx-1 shrink-0"></div>
            <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 overflow-hidden">
                <FileCode className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="text-[13px] text-slate-300 font-medium truncate max-w-[150px] lg:max-w-[300px]">{fileName}</span>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".md,.txt,.markdown" 
          className="hidden" 
        />
        
        <button 
            onClick={onToggleEditor}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium border rounded transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 ${isEditorVisible ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' : 'text-slate-300 bg-white/5 border-white/10 hover:bg-white/10'}`}
            title={isEditorVisible ? "Hide Editor" : "Edit / Write"}
        >
          <PenLine className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isEditorVisible ? 'Done' : 'Edit'}</span>
        </button>

        <div className="w-px h-5 bg-white/10 mx-2"></div>

        <button 
          onClick={triggerUpload}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500"
          title="Upload File"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        <div className="relative" ref={exportMenuRef}>
            <button 
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500"
              title="Export Options"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </button>

            {isExportMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#2a2a28] border border-white/10 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Download As
                    </div>
                    <button 
                        onClick={() => handleDownload('md')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-brand-400 flex items-center gap-2"
                    >
                        <FileCode className="w-4 h-4" />
                        <span>Markdown (.md)</span>
                    </button>
                    <button 
                        onClick={() => handleDownload('txt')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-brand-400 flex items-center gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        <span>Plain Text (.txt)</span>
                    </button>
                    <div className="my-1 border-t border-white/5"></div>
                    <button 
                        onClick={handlePrint}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-brand-400 flex items-center gap-2"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Print / PDF</span>
                    </button>
                </div>
            )}
        </div>

        <div className="w-px h-5 bg-white/10 mx-2"></div>

        <button 
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors focus:outline-none focus:ring-1 focus:ring-red-500"
          title="Clear Editor"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
