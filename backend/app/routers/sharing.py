from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..database import get_db
from ..models import Document, DocumentShare, User
from ..schemas import ShareDocumentRequest, SharedDocumentResponse


router = APIRouter(
    prefix="/documents",
    tags=["Sharing"],
)


@router.post("/{document_id}/share")
def share_document(
    document_id: int,
    share_data: ShareDocumentRequest,
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

    recipient = (
        db.query(User)
        .filter(User.email == share_data.email.lower())
        .first()
    )

    if recipient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with this email does not exist",
        )

    if recipient.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot share a document with yourself",
        )

    existing_share = (
        db.query(DocumentShare)
        .filter(
            DocumentShare.document_id == document_id,
            DocumentShare.user_id == recipient.id,
        )
        .first()
    )

    if existing_share:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document is already shared with this user",
        )

    share = DocumentShare(
        document_id=document_id,
        user_id=recipient.id,
    )

    db.add(share)
    db.commit()

    return {
        "message": "Document shared successfully",
        "shared_with": recipient.email,
    }


@router.get(
    "/shared",
    response_model=list[SharedDocumentResponse],
)
def get_shared_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    shared_documents = (
        db.query(Document)
        .join(
            DocumentShare,
            DocumentShare.document_id == Document.id,
        )
        .filter(DocumentShare.user_id == current_user.id)
        .order_by(Document.updated_at.desc())
        .all()
    )

    return shared_documents