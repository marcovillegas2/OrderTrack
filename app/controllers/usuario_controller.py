from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.schemas.usuario_schema import UserCreate, UserLogin

from app.services.usuario_service import (
    register_user,
    login_user,
    list_users
)

router = APIRouter()

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

@router.post("/users/create")
def create_operator(user: UserCreate, db: Session = Depends(get_db)):

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

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

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
def get_users(db: Session = Depends(get_db)):

    return list_users(db)