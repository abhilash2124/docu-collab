from fastapi import FastAPI

from .database import engine, Base
from . import models
from .auth import router as auth_router
from .routers.documents import router as documents_router
from .routers.sharing import router as sharing_router
from fastapi.middleware.cors import CORSMiddleware
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title = "DocuCollab API",
    description = "Backend API for the Ajaia AI-Native Full Stack assessment",
    version = "1.0.0",
)

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(sharing_router)
app.include_router(documents_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the DocuCollab API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}