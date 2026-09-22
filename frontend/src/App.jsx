import { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import "./index.css";

const API_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      onLogin();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>DocuCollab</h1>
        <p>Collaborative documents, made simple.</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="error">{error}</div>}

        <button type="submit">Sign in</button>

        <button
          type="button"
          className="secondary"
          onClick={() => navigate("/register")}
        >
          Create account
        </button>
      </form>
    </div>
  );
}


function Register({ onLogin }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      onLogin();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="error">{error}</div>}

        <button type="submit">Create account</button>

        <button
          type="button"
          className="secondary"
          onClick={() => navigate("/")}
        >
          Back to login
        </button>
      </form>
    </div>
  );
}


function Dashboard() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [shared, setShared] = useState([]);
  const [error, setError] = useState("");

  async function loadDocuments() {
    try {
      const [mine, sharedDocs] = await Promise.all([
        api.get("/documents"),
        api.get("/documents/shared"),
      ]);

      setDocuments(mine.data);
      setShared(sharedDocs.data);
    } catch (err) {
      setError("Unable to load documents.");
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function createDocument() {
    try {
      const response = await api.post("/documents", {
        title: "Untitled Document",
        content: "",
      });

      navigate(`/editor/${response.data.id}`);
    } catch {
      setError("Could not create document.");
    }
  }

  async function importFile(e) {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(
        "/documents/import",
        formData
      );

      navigate(`/editor/${response.data.id}`);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Import failed."
      );
    }

    e.target.value = "";
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="dashboard">
      <header className="topbar">
        <div>
          <strong>DocuCollab</strong>
        </div>

        <button onClick={logout} className="secondary">
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-heading">
          <div>
            <h1>Your documents</h1>
            <p>Create, edit and share documents.</p>
          </div>

          <div className="actions">
            <button onClick={createDocument}>
              + New Document
            </button>

            <label className="upload-button">
              Import .txt
              <input
                type="file"
                accept=".txt"
                onChange={importFile}
                hidden
              />
            </label>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <section>
          <h2>My Documents</h2>

          <div className="document-grid">
            {documents.length === 0 ? (
              <div className="empty">
                No documents yet.
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  className="document-card"
                  key={doc.id}
                  onClick={() => navigate(`/editor/${doc.id}`)}
                >
                  <h3>{doc.title}</h3>
                  <p>
                    {doc.content
                      ?.replace(/<[^>]*>/g, "")
                      .slice(0, 100) || "Empty document"}
                  </p>
                  <span>Owned by you</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2>Shared With Me</h2>

          <div className="document-grid">
            {shared.length === 0 ? (
              <div className="empty">
                No shared documents.
              </div>
            ) : (
              shared.map((doc) => (
                <div
                  className="document-card shared-card"
                  key={doc.id}
                  onClick={() => navigate(`/editor/${doc.id}`)}
                >
                  <h3>{doc.title}</h3>
                  <p>
                    {doc.content
                      ?.replace(/<[^>]*>/g, "")
                      .slice(0, 100)}
                  </p>
                  <span>Shared with you</span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}


function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: "",
  });

  useEffect(() => {
    async function loadDocument() {
      try {
        const response = await api.get(`/documents/${id}`);

        setTitle(response.data.title);

        editor?.commands.setContent(
          response.data.content || ""
        );
      } catch (err) {
        setMessage("Unable to load document.");
      }
    }

    if (editor) {
      loadDocument();
    }
  }, [id, editor]);

  async function saveDocument() {
    if (!editor) return;

    setSaving(true);
    setMessage("");

    try {
      await api.put(`/documents/${id}`, {
        title: title || "Untitled Document",
        content: editor.getHTML(),
      });

      setMessage("Saved");
    } catch {
      setMessage("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function shareDocument() {
    if (!email) {
      setMessage("Enter an email address.");
      return;
    }

    try {
      await api.post(`/documents/${id}/share`, {
        email,
      });

      setMessage("Document shared successfully.");
      setEmail("");
    } catch (err) {
      setMessage(
        err.response?.data?.detail || "Sharing failed."
      );
    }
  }

  if (!editor) return null;

  return (
    <div className="editor-page">
      <header className="editor-topbar">
        <button
          className="secondary"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Document"
        />

        <button onClick={saveDocument}>
          {saving ? "Saving..." : "Save"}
        </button>
      </header>

      <div className="toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold") ? "active" : ""
          }
        >
          B
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          className={
            editor.isActive("italic") ? "active" : ""
          }
        >
          I
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleUnderline().run()
          }
          className={
            editor.isActive("underline") ? "active" : ""
          }
        >
          U
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          • List
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          1. List
        </button>
      </div>

      <main className="editor-container">
        <div className="paper">
          <EditorContent editor={editor} />
        </div>
      </main>

      <aside className="share-panel">
        <h3>Share document</h3>

        <div className="share-row">
          <input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={shareDocument}>
            Share
          </button>
        </div>

        {message && <div className="status">{message}</div>}
      </aside>
    </div>
  );
}


function ProtectedRoute({ children }) {
  return localStorage.getItem("token") ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
}


function App() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            loggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={() => setLoggedIn(true)} />
            )
          }
        />

        <Route
          path="/register"
          element={
            <Register onLogin={() => setLoggedIn(true)} />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;