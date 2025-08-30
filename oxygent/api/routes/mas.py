"""
API routes for managing MAS (Multi-Agent System) instances.

This module defines the FastAPI routes for managing MAS instances in the OxyGent framework.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field

from oxygent import MAS

router = APIRouter()

# Pydantic models for request/response validation
class MASBase(BaseModel):
    name: str
    description: Optional[str] = None
    
class MASCreate(MASBase):
    # Additional fields specific to MAS creation
    oxy_space: List[Dict[str, Any]]
    welcome_message: Optional[str] = None
    config: Optional[Dict[str, Any]] = None

class MASUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    oxy_space: Optional[List[Dict[str, Any]]] = None
    welcome_message: Optional[str] = None
    config: Optional[Dict[str, Any]] = None

class MASResponse(MASBase):
    id: str
    status: str = "inactive"
    
    class Config:
        orm_mode = True

class MASQueryRequest(BaseModel):
    query: str

class MASQueryResponse(BaseModel):
    mas_id: str
    query: str
    response: str
    execution_time: float

# Mock database for development
mas_db = {}
mas_id_counter = 0
mas_instances = {}  # Store actual MAS instances

@router.get("/", response_model=List[MASResponse])
async def get_mas_instances():
    """
    Get all MAS instances.
    
    Returns:
        List[MASResponse]: List of all MAS instances.
    """
    return list(mas_db.values())

@router.post("/", response_model=MASResponse, status_code=status.HTTP_201_CREATED)
async def create_mas(mas: MASCreate):
    """
    Create a new MAS instance.
    
    Args:
        mas (MASCreate): MAS instance data.
        
    Returns:
        MASResponse: Created MAS instance.
        
    Raises:
        HTTPException: If MAS instance with the same name already exists.
    """
    if mas.name in [m["name"] for m in mas_db.values()]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"MAS instance with name '{mas.name}' already exists"
        )
    
    global mas_id_counter
    mas_id_counter += 1
    mas_id = str(mas_id_counter)
    
    mas_data = mas.dict()
    mas_data["id"] = mas_id
    mas_db[mas_id] = mas_data
    
    # In a real implementation, this would create a MAS instance
    # mas_instances[mas_id] = await MAS.create(oxy_space=mas.oxy_space, name=mas.name)
    
    return mas_data

@router.get("/{mas_id}", response_model=MASResponse)
async def get_mas(mas_id: str):
    """
    Get MAS instance by ID.
    
    Args:
        mas_id (str): MAS instance ID.
        
    Returns:
        MASResponse: MAS instance data.
        
    Raises:
        HTTPException: If MAS instance with the specified ID does not exist.
    """
    if mas_id not in mas_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"MAS instance with ID '{mas_id}' not found"
        )
    
    return mas_db[mas_id]

@router.put("/{mas_id}", response_model=MASResponse)
async def update_mas(mas_id: str, mas: MASUpdate):
    """
    Update MAS instance.
    
    Args:
        mas_id (str): MAS instance ID.
        mas (MASUpdate): Updated MAS instance data.
        
    Returns:
        MASResponse: Updated MAS instance.
        
    Raises:
        HTTPException: If MAS instance with the specified ID does not exist.
    """
    if mas_id not in mas_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"MAS instance with ID '{mas_id}' not found"
        )
    
    mas_data = mas_db[mas_id]
    update_data = {k: v for k, v in mas.dict().items() if v is not None}
    mas_data.update(update_data)
    mas_db[mas_id] = mas_data
    
    # In a real implementation, this would update the MAS instance
    
    return mas_data

@router.delete("/{mas_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mas(mas_id: str):
    """
    Delete MAS instance.
    
    Args:
        mas_id (str): MAS instance ID.
        
    Raises:
        HTTPException: If MAS instance with the specified ID does not exist.
    """
    if mas_id not in mas_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"MAS instance with ID '{mas_id}' not found"
        )
    
    # In a real implementation, this would clean up the MAS instance
    # if mas_id in mas_instances:
    #     await mas_instances[mas_id].cleanup()
    #     del mas_instances[mas_id]
    
    del mas_db[mas_id]
    
    return None

@router.post("/{mas_id}/start", response_model=MASResponse)
async def start_mas(mas_id: str):
    """
    Start a MAS instance.
    
    Args:
        mas_id (str): MAS instance ID.
        
    Returns:
        MASResponse: Started MAS instance.
        
    Raises:
        HTTPException: If MAS instance with the specified ID does not exist.
    """
    if mas_id not in mas_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"MAS instance with ID '{mas_id}' not found"
        )
    
    # In a real implementation, this would start the MAS instance
    
    mas_data = mas_db[mas_id]
    mas_data["status"] = "active"
    mas_db[mas_id] = mas_data
    
    return mas_data

@router.post("/{mas_id}/stop", response_model=MASResponse)
async def stop_mas(mas_id: str):
    """
    Stop a MAS instance.
    
    Args:
        mas_id (str): MAS instance ID.
        
    Returns:
        MASResponse: Stopped MAS instance.
        
    Raises:
        HTTPException: If MAS instance with the specified ID does not exist.
    """
    if mas_id not in mas_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"MAS instance with ID '{mas_id}' not found"
        )
    
    # In a real implementation, this would stop the MAS instance
    
    mas_data = mas_db[mas_id]
    mas_data["status"] = "inactive"
    mas_db[mas_id] = mas_data
    
    return mas_data

@router.post("/{mas_id}/query", response_model=MASQueryResponse)
async def query_mas(mas_id: str, query_request: MASQueryRequest):
    """
    Send a query to a MAS instance.
    
    Args:
        mas_id (str): MAS instance ID.
        query_request (MASQueryRequest): Query data.
        
    Returns:
        MASQueryResponse: Query results.
        
    Raises:
        HTTPException: If MAS instance with the specified ID does not exist or is not active.
    """
    if mas_id not in mas_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"MAS instance with ID '{mas_id}' not found"
        )
    
    mas_data = mas_db[mas_id]
    if mas_data["status"] != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"MAS instance with ID '{mas_id}' is not active"
        )
    
    # In a real implementation, this would send a query to the MAS instance
    # response = await mas_instances[mas_id].process_query(query_request.query)
    
    return MASQueryResponse(
        mas_id=mas_id,
        query=query_request.query,
        response="This is a mock query response. In a real implementation, this would be the MAS instance's response to the query.",
        execution_time=0.789
    )

