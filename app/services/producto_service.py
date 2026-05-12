from sqlalchemy.orm import Session

from app.repositories.producto_repository import (
    create_product,
    get_all_products,
    get_product_by_id,
    delete_product
)

def register_product(db: Session, name: str, price: float):

    return create_product(
        db,
        name,
        price
    )

def list_products(db: Session):

    return get_all_products(db)

def remove_product(db: Session, product_id: int):

    product = get_product_by_id(
        db,
        product_id
    )

    if not product:
        return "not_found"

    delete_product(
        db,
        product
    )

    return "deleted"