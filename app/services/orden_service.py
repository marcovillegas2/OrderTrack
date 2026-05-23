from sqlalchemy.orm import Session

from app.constants import (
    STATUS_PENDING,
    STATUS_SENT,
    STATUS_DELIVERED,
    STATUS_CANCELLED,
)

from app.repositories.orden_repository import (
    create_order,
    get_orders,
    get_order_by_id,
    update_order_status,
    delete_order,
    get_orders_stats,
)

VALID_TRANSITIONS = {
    STATUS_PENDING: [
        STATUS_SENT,
        STATUS_CANCELLED,
    ],
    STATUS_SENT: [
        STATUS_DELIVERED,
    ],
    STATUS_DELIVERED: [],
    STATUS_CANCELLED: [],
}


def register_order(
    db: Session,
    customer_name: str,
    product_name: str,
    quantity: int,
    address: str,
):

    return create_order(
        db,
        customer_name,
        product_name,
        quantity,
        address,
    )


def list_orders(db: Session):

    return get_orders(db)


def change_order_status(
    db: Session,
    order_id: int,
    new_status: str,
):

    order = get_order_by_id(db, order_id)

    if not order:
        return "not_found"

    current_status = order.status

    if new_status == current_status:
        return "same_status"

    allowed_statuses = VALID_TRANSITIONS.get(current_status, [])

    if new_status not in allowed_statuses:
        return "invalid_transition"

    return update_order_status(
        db,
        order,
        new_status,
    )


def remove_order(
    db: Session,
    order_id: int,
):

    order = get_order_by_id(db, order_id)

    if not order:
        return "not_found"

    if order.status == STATUS_DELIVERED:
        return "cannot_delete"

    delete_order(db, order)

    return "deleted"


def get_dashboard_stats(db: Session):

    return get_orders_stats(db)