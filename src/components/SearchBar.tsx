import { SearchIcon } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ query, onQueryChange, onSearch }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full max-w-[90%] md:max-w-[60%]"
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search anything..."
          className="w-full px-4 py-3 pr-12 rounded-full border border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100"
        >
          <SearchIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </form>
  );
} 