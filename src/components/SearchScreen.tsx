import React, { useState } from 'react';

interface SearchScreenProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onSearch, isLoading }) => {
  const [username, setUsername] = useState('');

  const handleSearch = () => {
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <main className="flex flex-1 justify-center py-10 sm:py-20 px-4">
      <div className="layout-content-container flex flex-col max-w-2xl w-full text-center items-center">
        <h1 className="text-slate-900 dark:text-white tracking-tight text-4xl sm:text-5xl font-bold leading-tight px-4 pb-3 pt-6">
          Discover GitHub Activity
        </h1>
        <p className="text-slate-500 dark:text-white/60 text-base font-normal leading-normal pb-8 pt-1 px-4 text-center max-w-lg">
          Analyze public user activity on GitHub for OSINT purposes.
        </p>
        <div className="w-full max-w-lg px-4 py-3">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <label className="flex flex-col min-w-40 h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <div className="text-slate-500 dark:text-white/50 flex items-center justify-center pl-4">
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                    search
                  </span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-slate-500 dark:placeholder:text-white/40 px-4 pl-2 text-base font-normal leading-normal"
                  placeholder="Enter GitHub username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </label>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              <span className="truncate">{isLoading ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
        </div>
        <div className="mt-8 text-center w-full">
          <p className="text-sm text-slate-500 dark:text-white/50 mb-4">Or try with one of these profiles:</p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <button
              onClick={() => onSearch('torvalds')}
              className="flex items-center gap-2 bg-slate-200 dark:bg-white/5 px-3 py-1.5 rounded-full hover:bg-slate-300 dark:hover:bg-white/10 transition-colors"
            >
              <img
                className="w-6 h-6 rounded-full"
                src="https://avatars.githubusercontent.com/u/1024025?v=4"
                alt="Linus Torvalds"
              />
              <span className="text-slate-700 dark:text-white/80 text-sm">linus-torvalds</span>
            </button>
            <button
              onClick={() => onSearch('yyx990803')}
              className="flex items-center gap-2 bg-slate-200 dark:bg-white/5 px-3 py-1.5 rounded-full hover:bg-slate-300 dark:hover:bg-white/10 transition-colors"
            >
              <img
                className="w-6 h-6 rounded-full"
                src="https://avatars.githubusercontent.com/u/499550?v=4"
                alt="Evan You"
              />
              <span className="text-slate-700 dark:text-white/80 text-sm">yyx990803</span>
            </button>
            <button
              onClick={() => onSearch('taylorotwell')}
              className="flex items-center gap-2 bg-slate-200 dark:bg-white/5 px-3 py-1.5 rounded-full hover:bg-slate-300 dark:hover:bg-white/10 transition-colors"
            >
              <img
                className="w-6 h-6 rounded-full"
                src="https://avatars.githubusercontent.com/u/463230?v=4"
                alt="Taylor Otwell"
              />
              <span className="text-slate-700 dark:text-white/80 text-sm">taylorotwell</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SearchScreen;
