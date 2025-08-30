"""
API router for OxyGent management interface.

This module defines the FastAPI router for the management API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status

from .routes import agents, tools, workflows, system, mas

api_router = APIRouter(prefix="/api/v1")

# Include the various API route modules
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(tools.router, prefix="/tools", tags=["tools"])
api_router.include_router(workflows.router, prefix="/workflows", tags=["workflows"])
api_router.include_router(system.router, prefix="/system", tags=["system"])
api_router.include_router(mas.router, prefix="/mas", tags=["mas"])

