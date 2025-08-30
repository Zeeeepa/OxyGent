"""
API routes for managing workflows.

This module defines the FastAPI routes for managing workflows in the OxyGent framework.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field

from oxygent.oxy.base_flow import BaseFlow

router = APIRouter()

# Pydantic models for request/response validation
class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None
    
class WorkflowCreate(WorkflowBase):
    # Additional fields specific to workflow creation
    agents: List[str]
    connections: List[Dict[str, Any]]
    config: Optional[Dict[str, Any]] = None

class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    agents: Optional[List[str]] = None
    connections: Optional[List[Dict[str, Any]]] = None
    config: Optional[Dict[str, Any]] = None

class WorkflowResponse(WorkflowBase):
    id: str
    agents: List[str]
    connections: List[Dict[str, Any]]
    status: str = "active"
    
    class Config:
        orm_mode = True

class WorkflowRunRequest(BaseModel):
    input_data: Dict[str, Any]

class WorkflowRunResponse(BaseModel):
    workflow_id: str
    status: str
    input: Dict[str, Any]
    output: Any
    execution_time: float

# Mock database for development
workflow_db = {}
workflow_id_counter = 0

@router.get("/", response_model=List[WorkflowResponse])
async def get_workflows():
    """
    Get all workflows.
    
    Returns:
        List[WorkflowResponse]: List of all workflows.
    """
    return list(workflow_db.values())

@router.post("/", response_model=WorkflowResponse, status_code=status.HTTP_201_CREATED)
async def create_workflow(workflow: WorkflowCreate):
    """
    Create a new workflow.
    
    Args:
        workflow (WorkflowCreate): Workflow data.
        
    Returns:
        WorkflowResponse: Created workflow.
        
    Raises:
        HTTPException: If workflow with the same name already exists.
    """
    if workflow.name in [w["name"] for w in workflow_db.values()]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Workflow with name '{workflow.name}' already exists"
        )
    
    global workflow_id_counter
    workflow_id_counter += 1
    workflow_id = str(workflow_id_counter)
    
    workflow_data = workflow.dict()
    workflow_data["id"] = workflow_id
    workflow_db[workflow_id] = workflow_data
    
    return workflow_data

@router.get("/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(workflow_id: str):
    """
    Get workflow by ID.
    
    Args:
        workflow_id (str): Workflow ID.
        
    Returns:
        WorkflowResponse: Workflow data.
        
    Raises:
        HTTPException: If workflow with the specified ID does not exist.
    """
    if workflow_id not in workflow_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workflow with ID '{workflow_id}' not found"
        )
    
    return workflow_db[workflow_id]

@router.put("/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(workflow_id: str, workflow: WorkflowUpdate):
    """
    Update workflow.
    
    Args:
        workflow_id (str): Workflow ID.
        workflow (WorkflowUpdate): Updated workflow data.
        
    Returns:
        WorkflowResponse: Updated workflow.
        
    Raises:
        HTTPException: If workflow with the specified ID does not exist.
    """
    if workflow_id not in workflow_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workflow with ID '{workflow_id}' not found"
        )
    
    workflow_data = workflow_db[workflow_id]
    update_data = {k: v for k, v in workflow.dict().items() if v is not None}
    workflow_data.update(update_data)
    workflow_db[workflow_id] = workflow_data
    
    return workflow_data

@router.delete("/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workflow(workflow_id: str):
    """
    Delete workflow.
    
    Args:
        workflow_id (str): Workflow ID.
        
    Raises:
        HTTPException: If workflow with the specified ID does not exist.
    """
    if workflow_id not in workflow_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workflow with ID '{workflow_id}' not found"
        )
    
    del workflow_db[workflow_id]
    
    return None

@router.post("/{workflow_id}/run", response_model=WorkflowRunResponse)
async def run_workflow(workflow_id: str, run_request: WorkflowRunRequest):
    """
    Run a workflow with a sample input.
    
    Args:
        workflow_id (str): Workflow ID.
        run_request (WorkflowRunRequest): Run input data.
        
    Returns:
        WorkflowRunResponse: Run results.
        
    Raises:
        HTTPException: If workflow with the specified ID does not exist.
    """
    if workflow_id not in workflow_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workflow with ID '{workflow_id}' not found"
        )
    
    # In a real implementation, this would create a temporary workflow instance
    # and run it with the input data
    
    return WorkflowRunResponse(
        workflow_id=workflow_id,
        status="success",
        input=run_request.input_data,
        output="This is a mock run response. In a real implementation, this would be the workflow's response to the input.",
        execution_time=0.456
    )

@router.post("/{workflow_id}/validate", response_model=Dict[str, Any])
async def validate_workflow(workflow_id: str):
    """
    Validate a workflow configuration.
    
    Args:
        workflow_id (str): Workflow ID.
        
    Returns:
        Dict[str, Any]: Validation results.
        
    Raises:
        HTTPException: If workflow with the specified ID does not exist.
    """
    if workflow_id not in workflow_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workflow with ID '{workflow_id}' not found"
        )
    
    # In a real implementation, this would validate the workflow configuration
    
    return {
        "workflow_id": workflow_id,
        "is_valid": True,
        "messages": []
    }

