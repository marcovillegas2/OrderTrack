from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.schemas.orden_schema import (
    OrderCreate,
    OrderResponse
)

from app.services.orden_service import (
    register_order,
    list_orders
)

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post(
    "/orders/create",
    response_model=OrderResponse
)
def create_order_endpoint(
    order: OrderCreate,
    db: Annotated[Session, Depends(get_db)]
):

    return register_order(
        db,
        order.customer_name,
        order.product_name,
        order.quantity,
        order.address,
        order.operator_id
    )


@router.get(
    "/orders",
    response_model=list[OrderResponse]
)
def get_orders_endpoint(
    db: Annotated[Session, Depends(get_db)]
):

    return list_orders(db)