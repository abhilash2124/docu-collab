from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..database import get_db
from ..models import Document, DocumentShare, User
from ..schemas import DocumentCreate, DocumentResponse, DocumentUpdate


router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


# Create a new document
@router.post(
    "",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_document(
    document_data: DocumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = Document(
        title=document_data.title.strip() or "Untitled Document",
        content=document_data.content,
        owner_id=current_user.id,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document


# Get all documents owned by the current user
@router.get(
    "",
    response_model=list[DocumentResponse],
)
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    documents = (
        db.query(Document)
        .filter(Document.owner_id == current_user.id)
        .order_by(Document.updated_at.desc())
        .all()
    )

    return documents


# Import a .txt file as a new document
@router.post(
    "/import",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def import_text_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File name is required",
        )

    if not file.filename.lower().endswith(".txt"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only .txt files are supported",
        )

    try:
        file_content = await file.read()
        content = file_content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The file must be a valid UTF-8 text file",
        )

    title = file.filename.rsplit(".", 1)[0].strip()

    document = Document(
        title=title or "Imported Document",
        content=content,
        owner_id=current_user.id,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document


# Get a single document
# Owner OR user with sharing access can open it
@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    # Owner has access
    if document.owner_id == current_user.id:
        return document

    # Shared user has access
    shared_access = (
        db.query(DocumentShare)
        .filter(
            DocumentShare.document_id == document_id,
            DocumentShare.user_id == current_user.id,
        )
        .first()
    )

    if shared_access is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this document",
        )

    return document


# Update a document
# Only the owner can edit it
@router.put(
    "/{document_id}",
    response_model=DocumentResponse,
)
def update_document(
    document_id: int,
    document_data: DocumentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.owner_id == current_user.id,
        )
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    document.title = (
        document_data.title.strip() or "Untitled Document"
    )
    document.content = document_data.content

    db.commit()
    db.refresh(document)

    return document