# DocuCollab

DocuCollab is a lightweight Google Docs-style document editor with document sharing, built for the Ajaia AI-Native Full Stack Developer assessment.

## Live Application

Frontend: https://docu-collab.vercel.app

Backend API: https://docu-collab.onrender.com

API Documentation: https://docu-collab.onrender.com/docs

## Features

- User registration and login
- JWT-based authentication
- Create documents
- Rename documents
- Rich-text editing
- Bold, italic and underline formatting
- Heading levels
- Bulleted lists
- Numbered lists
- Save and reopen documents
- Import `.txt` files as editable documents
- Share documents with another registered user
- Separate owned and shared documents
- Persistent PostgreSQL storage
- Protected document access
- Basic validation and error handling

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tiptap
- HTML/CSS

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT authentication
- bcrypt
- Uvicorn

### Database

- PostgreSQL
- Neon

### Deployment

- Vercel — frontend
- Render — backend
- Neon — PostgreSQL database

## Architecture

```text
React + Vite
     |
     | HTTPS / REST API
     v
FastAPI
     |
     | SQLAlchemy
     v
PostgreSQL (Neon)
```

The frontend communicates with the FastAPI backend through REST APIs. Authentication uses JWT access tokens. The backend controls document ownership and sharing permissions before returning or modifying document data.

## Document Access

There are two document categories.

### Owned Documents

The authenticated user can:

- View
- Edit
- Rename
- Save
- Share

### Shared Documents

A user who has been granted access can:

- View the document

The current implementation intentionally keeps shared users read-only.

## File Import

The application supports `.txt` file imports.

The uploaded text file is read by the backend and converted into a new editable document.

Unsupported file types are rejected.

## API Overview

### Authentication

```text
POST /auth/register
POST /auth/login
```

### Documents

```text
GET    /documents
POST   /documents
GET    /documents/{document_id}
PUT    /documents/{document_id}
POST   /documents/import
```

### Sharing

```text
POST /documents/{document_id}/share
GET  /documents/shared
```

## Local Development

### Prerequisites

- Python 3.13+
- Node.js and npm
- PostgreSQL or SQLite for local development

### Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

The backend will run at:

`http://127.0.0.1:8000`

Swagger API documentation:

`http://127.0.0.1:8000/docs`

### Frontend

Open another terminal:

```bash
cd frontend

npm install
npm run dev
```

The frontend will normally run at:

`http://localhost:5173`

## Environment Variables

### Backend

```text
DATABASE_URL=<PostgreSQL connection string>
SECRET_KEY=<JWT secret>
FRONTEND_URL=http://localhost:5173
```

For production, `FRONTEND_URL` should contain the deployed frontend URL.

### Frontend

```text
VITE_API_URL=http://localhost:8000
```

For production:

```text
VITE_API_URL=https://docu-collab.onrender.com
```

Secrets should be provided through environment variables and should not be committed to the repository.

## Testing

A basic automated test verifies that the documents endpoint requires authentication.

Run:

```bash
cd backend
python -m pytest -v
```

The test suite currently verifies:

```text
GET /documents without authentication
```

and expects an authentication-related HTTP response.

Manual testing was also performed for:

- Registration
- Login
- Document creation
- Document editing
- Rich-text formatting
- Saving and reopening
- `.txt` import
- Document sharing
- Shared-document access
- Production frontend/backend communication

## Deployment

### Frontend

The React application is deployed on Vercel.

https://docu-collab.vercel.app

### Backend

The FastAPI application is deployed on Render.

https://docu-collab.onrender.com

### Database

The production database uses PostgreSQL hosted by Neon.

## Scope and Trade-offs

This implementation focuses on the core assessment requirements rather than building a full production-grade Google Docs replacement.

Current limitations include:

- No real-time simultaneous editing
- No WebSocket-based collaboration
- No comments
- No document version history
- Shared users currently have read-only access
- `.txt` is the supported import format
- Basic authentication and sharing model

These choices keep the implementation lightweight and focused on the required functionality within the assessment time limit.

## Project Structure

```text
docu-collab/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vercel.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   └── routers/
│   │       ├── documents.py
│   │       └── sharing.py
│   │
│   ├── tests/
│   │   └── test_documents.py
│   │
│   └── requirements.txt
│
├── README.md
├── ARCHITECTURE.md
├── AI_WORKFLOW.md
└── SUBMISSION.md
```

## Assessment Deliverables

The final submission includes:

- Source code
- README
- Architecture documentation
- AI workflow documentation
- Submission notes
- Live application URL
- API documentation URL
- Walkthrough video URL
- Screenshots/demo evidence

## Author

Abhilash Addagatla