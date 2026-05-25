from app.tests.test_setup import (
    client,
    cleanup_test_data
)


def test_get_orders_stats():

    cleanup_test_data()

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

    cleanup_test_data()


def test_create_order():

    cleanup_test_data()

    response = client.post(
        "/orders/create",
        json={
            "customer_name": "test_carlos",
            "product_name": "Pizza",
            "quantity": 2,
            "address": "Av Lima 123"
        }
    )

    assert response.status_code == 200

    cleanup_test_data()


def test_valid_status_transition():

    cleanup_test_data()

    create_response = client.post(
        "/orders/create",
        json={
            "customer_name": "test_ana",
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

    cleanup_test_data()


def test_invalid_status_transition():

    cleanup_test_data()

    create_response = client.post(
        "/orders/create",
        json={
            "customer_name": "test_luis",
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

    cleanup_test_data()


def test_delete_delivered_order_blocked():

    cleanup_test_data()

    create_response = client.post(
        "/orders/create",
        json={
            "customer_name": "test_mario",
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

    cleanup_test_data()