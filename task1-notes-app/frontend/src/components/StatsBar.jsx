import React from 'react';
import { Layers, Pin, Folder, Download, RotateCcw } from 'lucide-react';

export default function StatsBar({
  totalNotes,
  pinnedCount,
  categoryCount,
  hasActiveFilters,
  onResetFilters,
  notes,
}) {
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `notes-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

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

      <div className="stats-actions">
        {hasActiveFilters && (
          <button
            type="button"
            className="btn-text-action"
            onClick={onResetFilters}
            title="Reset filters"
          >
            <RotateCcw size={13} className="mr-1" /> Clear Filters
          </button>
        )}
        <button
          type="button"
          className="btn-text-action"
          onClick={handleExportJson}
          title="Export notes as JSON file"
        >
          <Download size={13} className="mr-1" /> Export JSON
        </button>
      </div>
    </div>
  );
}
