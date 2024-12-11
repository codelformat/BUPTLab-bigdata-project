import { SearchIcon, MessageCircleIcon, FileTextIcon } from 'lucide-react';

type SearchMode = 'search' | 'chat' | 'document';

interface ModeToggleProps {
  currentMode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
}

export default function ModeToggle({ currentMode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex gap-2 p-1 bg-white rounded-lg shadow-sm">
      <button
        onClick={() => onModeChange('search')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          currentMode === 'search'
            ? 'bg-purple-100 text-purple-700'
            : 'hover:bg-gray-100'
        }`}
      >
        <SearchIcon size={18} />
        <span>Search</span>
      </button>
      
      <button
        onClick={() => onModeChange('chat')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          currentMode === 'chat'
            ? 'bg-purple-100 text-purple-700'
            : 'hover:bg-gray-100'
        }`}
      >
        <MessageCircleIcon size={18} />
        <span>Chat</span>
      </button>
      
      <button
        onClick={() => onModeChange('document')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          currentMode === 'document'
            ? 'bg-purple-100 text-purple-700'
            : 'hover:bg-gray-100'
        }`}
      >
        <FileTextIcon size={18} />
        <span>Document</span>
      </button>
    </div>
  );
} 