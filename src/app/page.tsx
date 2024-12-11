'use client';

import { useState, useRef } from 'react';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import ChatInterface from '@/components/ChatInterface';
import DocumentUpload from '@/components/DocumentUpload';
import ModeToggle from '@/components/ModeToggle';

type SearchMode = 'search' | 'chat' | 'document';

export default function Home() {
  const [searchMode, setSearchMode] = useState<SearchMode>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const searchResultsRef = useRef<any>(null);

  const handleSearch = (query: string) => {
    if (searchResultsRef.current) {
      searchResultsRef.current.fetchSearchResults(query);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f0ff] to-[#fff0f5]">
      <header className="w-full py-6 px-4 text-center">
        <h1 className="text-[#000080] text-3xl font-bold">AI Search Assistant</h1>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          <ModeToggle currentMode={searchMode} onModeChange={setSearchMode} />
          
          {searchMode === 'search' && (
            <>
              <SearchBar 
                query={searchQuery} 
                onQueryChange={setSearchQuery}
                onSearch={handleSearch}
              />
              <SearchResults ref={searchResultsRef} />
            </>
          )}
          
          {searchMode === 'chat' && <ChatInterface />}
          
          {searchMode === 'document' && <DocumentUpload />}
        </div>
      </main>
    </div>
  );
}
