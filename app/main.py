import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Housing Agent API",
    description="API for a housing rental and selling site",
    version="1.0.0",
)

try:
    os.makedirs("uploads/properties", exist_ok=True)
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
except OSError:
    # Vercel has a read-only filesystem, so creating local uploads will fail.
    # In production, Cloudinary handles images.
    print("Running in read-only filesystem (Serverless). Local uploads disabled.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.api import api_router

app.include_router(api_router, prefix="/api")

