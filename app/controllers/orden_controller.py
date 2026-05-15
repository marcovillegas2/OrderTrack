from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated

from app.database import SessionLocal
from app.schemas.orden_schema import OrderCreate, OrderResponse, OrderStatusUpdate
from app.services.orden_service import (
    register_order,
    list_orders,
    change_order_status
)

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/orders/create", response_model=OrderResponse)
def create_order_endpoint(
    order: OrderCreate,
    db: Annotated[Session, Depends(get_db)]
):
    return register_order(
        db,
        order.customer_name,
        order.product_name,
        order.quantity,
        order.address
    )


@router.get(
    "/orders",
    response_model=list[OrderResponse]
)
def get_orders_endpoint(
    db: Annotated[Session, Depends(get_db)]
):

    return list_orders(db)


@router.put("/orders/{order_id}/status")
def update_order_status_endpoint(
    order_id: int,
    status_data: OrderStatusUpdate,
    db: Annotated[Session, Depends(get_db)]
):
    result = change_order_status(
        db,
        order_id,
        status_data.status.value
    )

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Pedido no encontrado"
        )

    if result == "same_status":
        raise HTTPException(
            status_code=400,
            detail="El pedido ya tiene ese estado"
        )

    if result == "invalid_transition":
        raise HTTPException(
            status_code=400,
            detail="Transición de estado no permitida"
        )

    return {
        "message": "Estado actualizado correctamente",
        "order_id": result.id,
        "status": result.status
    }