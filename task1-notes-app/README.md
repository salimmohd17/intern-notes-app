# 📝 MY LIFE NOTES — Notes Application (Task 1)

> **Full Stack Development**  
> **Mode:** Remote / Online | **Duration:** 4 Weeks (Self-Paced) | **Deadline:** 06 November 2026

An end-to-end, full-stack Notes Application featuring client-server CRUD operations, instant search filtering, responsive card and list views, category organization, note pinning, color theming, and SQLite database persistence.

---

## 🚀 Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Fast HMR, modular component architecture, Lucide icons |
| **Styling** | Modern CSS | Responsive Grid/Flexbox, custom color palettes, glassmorphism |
| **Backend** | Node.js + Express | RESTful API, structured route & controller separation, Morgan logger |
| **Database** | SQLite (`node:sqlite`) | Zero-config, persistent file-based SQL engine with WAL mode |
| **State Sync** | React Hooks & Async Fetch | Instant UI updates, real-time debounced search, graceful toasts |

---

## ✨ Core Features & Specifications

- **Full CRUD Operations**: Create, read, update, and delete notes with immediate backend synchronization.
- **Persistent Storage**: All notes and metadata survive server restarts inside `database/notes.db`.
- **Instant Search Filtering**: Real-time filtering across note titles and content simultaneously with search match highlighting.
- **Category Taxonomy**: Filter by categories (`Work`, `Study`, `Personal`, `Ideas`, `Urgent`) or dynamically create custom categories.
- **Note Pinning**: Pin crucial notes to an exclusive top section.
- **Card Color Theming**: 8 customizable pastel color themes for organizing notes visually.
- **Dual View Modes**: Switch between responsive Card Grid view and compact List view.
- **Graceful Error & Toast System**: Network failures, validation errors, and success operations trigger non-intrusive animated toast alerts.
- **Offline Detection**: Live backend health indicator with warning banner if server is unreachable.
- **Keyboard Shortcuts**:
  - Press `/` or `Ctrl + K` to focus search.
  - Press `c` to open new note modal (when not typing).
  - Press `Ctrl + Enter` to quickly save in modal.
  - Press `Escape` to close modals.

---

## 📁 Project Architecture & Folder Structure

```text
task1-notes-app/
├── backend/
│   ├── database/
│   │   ├── schema.sql        # Database table definitions and indexes
│   │   ├── seed.js           # Database seeder with realistic sample notes
│   │   └── notes.db          # Auto-generated SQLite database file
│   ├── src/
│   │   ├── controllers/
│   │   │   └── notesController.js  # Business logic & CRUD handlers
│   │   ├── routes/
│   │   │   └── notes.js            # Express API endpoint definitions
│   │   ├── db.js                   # SQLite connection & schema initializer
│   │   └── server.js               # Express server entry point & middleware
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryFilter.jsx  # Category pills & count badges
│   │   │   ├── EmptyState.jsx      # Clean states for empty/search
│   │   │   ├── Footer.jsx          # App footer with copyright & BMS Techs button
│   │   │   ├── Navbar.jsx          # Header, server status & view toggle
│   │   │   ├── NoteCard.jsx        # Responsive note card (Grid & List)
│   │   │   ├── NoteModal.jsx       # Create/Edit modal with validation
│   │   │   ├── SearchBar.jsx       # Instant search with clear button
│   │   │   ├── StatsBar.jsx        # Metrics and status bar
│   │   │   └── Toast.jsx           # Animated toast notifications
│   │   ├── services/
│   │   │   └── api.js              # Centralized API client & network handler
│   │   ├── App.jsx                 # Main state coordinator
│   │   ├── App.css                 # Responsive stylesheet
│   │   ├── index.css               # Global tokens & base reset
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database Schema (`database/schema.sql`)

```sql
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  is_pinned INTEGER DEFAULT 0,
  color TEXT DEFAULT '#ffffff',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notes_title ON notes(title);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
```

---

## 📡 RESTful API Contract

| Method | Endpoint | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck & server status | None |
| `GET` | `/api/notes` | Get notes (supports search & filter) | `?search=term&category=Work&pinned=1` |
| `GET` | `/api/notes/categories` | Retrieve all distinct categories | None |
| `GET` | `/api/notes/:id` | Fetch single note by ID | None |
| `POST` | `/api/notes` | Create a new note | `{ title, content, category, color, is_pinned }` |
| `PUT` | `/api/notes/:id` | Update an existing note | `{ title, content, category, color, is_pinned }` |
| `PATCH`| `/api/notes/:id/pin`| Toggle pinned state | None |
| `DELETE`| `/api/notes/:id` | Delete note permanently | None |

---

## 🛠️ Local Setup & Execution Guide

### Prerequisites
- **Node.js** (v18.x or newer, v22+ recommended)
- **npm** (v9.x or newer)

---

### Step 1: Start Backend Server & Seed Database

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd task1-notes-app/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database with sample notes:
   ```bash
   npm run seed
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server runs on **`http://localhost:5000`**.*

---

### Step 2: Start Frontend Application

1. Open a second terminal and navigate to the frontend folder:
   ```bash
   cd task1-notes-app/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

### Root Quick Scripts (From Repository Root)

From the project root directory, you can also run:
```bash
# Seed Task 1 SQLite database
npm run seed:task1

# Start Task 1 Backend
npm run backend:task1

# Start Task 1 Frontend
npm run frontend:task1
```

---

## 🧪 Testing & Acceptance Criteria Verification

- [x] **Client & Server Synchronization**: Creating or editing notes in the UI issues immediate REST requests and updates both the SQLite database and client views.
- [x] **Live Search & Filter**: Searching by title or content instantly filters cards and highlights matching terms.
- [x] **Card / List View Toggle**: Adapts flawlessly across desktop, tablet, and mobile displays.
- [x] **Network Failure & Error Handling**: If the backend is shut down, the UI displays a persistent connection warning and triggers toast alerts rather than crashing.
- [x] **Server-Side Validation**: Empty titles or contents are rejected with status 400 and user-friendly error messages.
- [x] **Zero Paid Tooling**: 100% free local stack using SQLite, Express, and React.
