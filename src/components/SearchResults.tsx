'use client';

import { useState, useEffect } from 'react';
import { searchService } from '@/services/api/endpoints';
import type { SearchResult } from '@/services/api/types';

export default function SearchResults() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSearchResults = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await searchService.search(query);
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[90%] md:max-w-[60%] space-y-4">
      {isLoading && (
        <div className="flex justify-center p-8">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-100" />
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-200" />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && results.length === 0 && (
        <div className="text-center text-gray-500 p-8">
          No results found. Try a different search term.
        </div>
      )}

      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {result.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{result.content}</p>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-400">
              Relevance: {result.relevanceScore.toFixed(2)}
            </div>
            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${result.relevanceScore * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}