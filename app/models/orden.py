from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, UTC
from app.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    product_name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    address = Column(String, nullable=False)
    status = Column(String, default="Pendiente")
    operator_id = Column(Integer, nullable=True, default=None)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))