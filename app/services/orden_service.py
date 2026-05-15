from sqlalchemy.orm import Session

from app.repositories.orden_repository import (
    create_order,
    get_orders,
    get_order_by_id,
    update_order_status
)

from app.schemas.orden_schema import OrderStatus


def register_order(
    db: Session,
    customer_name: str,
    product_name: str,
    quantity: int,
    address: str
):
    return create_order(
        db,
        customer_name,
        product_name,
        quantity,
        address
    )


def list_orders(db: Session):
    return get_orders(db)


def change_order_status(
    db: Session,
    order_id: int,
    new_status: str
):
    order = get_order_by_id(db, order_id)

    if not order:
        return "not_found"

    current_status = order.status

    allowed_transitions = {
        "Pendiente": ["Enviado", "Cancelado"],
        "Enviado": ["Entregado"],
        "Entregado": [],
        "Cancelado": []
    }

    if new_status == current_status:
        return "same_status"

    if new_status not in allowed_transitions.get(current_status, []):
        return "invalid_transition"

    updated_order = update_order_status(db, order, new_status)
    return updated_order