'use client';

import type { SearchResult } from '@/services/api/types';
import Image from 'next/image';

interface ParsedContent {
  title: string;
  author: string;
  abstract: string;
  url: string;
}

const parseContent = (content: string): ParsedContent => {
  const titleMatch = content.match(/Title:\s*(.*?)\n/);
  const authorMatch = content.match(/Author:\s*(.*?)\n/);
  const abstractMatch = content.match(/Abstract:\s*(.*?)(?=\n\n\s*URL:)/s);
  const urlMatch = content.match(/URL:\s*(.*?)$/);

  return {
    title: titleMatch?.[1] || 'Untitled',
    author: authorMatch?.[1] || 'Unknown Author',
    abstract: abstractMatch?.[1]?.trim() || 'No abstract available',
    url: urlMatch?.[1] || ''
  };
};

const getPreviewImageUrl = (url: string): string => {
  if (url.includes('arxiv.org')) {
    // 将 PDF URL 转换为预览图 URL
    return url.replace('/pdf/', '/abs/').replace('.pdf', '');
  }
  return url;
};

interface SearchResultsProps {
  results: SearchResult[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="w-full max-w-[90%] md:max-w-[70%] text-center text-gray-500 p-8">
        No results found. Try a different search term.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[90%] md:max-w-[70%] space-y-6">
      {results.map((result) => {
        const { title, author, abstract, url } = parseContent(result.content);
        console.log(result.content);
        console.log(abstract);
        const previewUrl = getPreviewImageUrl(url);

        return (
          <div
            key={result.id}
            className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md"
          >
            {/* Title Section */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex-1">
                {title}
              </h3>
              <div className="text-xs text-gray-400 whitespace-nowrap ml-4">
                Score: {result.relevanceScore.toFixed(2)}
              </div>
            </div>
            
            {/* Author Section */}
            <div className="text-sm text-gray-600 mb-4">
              <span className="font-medium text-gray-700">Authors:</span> {author}
            </div>

            {/* Abstract Section */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Abstract</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {abstract}
              </p>
            </div>

            {/* URL Section */}
            {url && (
              <div className="mt-4 flex items-center gap-4">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2"
                >
                  <div className="relative w-16 h-20 bg-gray-100 rounded overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500">PDF</span>
                    </div>
                  </div>
                  <span className="text-purple-600 text-sm group-hover:text-purple-700 group-hover:underline">
                    View Paper
                  </span>
                </a>
              </div>
            )}

            {/* Score Bar */}
            <div className="mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: `${result.relevanceScore * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}