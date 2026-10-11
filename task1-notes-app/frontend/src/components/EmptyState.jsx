import React from 'react';
import { SearchX, PlusCircle, RotateCcw } from 'lucide-react';

export default function EmptyState({ isSearching, onResetFilters, onOpenCreateModal }) {
  if (isSearching) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-wrap">
          <SearchX size={36} className="text-muted" />
        </div>
        <h3 className="empty-title">No matching notes found</h3>
        <p className="empty-description">
          We couldn't find any notes matching your current search query or category filter.
        </p>
        <button
          type="button"
          className="btn btn-secondary mt-3"
          onClick={onResetFilters}
        >
          <RotateCcw size={15} className="mr-1" /> Reset Search Filters
        </button>
      </div>
    );
  }

  return (
    <div className="empty-state-card">
      <div className="empty-icon-wrap">
        <PlusCircle size={40} className="text-primary" />
      </div>
      <h3 className="empty-title">No notes yet</h3>
      <p className="empty-description">
        Start organizing your thoughts, studies, and internship tasks by creating your first note!
      </p>
      <button
        type="button"
        className="btn btn-primary mt-3"
        onClick={onOpenCreateModal}
      >
        <PlusCircle size={16} className="mr-1" /> Create Your First Note
      </button>
    </div>
  );
}
