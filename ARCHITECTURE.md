# DocuCollab Architecture

## 1. Overview

DocuCollab is a lightweight full-stack document editor built with a React frontend, FastAPI backend, and PostgreSQL database.

The application is deployed as three main components:

```text
┌──────────────────────────────┐
│          User Browser        │
└──────────────┬───────────────┘
               │
               │ HTTPS
               ▼
┌──────────────────────────────┐
│       React + Vite           │
│          Vercel              │
│                              │
│  Login / Dashboard / Editor  │
└──────────────┬───────────────┘
               │
               │ REST API
               │ JWT
               ▼
┌──────────────────────────────┐
│          FastAPI             │
│           Render             │
│                              │
│ Authentication               │
│ Documents                    │
│ Sharing                      │
│ File Import                  │
└──────────────┬───────────────┘
               │
               │ SQLAlchemy
               ▼
┌──────────────────────────────┐
│       PostgreSQL             │
│           Neon               │
│                              │
│ Users                        │
│ Documents                    │
│ Document Shares              │
└──────────────────────────────┘
```

## 2. Frontend Architecture

The frontend is implemented using React and Vite.

Main responsibilities:

- User registration and login
- JWT token storage and authentication state
- Document dashboard
- Owned document listing
- Shared document listing
- Document editor
- Rich-text formatting
- `.txt` file upload
- Document sharing
- API communication

### Main frontend flow

```text
Login/Register
      |
      v
Authentication Token
      |
      v
Dashboard
      |
      ├── Create Document
      ├── Import .txt
      ├── Open Document
      └── View Shared Documents
                    |
                    v
                 Editor
                    |
                    ├── Edit
                    ├── Format
                    ├── Save
                    └── Share
```

The frontend uses Axios to communicate with the FastAPI backend.

The production API URL is provided through:

```text
VITE_API_URL
```

## 3. Rich Text Editing

The editor uses Tiptap with StarterKit and the Underline extension.

The implemented formatting includes:

- Bold
- Italic
- Underline
- Heading 1
- Heading 2
- Bullet lists
- Ordered lists

The editor stores the document content as HTML.

When a document is saved:

```text
Tiptap Editor
     |
     v
HTML content
     |
     v
PUT /documents/{document_id}
     |
     v
FastAPI
     |
     v
PostgreSQL
```

When the document is reopened, the stored HTML is loaded back into the editor.

## 4. Backend Architecture

The backend uses FastAPI.

The application is divided into several responsibilities:

```text
backend/app/

main.py
|
├── Application configuration
├── CORS configuration
└── Router registration

auth.py
|
├── Password hashing
├── Password verification
├── JWT creation
└── Current-user authentication

database.py
|
├── Database configuration
├── SQLAlchemy engine
├── Session management
└── Database dependency

models.py
|
├── User
├── Document
└── DocumentShare

schemas.py
|
└── Request/response validation

routers/
├── documents.py
└── sharing.py
```

## 5. API Design

The backend exposes REST APIs.

### Authentication

```text
POST /auth/register
POST /auth/login
```

Registration creates a user and returns an access token.

Login verifies the user's credentials and returns a JWT access token.

### Documents

```text
GET  /documents
POST /documents
GET  /documents/{document_id}
PUT  /documents/{document_id}
POST /documents/import
```

These endpoints support document creation, retrieval, editing, and `.txt` import.

### Sharing

```text
POST /documents/{document_id}/share
GET  /documents/shared
```

The owner can share a document with another registered user.

Shared users can retrieve the document but cannot modify it.

## 6. Authentication and Authorization

Authentication uses JWT tokens.

The general flow is:

```text
User Login
    |
    v
FastAPI verifies password
    |
    v
JWT generated
    |
    v
Frontend stores token
    |
    v
Token sent with protected API requests
    |
    v
FastAPI validates token
    |
    v
Current user identified
```

Authorization is checked at the document level.

