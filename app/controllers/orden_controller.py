from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated

from app.database import SessionLocal
from app.schemas.orden_schema import OrderCreate, OrderResponse, OrderStatusUpdate
from app.constants import (
    ORDER_NOT_FOUND,
    SAME_STATUS,
    INVALID_TRANSITION,
    CANNOT_DELETE_DELIVERED,
)

from app.services.orden_service import (
    register_order,
    list_orders,
    change_order_status,
    remove_order,
    get_dashboard_stats,
)

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/orders/create", response_model=OrderResponse)
def create_order_endpoint(order: OrderCreate, db: Annotated[Session, Depends(get_db)]):
    return register_order(
        db, order.customer_name, order.product_name, order.quantity, order.address
    )


@router.get("/orders", response_model=list[OrderResponse])
def get_orders_endpoint(db: Annotated[Session, Depends(get_db)]):

    return list_orders(db)


@router.put("/orders/{order_id}/status",
    responses={
        400: {"description": "Transición inválida"},
        404: {"description": "Pedido no encontrado"},
    },
)

def update_order_status_endpoint(
    order_id: int,
    status_data: OrderStatusUpdate,
    db: Annotated[Session, Depends(get_db)],
):
    result = change_order_status(db, order_id, status_data.status.value)

    if result == "not_found":
        raise HTTPException(status_code=404, detail=ORDER_NOT_FOUND)

    if result == "same_status":
        raise HTTPException(status_code=400, detail=SAME_STATUS)

    if result == "invalid_transition":
        raise HTTPException(status_code=400, detail=INVALID_TRANSITION)

    return {
        "message": "Estado actualizado correctamente",
        "order_id": result.id,
        "status": result.status,
    }


@router.delete(
    "/orders/{order_id}",
    responses={
        400: {"description": "No se puede eliminar pedido entregado"},
        404: {"description": "Pedido no encontrado"},
    },
)

def delete_order_endpoint(order_id: int, db: Annotated[Session, Depends(get_db)]):
    result = remove_order(db, order_id)

    if result == "not_found":
        raise HTTPException(status_code=404, detail=ORDER_NOT_FOUND)

    if result == "cannot_delete":
        raise HTTPException(status_code=400, detail=CANNOT_DELETE_DELIVERED)

    return {"message": "Pedido eliminado correctamente"}


@router.get("/orders/stats")
def orders_stats(db: Annotated[Session, Depends(get_db)]):
    return get_dashboard_stats(db)