from sqlalchemy.orm import Session

from app.repositories.orden_repository import (
    create_order,
    get_orders
)


def register_order(
    db: Session,
    customer_name: str,
    product_name: str,
    quantity: int,
    address: str,
    operator_id: int
):

    return create_order(
        db,
        customer_name,
        product_name,
        quantity,
        address,
        operator_id
    )


def list_orders(db: Session):

    return get_orders(db)