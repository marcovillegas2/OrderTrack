from sqlalchemy.orm import Session

from app.repositories.producto_repository import (
    create_product,
    get_all_products
)

def register_product(db: Session, name: str, price: float):

    return create_product(
        db,
        name,
        price
    )

def list_products(db: Session):

    return get_all_products(db)