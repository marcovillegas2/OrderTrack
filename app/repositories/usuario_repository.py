from sqlalchemy.orm import Session
from app.models.usuario import User

def create_user(db: Session, username: str, password: str, role: str):
    user = User(
        username=username,
        password=password,
        role=role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_all_users(db: Session):
    return db.query(User).all()

def get_operators(db: Session):

    return db.query(User).filter(
        User.role == "operador"
    ).all()


def get_user_by_id(db: Session, user_id: int):

    return db.query(User).filter(
        User.id == user_id
    ).first()


def delete_user(db: Session, user: User):

    db.delete(user)

    db.commit()