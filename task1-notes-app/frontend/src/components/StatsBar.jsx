import React from 'react';
import { Layers, Pin, Folder, RotateCcw } from 'lucide-react';

export default function StatsBar({
  totalNotes,
  pinnedCount,
  categoryCount,
  hasActiveFilters,
  onResetFilters,
}) {
  return (
    <div className="stats-bar">
      <div className="stats-group">
        <div className="stat-item">
          <Layers size={14} className="stat-icon text-blue" />
          <span className="stat-label">Total Notes:</span>
          <span className="stat-value">{totalNotes}</span>
        </div>
        <div className="stat-divider">•</div>
        <div className="stat-item">
          <Pin size={14} className="stat-icon text-amber" />
          <span className="stat-label">Pinned:</span>
          <span className="stat-value">{pinnedCount}</span>
        </div>
        <div className="stat-divider">•</div>
        <div className="stat-item">
          <Folder size={14} className="stat-icon text-green" />
          <span className="stat-label">Categories:</span>
          <span className="stat-value">{categoryCount}</span>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="stats-actions">
          <button
            type="button"
            className="btn-text-action"
            onClick={onResetFilters}
            title="Reset filters"
          >
            <RotateCcw size={13} className="mr-1" /> Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
