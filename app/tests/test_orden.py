from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_create_order():

    response = client.post(
        "/orders/create",
        json={
            "customer_name": "Carlos",
            "product_name": "Pizza",
            "quantity": 2,
            "address": "Av. Lima 123",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["customer_name"] == "Carlos"

    assert data["status"] == "Pendiente"


def test_valid_status_transition():

    create_response = client.post(
        "/orders/create",
        json={
            "customer_name": "Ana",
            "product_name": "Hamburguesa",
            "quantity": 1,
            "address": "Av. Perú 555",
        },
    )

    order_id = create_response.json()["id"]

    response = client.put(f"/orders/{order_id}/status", json={"status": "Enviado"})

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "Enviado"


def test_invalid_status_transition():

    create_response = client.post(
        "/orders/create",
        json={
            "customer_name": "Luis",
            "product_name": "Pollo Broaster",
            "quantity": 1,
            "address": "Av. Norte 222",
        },
    )

    order_id = create_response.json()["id"]

    client.put(f"/orders/{order_id}/status", json={"status": "Enviado"})

    client.put(f"/orders/{order_id}/status", json={"status": "Entregado"})

    response = client.put(f"/orders/{order_id}/status", json={"status": "Pendiente"})

    assert response.status_code == 400


def test_valid_cancel_transition():

    create_response = client.post(
        "/orders/create",
        json={
            "customer_name": "Mario",
            "product_name": "Pizza Familiar",
            "quantity": 1,
            "address": "Av. Central 777",
        },
    )

    order_id = create_response.json()["id"]

    response = client.put(f"/orders/{order_id}/status", json={"status": "Cancelado"})

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "Cancelado"


def test_invalid_cancel_transition():

    create_response = client.post(
        "/orders/create",
        json={
            "customer_name": "Lucía",
            "product_name": "Salchipapa",
            "quantity": 1,
            "address": "Av. Sol 888",
        },
    )

    order_id = create_response.json()["id"]

    client.put(f"/orders/{order_id}/status", json={"status": "Enviado"})

    response = client.put(f"/orders/{order_id}/status", json={"status": "Cancelado"})

    assert response.status_code == 400
