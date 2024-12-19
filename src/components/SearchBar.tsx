'use client';

import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { searchService } from '@/services/api/endpoints';
import type { SearchResult } from '@/services/api/types';

interface SearchBarProps {
  onSearchResults?: (results: SearchResult[]) => void;
}

export default function SearchBar({ onSearchResults }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await searchService.search(query.trim());
      onSearchResults?.(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      onSearchResults?.([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="w-full max-w-[90%] md:max-w-[70%] mb-6"
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search papers..."
          className="w-full px-4 py-3 pr-12 rounded-full border border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors
            ${isLoading 
              ? 'cursor-not-allowed opacity-50' 
              : 'hover:bg-gray-100 active:bg-gray-200'}`}
          disabled={isLoading}
        >
          <SearchIcon className={`w-5 h-5 ${isLoading ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </form>
  );
}