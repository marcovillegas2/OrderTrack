from sqlalchemy.orm import Session
from app.models.orden import Order

from app.constants import (
    STATUS_PENDING,
    STATUS_SENT,
    STATUS_DELIVERED,
    STATUS_CANCELLED,
)

def create_order(
    db: Session, customer_name: str, product_name: str, quantity: int, address: str
):
    new_order = Order(
        customer_name=customer_name,
        product_name=product_name,
        quantity=quantity,
        address=address,
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order


def get_orders(db: Session):
    return db.query(Order).all()


def get_orders_stats(db):

    orders = get_orders(db)

    stats = {
        "total": len(orders),

        "pending": 0,

        "sent": 0,

        "delivered": 0,

        "cancelled": 0,
    }

    for order in orders:

        if order.status == STATUS_PENDING:
            stats["pending"] += 1

        elif order.status == STATUS_SENT:
            stats["sent"] += 1

        elif order.status == STATUS_DELIVERED:
            stats["delivered"] += 1

        elif order.status == STATUS_CANCELLED:
            stats["cancelled"] += 1

    return stats


def get_order_by_id(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()


def update_order_status(db: Session, order: Order, status: str):
    order.status = status
    db.commit()
    db.refresh(order)
    return order


def delete_order(db: Session, order: Order):
    db.delete(order)
    db.commit()