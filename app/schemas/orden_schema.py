from enum import Enum
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class OrderStatus(str, Enum):
    PENDIENTE = "Pendiente"
    ENVIADO = "Enviado"
    ENTREGADO = "Entregado"
    CANCELADO = "Cancelado"


class OrderCreate(BaseModel):
    customer_name: str
    product_name: str
    quantity: int
    address: str


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderResponse(BaseModel):
    id: int
    customer_name: str
    product_name: str
    quantity: int
    address: str
    status: str
    operator_id: int | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
