from app.tests.test_setup import (
    client,
    cleanup_test_data
)

TEST_PASSWORD = "safe_test_password"

def test_create_user():

    cleanup_test_data()

    response = client.post(
        "/users/create",
        json={
            "username": "test_operator_user",
            "password": TEST_PASSWORD,
            "role": "operador"
        },
    )

    assert response.status_code == 200

    cleanup_test_data()


def test_login():

    cleanup_test_data()

    client.post(
        "/users/create",
        json={
            "username": "test_operator_user",
            "password": TEST_PASSWORD,
            "role": "operador"
        },
    )

    response = client.post(
        "/login",
        json={
            "username": "test_operator_user",
            "password": TEST_PASSWORD
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["role"] == "operador"

    cleanup_test_data()