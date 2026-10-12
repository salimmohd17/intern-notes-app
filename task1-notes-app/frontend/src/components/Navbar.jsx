import React from 'react';
import { Plus, LayoutGrid, List, BookOpen, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({
  serverOnline,
  isRefreshing,
  viewMode,
  onToggleViewMode,
  onRefresh,
  onOpenCreateModal,
}) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div className="navbar-brand">
          <div className="brand-icon-wrapper">
            <BookOpen size={22} className="brand-icon" />
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">MY LIFE NOTES</h1>
            </div>
            <p className="brand-subtitle">Capture thoughts, ideas & daily memories</p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="navbar-controls">
          <div
            className={`server-status-pill ${serverOnline ? 'status-online' : 'status-offline'}`}
            title={serverOnline ? 'Backend API connected' : 'Backend API connecting or offline'}
          >
            <span className="status-dot"></span>
            <span className="status-label">
              {serverOnline ? 'Backend Online' : 'Connecting / Offline'}
            </span>
          </div>

          <button
            type="button"
            className="icon-tool-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh notes from server"
          >
            <RefreshCw size={17} className={isRefreshing ? 'spin-icon' : ''} />
          </button>

          {/* View Mode Switcher */}
          <div className="view-mode-toggle" role="group" aria-label="View Mode">
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'grid' ? 'toggle-active' : ''}`}
              onClick={() => onToggleViewMode('grid')}
              title="Card Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'list' ? 'toggle-active' : ''}`}
              onClick={() => onToggleViewMode('list')}
              title="Compact List View"
              aria-label="List View"
            >
              <List size={16} />
            </button>
          </div>

          {/* New Note Button */}
          <button
            type="button"
            className="btn btn-primary btn-new-note"
            onClick={onOpenCreateModal}
          >
            <Plus size={18} className="mr-1" />
            <span>New Note</span>
          </button>
        </div>
      </div>
    </header>
  );
}
