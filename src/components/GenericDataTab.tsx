import React, { useState, useEffect } from 'react';

interface GenericDataTabProps<T> {
  title: string;
  description?: string;
  fetchFn: (username: string, page: number) => Promise<T[]>;
  username: string;
  renderItem: (item: T) => React.ReactNode;
  itemKey: (item: T) => string;
  searchFunction: (item: T, query: string) => boolean;
  filterOptions?: string[];
  getFilterValue?: (item: T) => string;
  emptyMessage?: string;
  onItemClick?: (item: T) => void;
}

function GenericDataTab<T>({
  title,
  description,
  fetchFn,
  username,
  renderItem,
  itemKey,
  searchFunction,
  filterOptions = [],
  getFilterValue,
  emptyMessage = 'No items found.',
  onItemClick
}: GenericDataTabProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filter/Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    // Reset state when username or fetch function changes
    setItems([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    setError(null);
    fetchPage(1);
  }, [username, fetchFn]);

  const fetchPage = async (pageNumber: number) => {
    try {
      setLoading(true);
      const newItems = await fetchFn(username, pageNumber);

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => (pageNumber === 1 ? newItems : [...prev, ...newItems]));
      }
    } catch (err) {
      setError('Failed to load data. API rate limit might be exceeded.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage);
  };

  // Client-side filtering
  const displayedItems = items.filter((item) => {
    const matchesSearch = searchFunction(item, searchQuery);
    const matchesFilter = activeFilter === 'All' || (getFilterValue && getFilterValue(item) === activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        {description && <p className="text-sm text-slate-500 dark:text-[#92adc9]">{description}</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
        <div className="flex-grow">
          <label className="flex flex-col h-10 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-slate-500 dark:text-[#92adc9] flex border-none bg-slate-100 dark:bg-[#233648] items-center justify-center pl-3 rounded-l-lg border-r-0">
                <span className="material-symbols-outlined text-lg">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-white focus:outline-0 focus:ring-0 border-none bg-slate-100 dark:bg-[#233648] focus:border-none h-full placeholder:text-slate-500 placeholder:dark:text-[#92adc9] px-3 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                placeholder="Search loaded items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </label>
        </div>

        {filterOptions.length > 0 && (
          <div className="w-full sm:w-auto min-w-[150px]">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="form-select w-full h-10 bg-slate-100 dark:bg-[#233648] border-none text-slate-800 dark:text-white rounded-lg text-sm focus:ring-primary focus:border-primary cursor-pointer px-3"
            >
              <option value="All">All Types</option>
              {filterOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {displayedItems.map((item) => (
          <div key={itemKey(item)} onClick={() => onItemClick && onItemClick(item)}>
            {renderItem(item)}
          </div>
        ))}

        {!loading && displayedItems.length === 0 && !error && (
          <div className="text-center py-10 text-slate-500 dark:text-[#92adc9]">
            {items.length === 0 ? emptyMessage : 'No items match your search filters.'}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-6">
            <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
          </div>
        )}

        {!loading && hasMore && items.length > 0 && (
          <button
            onClick={handleLoadMore}
            className="self-center mt-4 px-6 py-2 bg-slate-200 dark:bg-[#233648] hover:bg-slate-300 dark:hover:bg-[#2f4052] text-slate-700 dark:text-white rounded-full text-sm font-medium transition-colors"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}

export default GenericDataTab;
