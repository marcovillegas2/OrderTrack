from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.models import User, Product, Order

from app.controllers.usuario_controller import router as user_router
from app.controllers.producto_controller import router as product_router

app = FastAPI(title="OrderTrack")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(user_router)
app.include_router(product_router)

@app.get("/health")
def health_check():

    return {
        "status": "ok",
        "message": "OrderTrack backend funcionando"
    }