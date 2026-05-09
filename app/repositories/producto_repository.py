from sqlalchemy.orm import Session
from app.models.producto import Product

def create_product(db: Session, name: str, price: float):

    product = Product(
        name=name,
        price=price
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product

def get_all_products(db: Session):

    return db.query(Product).all()