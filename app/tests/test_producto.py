from app.tests.test_setup import client

def test_create_product():

    response = client.post(
        "/products/create",
        json={
            "name": "Producto Test",
            "price": 10.5
        }
    )

    assert response.status_code == 200

def test_get_products():

    response = client.get("/products")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)