For example:

- Owners can edit their documents.
- Owners can share their documents.
- Shared users can view documents they have been granted access to.
- Users cannot access unrelated private documents.

## 7. Database Design

The application uses three main tables.

### Users

```text
users
├── id
├── name
├── email
└── password_hash
```

### Documents

```text
documents
├── id
├── title
├── content
├── owner_id
├── created_at
└── updated_at
```

`owner_id` references the user who owns the document.

### Document Shares

```text
document_shares
├── id
├── document_id
└── user_id
```

This table represents access granted to another registered user.

Relationship:

```text
User
 |
 ├────────────── owns ──────────────> Document
 |                                      |
 |                                      |
 └─────── shared access ─────────> DocumentShare
                                        |
                                        └──> Document
```

## 8. File Import Flow

The current implementation supports `.txt` files.

```text
User selects .txt file
        |
        v
Frontend uploads file
        |
        v
POST /documents/import
        |
        v
FastAPI validates extension
        |
        v
File decoded as UTF-8
        |
        v
New Document created
        |
        v
PostgreSQL
        |
        v
Document returned to frontend
```

Unsupported file extensions are rejected.

## 9. Persistence

Production data is stored in PostgreSQL hosted by Neon.

The backend reads the database connection string from:

```text
DATABASE_URL
```

SQLAlchemy is used as the ORM and database abstraction layer.

For local development, the application can use SQLite when no PostgreSQL `DATABASE_URL` is provided.

## 10. Deployment Architecture

### Frontend

```text
GitHub
   |
   v
Vercel
   |
   v
https://docu-collab.vercel.app
```

### Backend

```text
GitHub
   |
   v
Render
   |
   v
https://docu-collab.onrender.com
```

### Database

```text
FastAPI / SQLAlchemy
          |
          v
      Neon PostgreSQL
```

The frontend communicates with the deployed backend over HTTPS.

## 11. CORS

The backend uses FastAPI's CORS middleware.

The allowed frontend origin is controlled by:

```text
FRONTEND_URL
```

Local development uses:

```text
http://localhost:5173
```

Production uses:

```text
https://docu-collab.vercel.app
```

## 12. Error Handling and Validation

The application performs validation at multiple layers.

Examples include:

- Required registration fields
- Email validation
- Minimum password length
- Duplicate email detection
- Authentication validation
- Document existence checks
- Document ownership checks
- Shared-access checks
- `.txt` file extension validation
- Duplicate sharing prevention
- Preventing users from sharing a document with themselves

The backend returns appropriate HTTP errors for invalid or unauthorized operations.

## 13. Testing

A basic automated test is included under:

```text
backend/tests/test_documents.py
```

The current test verifies that the documents endpoint cannot be accessed without authentication.

Run:

```bash
cd backend
python -m pytest -v
```

Manual testing was also performed against the deployed application for the main user flows.

## 14. Engineering Trade-offs

The assessment required a lightweight implementation within a limited time window.

The implementation therefore prioritizes the core document workflow over advanced collaboration infrastructure.

Not implemented:

- Real-time simultaneous editing
- WebSockets
- Comments
- Version history
- Conflict resolution
- Advanced role management

Shared users currently have read-only access.

These limitations are intentional scope decisions.

## 15. Security Considerations

The application avoids committing secrets to the repository.

Production configuration is supplied through environment variables.

Important production variables include:

```text
DATABASE_URL
SECRET_KEY
FRONTEND_URL
VITE_API_URL
```

Passwords are stored as password hashes rather than plaintext passwords.

JWT authentication is used for protected API endpoints.

## 16. Future Improvements

Potential improvements include:

- Real-time collaboration using WebSockets
- Operational transformation or CRDT-based editing
- Document version history
- Comments and mentions
- More granular sharing permissions
- More comprehensive automated tests
- Database migrations using Alembic
- Improved file import support
- Richer document management
- Automated CI/CD testing