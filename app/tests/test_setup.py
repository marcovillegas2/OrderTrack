from fastapi.testclient import TestClient

from app.main import app

from app.database import SessionLocal

from app.models.usuario import User
from app.models.producto import Product
from app.models.orden import Order

client = TestClient(app)


def cleanup_test_data():

    db = SessionLocal()

    try:

        db.query(Order).filter(
            Order.customer_name.like("test_%")
        ).delete()

        db.query(Product).filter(
            Product.name.like("TEST_%")
        ).delete()

        db.query(User).filter(
            User.username.like("test_%")
        ).delete()

        db.commit()

    finally:

        db.close()