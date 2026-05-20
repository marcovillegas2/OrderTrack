from sqlalchemy.orm import Session
from app.repositories.usuario_repository import (
    create_user,
    get_user_by_username,
    get_all_users,
    get_operators,
    get_user_by_id,
    delete_user,
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


def list_operators(db: Session):

    return get_operators(db)


def remove_operator(db: Session, user_id: int):

    user = get_user_by_id(db, user_id)

    if not user:
        return "not_found"

    if user.role == "admin":
        return "admin"

    delete_user(db, user)

    return "deleted"
