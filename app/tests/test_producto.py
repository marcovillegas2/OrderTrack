from app.tests.test_setup import (
    client,
    cleanup_test_data
)


def test_create_product():

    cleanup_test_data()

    response = client.post(
        "/products/create",
        json={
            "name": "TEST_PRODUCT",
            "price": 10.5
        }
    )

    assert response.status_code == 200

    cleanup_test_data()


def test_get_products():

    cleanup_test_data()

    client.post(
        "/products/create",
        json={
            "name": "TEST_PRODUCT",
            "price": 10.5
        }
    )

    response = client.get("/products")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)

    cleanup_test_data()