import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import StatsBar from './components/StatsBar';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import EmptyState from './components/EmptyState';
import ToastContainer from './components/Toast';
import { notesApi } from './services/api';
import { Pin, FileText, AlertTriangle, Trash2 } from 'lucide-react';
import './App.css';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [serverOnline, setServerOnline] = useState(true);

  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create',
    note: null,
  });

  // Delete Confirmation Dialog State
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    noteId: null,
    noteTitle: '',
  });

  // Toast Notifications State
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, title = '') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch Categories
  const loadCategories = useCallback(async () => {
    try {
      const res = await notesApi.getCategories();
      if (res && res.data) {
        setCategories(res.data);
      }
    } catch {
      // Ignored; categories will fallback to existing notes
    }
  }, []);

  // Fetch Notes from API
  const loadNotes = useCallback(async (search = searchQuery, category = selectedCategory) => {
    try {
      const res = await notesApi.getAllNotes({
        search,
        category: category === 'All' ? '' : category,
      });
      if (res && res.data) {
        setNotes(res.data);
        setServerOnline(true);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setServerOnline(false);
      addToast(
        'error',
        err.message || 'Could not fetch notes from server. Check if backend is running.',
        'Connection Issue'
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery, selectedCategory, addToast]);

  // Initial Load
  useEffect(() => {
    loadNotes();
    loadCategories();
  }, []);

  // Periodic health check
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await notesApi.checkHealth();
        setServerOnline(true);
      } catch {
        setServerOnline(false);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut: Press 'c' to create note when not typing
  useEffect(() => {
    const handleKey = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setModalState({ isOpen: true, mode: 'create', note: null });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Handle Search Input Change with real-time fetch
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    loadNotes(value, selectedCategory);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadNotes('', selectedCategory);
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    loadNotes(searchQuery, cat);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    loadNotes('', 'All');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNotes(searchQuery, selectedCategory);
    await loadCategories();
    addToast('info', 'Notes refreshed from database', 'Synchronized');
  };

  // CRUD Handlers
  const handleCreateNote = async (payload) => {
    try {
      const res = await notesApi.createNote(payload);
      if (res && res.data) {
        setNotes((prev) => [res.data, ...prev]);
        setModalState({ isOpen: false, mode: 'create', note: null });
        loadCategories();
        addToast('success', 'New note was saved to SQLite database.', 'Note Created');
      }
    } catch (err) {
      addToast('error', err.message || 'Failed to create note.', 'Error');
      throw err;
    }
  };

  const handleUpdateNote = async (payload) => {
    if (!modalState.note) return;
    try {
      const res = await notesApi.updateNote(modalState.note.id, payload);
      if (res && res.data) {
        setNotes((prev) =>
          prev.map((n) => (n.id === modalState.note.id ? res.data : n))
        );
        setModalState({ isOpen: false, mode: 'edit', note: null });
        loadCategories();
        addToast('success', 'Note updated successfully in database.', 'Note Saved');
      }
    } catch (err) {
      addToast('error', err.message || 'Failed to update note.', 'Error');
      throw err;
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const res = await notesApi.togglePin(id);
      if (res && res.data) {
        setNotes((prev) =>
          prev.map((n) => (n.id === id ? res.data : n)).sort((a, b) => {
            if (b.is_pinned !== a.is_pinned) return b.is_pinned - a.is_pinned;
            return new Date(b.updated_at) - new Date(a.updated_at);
          })
        );
        addToast(
          'info',
          res.data.is_pinned ? 'Note pinned to top' : 'Note unpinned',
          'Status Changed'
        );
      }
    } catch (err) {
      addToast('error', err.message || 'Failed to toggle pin status.', 'Error');
    }
  };

  const promptDeleteNote = (id) => {
    const target = notes.find((n) => n.id === id);
    setDeleteConfirm({
      isOpen: true,
      noteId: id,
      noteTitle: target ? target.title : 'this note',
    });
  };

  const confirmDeleteNote = async () => {
    const { noteId } = deleteConfirm;
    if (!noteId) return;
    try {
      await notesApi.deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      setDeleteConfirm({ isOpen: false, noteId: null, noteTitle: '' });
      loadCategories();
      addToast('success', 'Note removed from SQLite database.', 'Note Deleted');
    } catch (err) {
      addToast('error', err.message || 'Failed to delete note.', 'Error');
    }
  };

  // Group notes into pinned and unpinned
  const pinnedNotes = useMemo(() => notes.filter((n) => Boolean(n.is_pinned)), [notes]);
  const otherNotes = useMemo(() => notes.filter((n) => !Boolean(n.is_pinned)), [notes]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: notes.length };
    notes.forEach((n) => {
      const cat = n.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [notes]);

  // Available unique categories
  const allUniqueCategories = useMemo(() => {
    const set = new Set([...categories, ...notes.map((n) => n.category || 'General')]);
    return Array.from(set).filter(Boolean);
  }, [categories, notes]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'All';

  return (
    <div className="app-shell">
      <Navbar
        serverOnline={serverOnline}
        isRefreshing={isRefreshing}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onRefresh={handleRefresh}
        onOpenCreateModal={() => setModalState({ isOpen: true, mode: 'create', note: null })}
      />

      <main className="main-content">
        {/* Offline Warning Banner */}
        {!serverOnline && (
          <div className="offline-alert-banner">
            <AlertTriangle size={18} className="banner-icon" />
            <div className="banner-content">
              <strong>Backend Disconnected:</strong> Could not reach the Node.js Express server on port 5000. Changes may fail to persist until the server is running.
            </div>
            <button type="button" className="banner-retry-btn" onClick={handleRefresh}>
              Retry Connection
            </button>
          </div>
        )}

        {/* Search & Stats Section */}
        <section className="search-filter-section">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClear={handleClearSearch}
            resultCount={notes.length}
          />

          <CategoryFilter
            categories={allUniqueCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            categoryCounts={categoryCounts}
          />

          <StatsBar
            totalNotes={notes.length}
            pinnedCount={pinnedNotes.length}
            categoryCount={allUniqueCategories.length}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
            notes={notes}
          />
        </section>

        {/* Content Section */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading notes from SQLite database...</p>
          </div>
        ) : notes.length === 0 ? (
          <EmptyState
            isSearching={hasActiveFilters}
            onResetFilters={handleResetFilters}
            onOpenCreateModal={() => setModalState({ isOpen: true, mode: 'create', note: null })}
          />
        ) : (
          <div className="notes-container">
            {/* Pinned Notes Section */}
            {pinnedNotes.length > 0 && (
              <section className="notes-group-section">
                <div className="section-header-row">
                  <div className="section-title-wrap">
                    <Pin size={16} className="text-amber fill-current" />
                    <h2 className="section-title">Pinned Notes ({pinnedNotes.length})</h2>
                  </div>
                </div>
                <div className={`notes-layout ${viewMode === 'list' ? 'layout-list' : 'layout-grid'}`}>
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      viewMode={viewMode}
                      searchQuery={searchQuery}
                      onEdit={(n) => setModalState({ isOpen: true, mode: 'edit', note: n })}
                      onDelete={promptDeleteNote}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Other Notes Section */}
            {otherNotes.length > 0 && (
              <section className="notes-group-section">
                {pinnedNotes.length > 0 && (
                  <div className="section-header-row mt-6">
                    <div className="section-title-wrap">
                      <FileText size={16} className="text-muted" />
                      <h2 className="section-title">Other Notes ({otherNotes.length})</h2>
                    </div>
                  </div>
                )}
                <div className={`notes-layout ${viewMode === 'list' ? 'layout-list' : 'layout-grid'}`}>
                  {otherNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      viewMode={viewMode}
                      searchQuery={searchQuery}
                      onEdit={(n) => setModalState({ isOpen: true, mode: 'edit', note: n })}
                      onDelete={promptDeleteNote}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Floating Add Note Action for Mobile */}
      <button
        type="button"
        className="floating-fab-btn"
        onClick={() => setModalState({ isOpen: true, mode: 'create', note: null })}
        title="Create new note (Shortcut: 'c')"
      >
        +
      </button>

      {/* Note Create / Edit Modal */}
      <NoteModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        initialData={modalState.note}
        availableCategories={allUniqueCategories}
        onClose={() => setModalState({ isOpen: false, mode: 'create', note: null })}
        onSubmit={modalState.mode === 'create' ? handleCreateNote : handleUpdateNote}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm({ isOpen: false, noteId: null, noteTitle: '' })}>
          <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-wrap">
              <Trash2 size={24} className="text-danger" />
            </div>
            <h3 className="confirm-title">Delete Note?</h3>
            <p className="confirm-desc">
              Are you sure you want to delete <strong>"{deleteConfirm.noteTitle}"</strong>? This will permanently remove it from the SQLite database.
            </p>
            <div className="confirm-btn-row">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteConfirm({ isOpen: false, noteId: null, noteTitle: '' })}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDeleteNote}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
