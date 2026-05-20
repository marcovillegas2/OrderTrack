import uuid

from app.tests.test_setup import client


def test_create_user():

    unique_username = f"user_{uuid.uuid4().hex[:8]}"

    response = client.post(
        "/users/create",
        json={"username": unique_username, "password": "1234", "role": "operador"},
    )

    assert response.status_code == 200


def test_login():

    username = f"user_{uuid.uuid4().hex[:8]}"

    client.post(
        "/users/create",
        json={"username": username, "password": "1234", "role": "operador"},
    )

    response = client.post("/login", json={"username": username, "password": "1234"})

    assert response.status_code == 200

    data = response.json()

    assert data["role"] == "operador"
