from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.schemas.producto_schema import ProductCreate

from app.services.producto_service import (
    register_product,
    list_products
)

router = APIRouter()

def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

@router.post("/products/create")
def create_product(product: ProductCreate,
                   db: Session = Depends(get_db)):

    new_product = register_product(
        db,
        product.name,
        product.price
    )

    return {
        "message": "Producto creado correctamente",
        "product": {
            "name": new_product.name,
            "price": new_product.price
        }
    }

@router.get("/products")
def get_products(db: Session = Depends(get_db)):

    return list_products(db)