from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.schemas.producto_schema import ProductCreate

from app.services.producto_service import (
    register_product,
    list_products,
    remove_product
)

router = APIRouter()

def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/products/create")
def create_product(
    product: ProductCreate,
    db: Annotated[Session, Depends(get_db)]
):

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
def get_products(
    db: Annotated[Session, Depends(get_db)]
):

    return list_products(db)

@router.delete("/products/{product_id}")
def delete_product_endpoint(
    product_id: int,
    db: Annotated[Session, Depends(get_db)]
):

    result = remove_product(
        db,
        product_id
    )

    if result == "not_found":

        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado"
        )

    return {
        "message": "Producto eliminado correctamente"
    }