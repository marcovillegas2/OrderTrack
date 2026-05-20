from sqlalchemy.orm import Session
from app.models.orden import Order


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
