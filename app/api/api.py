from fastapi import APIRouter
from app.api.endpoints import auth, agents, properties, reviews, admin

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(properties.router, prefix="/properties", tags=["properties"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews & reports"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
