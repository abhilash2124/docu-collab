# DocuCollab — Ajaia Assessment Submission

## Candidate

Abhilash Addagatla

## Project

DocuCollab - lightweight Google Docs-style document editor with document sharing.

## Live Links

### Application

https://docu-collab.vercel.app

### Backend API

https://docu-collab.onrender.com

### API Documentation

https://docu-collab.onrender.com/docs

## Project Summary

DocuCollab is a full-stack document editor that supports authenticated document creation, editing, rich-text formatting, persistence, `.txt` file import, and document sharing.

The application uses:

- React + Vite for the frontend
- FastAPI for the backend
- SQLAlchemy for database access
- PostgreSQL hosted on Neon
- JWT authentication
- Tiptap for rich-text editing
- Vercel for frontend deployment
- Render for backend deployment

## Implemented Requirements

### 1. Document Management

Implemented:

- Create documents
- Rename documents
- Edit documents
- Save documents
- Reopen saved documents
- Persistent storage

### 2. Rich Text

Implemented:

- Bold
- Italic
- Underline
- Heading levels
- Bulleted lists
- Numbered lists
- Persistent formatted document content

### 3. File Upload

Implemented:

- `.txt` file upload
- Uploaded text is converted into an editable document
- Unsupported file types are rejected

### 4. Sharing

Implemented:

- Document owner
- Share document with another registered user
- Owned documents displayed separately from shared documents
- Shared users can view shared documents
- Shared users cannot edit the document

### 5. Authentication

Implemented:

- User registration
- User login
- JWT authentication
- Protected document endpoints
- Password hashing

### 6. Persistence

Production persistence uses PostgreSQL hosted on Neon.

Document data and sharing information survive browser refreshes and application restarts.

## Testing

An automated test is included at:

```text
backend/tests/test_documents.py
```

Run:

```bash
cd backend
python -m pytest -v
```

The test verifies that the documents endpoint requires authentication.

Additional manual testing was performed for:

- Registration
- Login
- Document creation
- Document editing
- Rich-text formatting
- Save and reopen
- `.txt` import
- Document sharing
- Shared document access
- Production frontend/backend communication

## Deployment

### Frontend

Hosted on Vercel:

https://docu-collab.vercel.app

### Backend

Hosted on Render:

https://docu-collab.onrender.com

### Database

Hosted on Neon PostgreSQL.

## Local Setup

### Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

### Frontend

In another terminal:

```bash
cd frontend

npm install
npm run dev
```

### Local URLs

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

## Environment Variables

### Backend

```text
DATABASE_URL=<PostgreSQL connection string>
SECRET_KEY=<JWT secret>
FRONTEND_URL=<frontend URL>
```

### Frontend

```text
VITE_API_URL=<backend API URL>
```

Production secrets are not included in the repository.

## Test Accounts

The deployed application supports registration of test users through the registration page.

For security, passwords and production secrets are not included in this submission document.

For evaluator testing, two accounts can be created using the registration flow and then used to verify document sharing.

Suggested test emails:

```text
owner@example.com
viewer@example.com
```

These are example addresses only; create the accounts through the application before testing.

## Architecture

```text
Browser
   |
   v
React + Vite
   |
   | HTTPS / REST API
   v
FastAPI
   |
   | SQLAlchemy
   v
Neon PostgreSQL
```

More detailed architecture information is available in:

```text
ARCHITECTURE.md
```

## AI Workflow

AI was used as a development assistant for:

- Requirement decomposition
- Architecture planning
- Initial code generation
- Debugging
- Deployment troubleshooting
- Testing guidance
- Documentation assistance

Generated suggestions were verified by running the application, testing API endpoints, running automated tests, and validating the deployed application.

More details are available in:

```text
AI_WORKFLOW.md
```

## Scope and Trade-offs

The implementation focuses on the core assessment requirements.

The following advanced features are outside the current scope:

- Real-time simultaneous editing
- WebSocket-based collaboration
- Comments
- Document version history
- Conflict resolution
- Advanced permission roles

Shared users currently have read-only access.

The supported file import format is `.txt`.

## Walkthrough Video

Video URL:

```text
TO_BE_ADDED
```

The walkthrough demonstrates:

1. Registration/login
2. Dashboard
3. Creating a document
4. Rich-text formatting
5. Saving and reopening
6. `.txt` import
7. Sharing with another user
8. Viewing a shared document
9. Deployed application

## Source Code

The complete source code is included with the submission.

The source package excludes:

- `.git`
- `node_modules`
- Python virtual environments
- Python cache files
- Local database files
- Environment files containing secrets

## Screenshots / Demo Evidence

Screenshots demonstrating the following workflows are included with the submission:

- Login/dashboard
- Rich-text editor
- Document persistence
- File import
- Document sharing
- Production deployment

## Known Limitations

- Shared users are read-only
- No real-time multi-user editing
- No comments or version history
- `.txt` is the supported import format
- Basic sharing permissions

## Next Steps

Potential future improvements:

- WebSocket-based real-time collaboration
- Conflict resolution using CRDT or operational transformation
- Document version history
- Comments and mentions
- More granular sharing permissions
- Expanded automated test coverage
- Database migrations with Alembic
- Additional document import formats