from pydantic import BaseModel
from datetime import datetime

class OrderCreate(BaseModel):
    customer_name: str
    product_name: str
    quantity: int
    address: str

class OrderResponse(BaseModel):
    id: int
    customer_name: str
    product_name: str
    quantity: int
    address: str
    status: str
    operator_id: int | None = None
    created_at: datetime

    class Config:
        from_attributes = True