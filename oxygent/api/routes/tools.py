"""
API routes for managing tools.

This module defines the FastAPI routes for managing tools in the OxyGent framework.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends, File, UploadFile
from pydantic import BaseModel, Field

from oxygent.oxy.base_tool import BaseTool
from oxygent.oxy.function_tools.function_hub import FunctionHub
from oxygent.oxy.mcp_tools.base_mcp_client import BaseMCPClient
from oxygent.oxy.api_tools.api_tool import ApiTool

router = APIRouter()

# Pydantic models for request/response validation
class ToolBase(BaseModel):
    name: str
    tool_type: str
    description: Optional[str] = None
    
class ToolCreate(ToolBase):
    # Additional fields specific to tool creation
    config: Optional[Dict[str, Any]] = None
    code: Optional[str] = None  # For function tools
    api_spec: Optional[Dict[str, Any]] = None  # For API tools
    mcp_config: Optional[Dict[str, Any]] = None  # For MCP tools

class ToolUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    code: Optional[str] = None
    api_spec: Optional[Dict[str, Any]] = None
    mcp_config: Optional[Dict[str, Any]] = None

class ToolResponse(ToolBase):
    id: str
    status: str = "active"
    
    class Config:
        orm_mode = True

class ToolTestRequest(BaseModel):
    input_data: Dict[str, Any]

class ToolTestResponse(BaseModel):
    tool_id: str
    status: str
    input: Dict[str, Any]
    output: Any
    execution_time: float

# Tool type mapping
TOOL_TYPES = {
    "function": "Function Tool",
    "mcp": "MCP Tool",
    "api": "API Tool"
}

# Mock database for development
tool_db = {}
tool_id_counter = 0

@router.get("/", response_model=List[ToolResponse])
async def get_tools():
    """
    Get all tools.
    
    Returns:
        List[ToolResponse]: List of all tools.
    """
    return list(tool_db.values())

@router.post("/", response_model=ToolResponse, status_code=status.HTTP_201_CREATED)
async def create_tool(tool: ToolCreate):
    """
    Create a new tool.
    
    Args:
        tool (ToolCreate): Tool data.
        
    Returns:
        ToolResponse: Created tool.
        
    Raises:
        HTTPException: If tool with the same name already exists or if tool type is invalid.
    """
    if tool.name in [t["name"] for t in tool_db.values()]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tool with name '{tool.name}' already exists"
        )
    
    if tool.tool_type.lower() not in TOOL_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid tool type. Must be one of: {', '.join(TOOL_TYPES.keys())}"
        )
    
    global tool_id_counter
    tool_id_counter += 1
    tool_id = str(tool_id_counter)
    
    tool_data = tool.dict()
    tool_data["id"] = tool_id
    tool_db[tool_id] = tool_data
    
    return tool_data

@router.get("/{tool_id}", response_model=ToolResponse)
async def get_tool(tool_id: str):
    """
    Get tool by ID.
    
    Args:
        tool_id (str): Tool ID.
        
    Returns:
        ToolResponse: Tool data.
        
    Raises:
        HTTPException: If tool with the specified ID does not exist.
    """
    if tool_id not in tool_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tool with ID '{tool_id}' not found"
        )
    
    return tool_db[tool_id]

@router.put("/{tool_id}", response_model=ToolResponse)
async def update_tool(tool_id: str, tool: ToolUpdate):
    """
    Update tool.
    
    Args:
        tool_id (str): Tool ID.
        tool (ToolUpdate): Updated tool data.
        
    Returns:
        ToolResponse: Updated tool.
        
    Raises:
        HTTPException: If tool with the specified ID does not exist.
    """
    if tool_id not in tool_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tool with ID '{tool_id}' not found"
        )
    
    tool_data = tool_db[tool_id]
    update_data = {k: v for k, v in tool.dict().items() if v is not None}
    tool_data.update(update_data)
    tool_db[tool_id] = tool_data
    
    return tool_data

@router.delete("/{tool_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tool(tool_id: str):
    """
    Delete tool.
    
    Args:
        tool_id (str): Tool ID.
        
    Raises:
        HTTPException: If tool with the specified ID does not exist.
    """
    if tool_id not in tool_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tool with ID '{tool_id}' not found"
        )
    
    del tool_db[tool_id]
    
    return None

@router.post("/{tool_id}/test", response_model=ToolTestResponse)
async def test_tool(tool_id: str, test_request: ToolTestRequest):
    """
    Test a tool with a sample input.
    
    Args:
        tool_id (str): Tool ID.
        test_request (ToolTestRequest): Test input data.
        
    Returns:
        ToolTestResponse: Test results.
        
    Raises:
        HTTPException: If tool with the specified ID does not exist.
    """
    if tool_id not in tool_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tool with ID '{tool_id}' not found"
        )
    
    # In a real implementation, this would create a temporary tool instance
    # and run it with the test input
    
    return ToolTestResponse(
        tool_id=tool_id,
        status="success",
        input=test_request.input_data,
        output="This is a mock test response. In a real implementation, this would be the tool's response to the test input.",
        execution_time=0.123
    )

@router.post("/upload-mcp-server", response_model=Dict[str, Any])
async def upload_mcp_server(file: UploadFile = File(...)):
    """
    Upload an MCP server implementation.
    
    Args:
        file (UploadFile): MCP server implementation file.
        
    Returns:
        Dict[str, Any]: Upload result.
    """
    # In a real implementation, this would save the uploaded file
    # and register it as an MCP server
    
    return {
        "status": "success",
        "filename": file.filename,
        "message": "MCP server uploaded successfully. In a real implementation, this would register the MCP server."
    }

