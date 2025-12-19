'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

export function PostsHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Sync search input with URL params
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearch = searchInput.trim();

    if (trimmedSearch) {
      router.push(`/posts?search=${encodeURIComponent(trimmedSearch)}`);
    } else {
      router.push('/posts');
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    router.push('/posts');
  };

  return (
    <div className="w-full py-8 sm:py-8 lg:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-center">
            Search Instagram Posts
          </h1>
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search by caption, username, or hashtag..."
                className={`w-full px-6 py-4 text-base sm:text-lg bg-secondary-background border-2 border-border rounded-full shadow-shadow focus:outline-none focus:ring-2 focus:ring-main focus:border-main transition-all ${
                  searchInput ? 'pr-[100px]' : 'pr-[60px]'
                }`}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-[60px] top-1/2 -translate-y-1/2 p-2 text-foreground/60 hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-main text-main-foreground rounded-full font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
