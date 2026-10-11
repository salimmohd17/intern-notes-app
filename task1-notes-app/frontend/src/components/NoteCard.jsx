import React, { useState } from 'react';
import { Pin, Edit3, Trash2, Copy, Check, Clock, Calendar } from 'lucide-react';

export default function NoteCard({
  note,
  viewMode = 'grid',
  searchQuery = '',
  onEdit,
  onDelete,
  onTogglePin,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Highlight search matches
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="search-highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const isList = viewMode === 'list';

  return (
    <article
      className={`note-card ${isList ? 'note-card-list' : 'note-card-grid'} ${
        note.is_pinned ? 'is-pinned' : ''
      }`}
      style={{
        backgroundColor: note.color || '#ffffff',
      }}
    >
      <div className="note-card-header">
        <div className="note-meta-badges">
          <span className="category-pill">{note.category || 'General'}</span>
          {Boolean(note.is_pinned) && (
            <span className="pinned-badge" title="Pinned Note">
              <Pin size={12} className="fill-current" /> Pinned
            </span>
          )}
        </div>

        <div className="note-card-actions">
          <button
            type="button"
            className={`action-btn pin-btn ${note.is_pinned ? 'active-pin' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note.id);
            }}
            title={note.is_pinned ? 'Unpin note' : 'Pin note to top'}
            aria-label={note.is_pinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin size={16} />
          </button>
          <button
            type="button"
            className="action-btn copy-btn"
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy note content'}
            aria-label="Copy note"
          >
            {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
          </button>
          <button
            type="button"
            className="action-btn edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            title="Edit note"
            aria-label="Edit note"
          >
            <Edit3 size={16} />
          </button>
          <button
            type="button"
            className="action-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            title="Delete note"
            aria-label="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="note-card-body" onClick={() => onEdit(note)}>
        <h3 className="note-title">{highlightMatch(note.title, searchQuery)}</h3>
        <p className="note-content">{highlightMatch(note.content, searchQuery)}</p>
      </div>

      <div className="note-card-footer">
        <span className="note-date" title={`Created: ${formatDate(note.created_at)}`}>
          <Clock size={12} />
          {formatDate(note.updated_at || note.created_at)}
        </span>
        <button
          type="button"
          className="quick-edit-link"
          onClick={() => onEdit(note)}
        >
          View / Edit →
        </button>
      </div>
    </article>
  );
}
