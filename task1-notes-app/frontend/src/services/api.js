const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to handle fetch responses & network errors uniformly
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.error || `Server responded with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach backend server. Please verify port 5000 is active.');
    }
    throw error;
  }
}

export const notesApi = {
  // Fetch all notes with optional search & category
  getAllNotes: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.pinned !== undefined && params.pinned !== '') query.append('pinned', params.pinned);

    const qs = query.toString();
    return request(`/notes${qs ? `?${qs}` : ''}`);
  },

  // Get single note
  getNoteById: (id) => request(`/notes/${id}`),

  // Create note
  createNote: (noteData) =>
    request('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    }),

  // Update note
  updateNote: (id, noteData) =>
    request(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    }),

  // Delete note
  deleteNote: (id) =>
    request(`/notes/${id}`, {
      method: 'DELETE',
    }),

  // Toggle pin
  togglePin: (id) =>
    request(`/notes/${id}/pin`, {
      method: 'PATCH',
    }),

  // Get categories
  getCategories: () => request('/notes/categories'),

  // Health check
  checkHealth: () => request('/health'),
};
