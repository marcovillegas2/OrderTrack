from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_get_orders_stats():

    response = client.get(
        "/orders/stats"
    )

    assert response.status_code == 200

    data = response.json()

    assert "total" in data
    assert "pending" in data
    assert "sent" in data
    assert "delivered" in data
    assert "cancelled" in data

def test_create_order():

    response = client.post(
        "/orders/create",
        json={
            "customer_name": "Carlos",
            "product_name": "Pizza",
            "quantity": 2,
            "address": "Av Lima 123"
        }
    )

    assert response.status_code == 200

def test_valid_status_transition():

    create_response = client.post(
        "/orders/create",
        json={
            "customer_name": "Ana",
            "product_name": "Hamburguesa",
            "quantity": 1,
            "address": "Calle Norte"
        }
    )

    order = create_response.json()

    response = client.put(
        f"/orders/{order['id']}/status",
        json={
            "status": "Enviado"
        }
    )

    assert response.status_code == 200

def test_invalid_status_transition():

    create_response = client.post(
        "/orders/create",
        json={
            "customer_name": "Luis",
            "product_name": "Pollo",
            "quantity": 1,
            "address": "Av Peru"
        }
    )

    order = create_response.json()

    client.put(
        f"/orders/{order['id']}/status",
        json={
            "status": "Entregado"
        }
    )

    response = client.put(
        f"/orders/{order['id']}/status",
        json={
            "status": "Pendiente"
        }
    )

    assert response.status_code == 400

def test_delete_delivered_order_blocked():

    create_response = client.post(
        "/orders/create",
        json={
            "customer_name": "Mario",
            "product_name": "Salchipapa",
            "quantity": 1,
            "address": "Av Central"
        }
    )

    order = create_response.json()

    client.put(
        f"/orders/{order['id']}/status",
        json={
            "status": "Enviado"
        }
    )

    client.put(
        f"/orders/{order['id']}/status",
        json={
            "status": "Entregado"
        }
    )

    response = client.delete(
        f"/orders/{order['id']}"
    )

    assert response.status_code == 400

def test_create_order_with_zero_quantity():

    response = client.post(
        "/orders/create",
        json={
            "customer_name": "Carlos",
            "product_name": "Pizza",
            "quantity": 0,
            "address": "Av Lima"
        }
    )

    assert response.status_code == 422

def test_create_order_with_valid_quantity():

    response = client.post(
        "/orders/create",
        json={
            "customer_name": "Mario",
            "product_name": "Hamburguesa",
            "quantity": 2,
            "address": "Av Perú"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["quantity"] == 2

def test_search_orders_by_customer_name():

    client.post(
        "/orders/create",
        json={
            "customer_name": "Andrea",
            "product_name": "Pizza",
            "quantity": 1,
            "address": "Av Norte"
        }
    )

    response = client.get("/orders")

    data = response.json()

    matching_orders = [
        order
        for order in data
        if "Andrea" in order["customer_name"]
    ]

    assert len(matching_orders) > 0

def test_orders_stats_percentages():

    response = client.get(
        "/orders/stats"
    )

    assert response.status_code == 200

    data = response.json()

    assert "pending_percentage" in data
    assert "sent_percentage" in data
    assert "delivered_percentage" in data
    assert "cancelled_percentage" in data