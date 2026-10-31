import React, { useState, useEffect } from 'react';
import { X, Check, Pin, Tag, Palette } from 'lucide-react';

const COLOR_PALETTE = [
  { name: 'Warm White', value: '#ffffff' },
  { name: 'Amber Soft', value: '#fef3c7' },
  { name: 'Blue Sky', value: '#dbeafe' },
  { name: 'Mint Green', value: '#dcfce7' },
  { name: 'Purple Dream', value: '#f3e8ff' },
  { name: 'Rose Petal', value: '#fee2e2' },
  { name: 'Peach Orange', value: '#ffedd5' },
  { name: 'Teal Mist', value: '#ccfbf1' },
];

export default function NoteModal({
  isOpen,
  mode = 'create', // 'create' | 'edit'
  initialData = null,
  availableCategories = [],
  onClose,
  onSubmit,
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [customCategory, setCustomCategory] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [isPinned, setIsPinned] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData && mode === 'edit') {
        setTitle(initialData.title || '');
        setContent(initialData.content || '');
        setCategory(initialData.category || 'General');
        setColor(initialData.color || '#ffffff');
        setIsPinned(Boolean(initialData.is_pinned));
      } else {
        setTitle('');
        setContent('');
        setCategory('General');
        setCustomCategory('');
        setColor('#ffffff');
        setIsPinned(false);
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, initialData, mode]);

  // Handle escape key to close and Ctrl+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(e);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, title, content, category, customCategory, color, isPinned]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Title cannot be empty.';
    }
    if (!content.trim()) {
      errs.content = 'Content cannot be empty.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const finalCategory = category === '__custom__' ? customCategory.trim() || 'General' : category;

    const payload = {
      title: title.trim(),
      content: content.trim(),
      category: finalCategory,
      color,
      is_pinned: isPinned ? 1 : 0,
    };

    try {
      await onSubmit(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        style={{ backgroundColor: color }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-heading">
            {mode === 'create' ? ' Create New Note' : ' Edit Note'}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="note-title" className="form-label">
              Title <span className="required-star">*</span>
            </label>
            <input
              id="note-title"
              type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g. CodeNova Internship Task Milestones"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
              autoFocus
            />
            {errors.title && <span className="field-error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <div className="content-label-row">
              <label htmlFor="note-content" className="form-label">
                Content <span className="required-star">*</span>
              </label>
              <span className="char-count">{content.length} characters</span>
            </div>
            <textarea
              id="note-content"
              rows={7}
              className={`form-textarea ${errors.content ? 'input-error' : ''}`}
              placeholder="Write your note markdown or thoughts here..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors((prev) => ({ ...prev, content: null }));
              }}
            />
            {errors.content && <span className="field-error-text">{errors.content}</span>}
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label flex-align">
                <Tag size={14} className="mr-1" /> Category
              </label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {['General', 'Work', 'Study', 'Personal', 'Ideas', 'Urgent'].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                {availableCategories
                  .filter((c) => !['General', 'Work', 'Study', 'Personal', 'Ideas', 'Urgent'].includes(c))
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                <option value="__custom__">+ Custom Category...</option>
              </select>

              {category === '__custom__' && (
                <input
                  type="text"
                  placeholder="Enter new category name..."
                  className="form-input mt-2"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  autoFocus
                />
              )}
            </div>

            <div className="form-group flex-align-center">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="custom-checkbox"
                />
                <span className="checkbox-text flex-align">
                  <Pin size={14} className="mr-1" /> Pin to top
                </span>
              </label>
            </div>
          </div>

          {/* Color Picker Palette */}
          <div className="form-group">
            <label className="form-label flex-align">
              <Palette size={14} className="mr-1" /> Note Card Color Theme
            </label>
            <div className="color-palette-grid">
              {COLOR_PALETTE.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  className={`color-swatch ${color === item.value ? 'selected-swatch' : ''}`}
                  style={{ backgroundColor: item.value }}
                  onClick={() => setColor(item.value)}
                  title={item.name}
                >
                  {color === item.value && <Check size={14} className="color-check-icon" />}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <span className="modal-hint">Press Ctrl+Enter to save</span>
            <div className="modal-btn-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Note' : 'Update Note'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
