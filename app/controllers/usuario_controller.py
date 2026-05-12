from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.schemas.usuario_schema import UserCreate, UserLogin

from app.services.usuario_service import (
    register_user,
    login_user,
    list_users,
    list_operators,
    remove_operator
)

router = APIRouter()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post(
    "/users/create",
    responses={
        400: {"description": "El usuario ya existe"}
    }
)
def create_operator(
    user: UserCreate,
    db: Annotated[Session, Depends(get_db)]
):

    new_user = register_user(
        db,
        user.username,
        user.password,
        user.role
    )

    if not new_user:
        raise HTTPException(
            status_code=400,
            detail="El usuario ya existe"
        )

    return {
        "message": "Usuario creado correctamente"
    }


@router.post(
    "/login",
    responses={
        401: {"description": "Credenciales incorrectas"}
    }
)
def login(
    user: UserLogin,
    db: Annotated[Session, Depends(get_db)]
):

    logged_user = login_user(
        db,
        user.username,
        user.password
    )

    if not logged_user:
        raise HTTPException(
            status_code=401,
            detail="Credenciales incorrectas"
        )

    return {
        "message": "Login exitoso",
        "role": logged_user.role
    }

@router.get("/users")
def get_users(
    db: Annotated[Session, Depends(get_db)]
):

    return list_users(db)

@router.get("/operators")
def get_operators(
    db: Annotated[Session, Depends(get_db)]
):

    return list_operators(db)

@router.delete("/operators/{user_id}")
def delete_operator(
    user_id: int,
    db: Annotated[Session, Depends(get_db)]
):

    result = remove_operator(
        db,
        user_id
    )

    if result == "not_found":

        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    if result == "admin":

        raise HTTPException(
            status_code=403,
            detail="No se puede eliminar un administrador"
        )

    return {
        "message": "Operador eliminado correctamente"
    }