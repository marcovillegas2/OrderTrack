from sqlalchemy.orm import Session
from app.repositories.usuario_repository import (
    create_user,
    get_user_by_username,
    get_all_users
)

def register_user(db: Session, username: str, password: str, role: str):

    existing_user = get_user_by_username(db, username)

    if existing_user:
        return None

    return create_user(db, username, password, role)

def login_user(db: Session, username: str, password: str):

    user = get_user_by_username(db, username)

    if not user:
        return None

    if user.password != password:
        return None

    return user

def list_users(db: Session):
    return get_all_users(db)