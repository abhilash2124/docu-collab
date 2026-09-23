# AI Workflow

## 1. Overview

AI tools were used as development assistance during the DocuCollab assessment.

AI was primarily used for:

- Breaking the assessment requirements into smaller implementation tasks
- Planning the application architecture
- Generating initial code and implementation suggestions
- Explaining unfamiliar framework concepts and syntax
- Diagnosing development and deployment errors
- Reviewing configuration and deployment requirements
- Suggesting testing and documentation approaches

The generated output was treated as development assistance rather than automatically accepted as final code.

## 2. Architecture Planning

The assessment requirements were divided into:

1. Authentication
2. Document management
3. Rich-text editing
4. File import
5. Document sharing
6. Database persistence
7. Automated testing
8. Deployment
9. Documentation and walkthrough

The resulting architecture was:

```text
React + Vite
      |
      | REST API
      v
FastAPI
      |
      | SQLAlchemy
      v
PostgreSQL
```

The frontend was deployed to Vercel, the backend to Render, and PostgreSQL was hosted using Neon.

## 3. Code Generation Assistance

AI was used to help generate initial implementations for parts of the application, including:

- FastAPI application structure
- SQLAlchemy database configuration
- Database models
- Pydantic schemas
- JWT authentication
- Document API routes
- Sharing API routes
- React application structure
- Tiptap editor integration
- API calls using Axios
- Deployment configuration

The generated code was then run locally and tested through the application, API documentation, and automated tests.

## 4. Debugging and Iteration

AI assistance was useful while debugging implementation issues.

### API Route Conflict

The document and sharing routers contained overlapping routes.

The dynamic route:

```text
/documents/{document_id}
```

could interfere with:

```text
/documents/shared
```

The router registration order was adjusted so the specific `/documents/shared` route was registered before the dynamic document route.

The result was verified through the FastAPI Swagger interface and the deployed application.

### Python Environment Issues

The development environment initially encountered dependency and Python-version issues.

The environment was recreated using Python 3.13 and the required dependencies were installed again.

Automated tests were then run successfully.

### Production Dependency Issue

The initial `requirements.txt` was generated from the development environment using `pip freeze`.

This included many unrelated packages, including scientific Python packages.

During Render deployment, the unnecessary dependencies caused a build failure involving SciPy and a missing Fortran compiler.

The dependency list was reviewed and replaced with a minimal production requirements file containing only the packages required by the backend.

The backend was then redeployed successfully.

### Test Environment Issue

The test environment also required `pytest` and `httpx`.

These dependencies were installed in the development environment and the automated test was rerun successfully.

## 5. Verification Process

AI-generated suggestions were not considered verified until they were tested.

Verification was performed using:

- Local FastAPI server
- FastAPI Swagger documentation
- Browser testing
- React production build
- Pytest
- Render deployment logs
- Vercel deployment
- Production application testing

The production application was tested through:

https://docu-collab.vercel.app

The backend API was tested through:

https://docu-collab.onrender.com/docs

## 6. Changes Made After Verification

Implementation details were changed during development after testing exposed issues.

Examples include:

- Adjusting FastAPI router registration order
- Configuring CORS using an environment variable
- Using an environment variable for the JWT secret
- Replacing the oversized development `requirements.txt`
- Recreating the Python virtual environment
- Configuring the frontend API URL through `VITE_API_URL`
- Adding the Vercel SPA rewrite configuration
- Separating the production frontend and backend deployments

These changes were made based on actual application behavior and deployment results.

## 7. AI and Human Responsibility

AI was used as a development assistant, but the implementation was tested manually and through automated checks.

The final decisions about:

- Application scope
- Technology stack
- Deployment architecture
- Error fixes
- Configuration
- Feature behavior
- Testing
- Documentation

were made during the development process and verified against the running application.

The final implementation should therefore be considered an AI-assisted development workflow rather than an unverified generated code submission.

## 8. Limitations of the AI Workflow

AI assistance can produce code that appears correct but does not necessarily work in the actual project environment.

For this project, several issues demonstrated the importance of verification, including:

- API route behavior
- Dependency and environment problems
- Production dependency bloat
- Deployment configuration
- Frontend/backend configuration

For this reason, generated suggestions were followed by actual execution and testing before being treated as part of the final implementation.

## 9. Summary

AI assisted the development process with architecture planning, implementation, debugging, and documentation.

The development workflow was:

```text
Assessment Requirements
        |
        v
AI-assisted planning
        |
        v
Implementation
        |
        v
Run and test
        |
        v
Identify issues
        |
        v
Modify implementation
        |
        v
Retest
        |
        v
Deploy
        |
        v
Verify production application
```