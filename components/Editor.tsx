
import React from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  return (
    <div className="h-full w-full bg-[#30302e] flex flex-col no-print relative group">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 w-full h-full bg-[#30302e] text-gray-200 p-6 md:p-8 resize-none focus:outline-none font-mono text-[14px] md:text-[15px] leading-8 selection:bg-brand-500/30 selection:text-white border-none placeholder-gray-500"
        placeholder="# Start writing markdown here..."
        spellCheck={false}
      />
    </div>
  );
};

export default Editor;
