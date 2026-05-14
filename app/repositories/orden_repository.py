from sqlalchemy.orm import Session

from app.models.orden import Order


def create_order(
    db: Session,
    customer_name: str,
    product_name: str,
    quantity: int,
    address: str,
    operator_id: int
):

    new_order = Order(
        customer_name=customer_name,
        product_name=product_name,
        quantity=quantity,
        address=address,
        operator_id=operator_id
    )

    db.add(new_order)

    db.commit()

    db.refresh(new_order)

    return new_order


def get_orders(db: Session):

    return db.query(Order).all()