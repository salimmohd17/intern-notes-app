import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ searchQuery, onSearchChange, onClear, resultCount }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="search-bar-wrapper">
      <div className="search-input-container">
        <Search size={18} className="search-input-icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search notes by title or content... (Press '/' to focus)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClear}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {searchQuery && (
        <span className="search-results-badge">
          {resultCount} {resultCount === 1 ? 'result' : 'results'} found
        </span>
      )}
    </div>
  );
}
