from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_documents_require_authentication():
    response = client.get("/documents")

    assert response.status_code in [401, 403]