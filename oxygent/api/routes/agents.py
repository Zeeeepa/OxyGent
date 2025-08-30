"""
API routes for managing agents.

This module defines the FastAPI routes for managing agents in the OxyGent framework.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field

from oxygent.oxy.agents.base_agent import BaseAgent
from oxygent.oxy.agents.react_agent import ReActAgent
from oxygent.oxy.agents.chat_agent import ChatAgent
from oxygent.oxy.agents.workflow_agent import WorkflowAgent
from oxygent.oxy.agents.local_agent import LocalAgent
from oxygent.oxy.agents.parallel_agent import ParallelAgent
from oxygent.oxy.agents.remote_agent import RemoteAgent
from oxygent.oxy.agents.sse_oxy_agent import SSEOxyAgent

router = APIRouter()

# Pydantic models for request/response validation
class AgentBase(BaseModel):
    name: str
    agent_type: str
    description: Optional[str] = None
    is_master: bool = False
    tools: Optional[List[str]] = None
    sub_agents: Optional[List[str]] = None
    llm_model: Optional[str] = None
    additional_prompt: Optional[str] = None
    timeout: Optional[int] = None
    trust_mode: Optional[bool] = None
    
class AgentCreate(AgentBase):
    # Additional fields specific to agent creation
    config: Optional[Dict[str, Any]] = None

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_master: Optional[bool] = None
    tools: Optional[List[str]] = None
    sub_agents: Optional[List[str]] = None
    llm_model: Optional[str] = None
    additional_prompt: Optional[str] = None
    timeout: Optional[int] = None
    trust_mode: Optional[bool] = None
    config: Optional[Dict[str, Any]] = None

class AgentResponse(AgentBase):
    id: str
    status: str = "active"
    
    class Config:
        orm_mode = True

# Agent type mapping
AGENT_TYPES = {
    "react": ReActAgent,
    "chat": ChatAgent,
    "workflow": WorkflowAgent,
    "local": LocalAgent,
    "parallel": ParallelAgent,
    "remote": RemoteAgent,
    "sse": SSEOxyAgent
}

# Mock database for development
agent_db = {}
agent_id_counter = 0

@router.get("/", response_model=List[AgentResponse])
async def get_agents():
    """
    Get all agents.
    
    Returns:
        List[AgentResponse]: List of all agents.
    """
    return list(agent_db.values())

@router.post("/", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent(agent: AgentCreate):
    """
    Create a new agent.
    
    Args:
        agent (AgentCreate): Agent data.
        
    Returns:
        AgentResponse: Created agent.
        
    Raises:
        HTTPException: If agent with the same name already exists or if agent type is invalid.
    """
    if agent.name in [a["name"] for a in agent_db.values()]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Agent with name '{agent.name}' already exists"
        )
    
    if agent.agent_type.lower() not in AGENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid agent type. Must be one of: {', '.join(AGENT_TYPES.keys())}"
        )
    
    global agent_id_counter
    agent_id_counter += 1
    agent_id = str(agent_id_counter)
    
    agent_data = agent.dict()
    agent_data["id"] = agent_id
    agent_db[agent_id] = agent_data
    
    return agent_data

@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: str):
    """
    Get agent by ID.
    
    Args:
        agent_id (str): Agent ID.
        
    Returns:
        AgentResponse: Agent data.
        
    Raises:
        HTTPException: If agent with the specified ID does not exist.
    """
    if agent_id not in agent_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with ID '{agent_id}' not found"
        )
    
    return agent_db[agent_id]

@router.put("/{agent_id}", response_model=AgentResponse)
async def update_agent(agent_id: str, agent: AgentUpdate):
    """
    Update agent.
    
    Args:
        agent_id (str): Agent ID.
        agent (AgentUpdate): Updated agent data.
        
    Returns:
        AgentResponse: Updated agent.
        
    Raises:
        HTTPException: If agent with the specified ID does not exist.
    """
    if agent_id not in agent_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with ID '{agent_id}' not found"
        )
    
    agent_data = agent_db[agent_id]
    update_data = {k: v for k, v in agent.dict().items() if v is not None}
    agent_data.update(update_data)
    agent_db[agent_id] = agent_data
    
    return agent_data

@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent(agent_id: str):
    """
    Delete agent.
    
    Args:
        agent_id (str): Agent ID.
        
    Raises:
        HTTPException: If agent with the specified ID does not exist.
    """
    if agent_id not in agent_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with ID '{agent_id}' not found"
        )
    
    del agent_db[agent_id]
    
    return None

@router.post("/{agent_id}/test", response_model=Dict[str, Any])
async def test_agent(agent_id: str, test_input: Dict[str, Any]):
    """
    Test an agent with a sample input.
    
    Args:
        agent_id (str): Agent ID.
        test_input (Dict[str, Any]): Test input data.
        
    Returns:
        Dict[str, Any]: Test results.
        
    Raises:
        HTTPException: If agent with the specified ID does not exist.
    """
    if agent_id not in agent_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with ID '{agent_id}' not found"
        )
    
    # In a real implementation, this would create a temporary agent instance
    # and run it with the test input
    
    return {
        "agent_id": agent_id,
        "status": "success",
        "input": test_input,
        "output": "This is a mock test response. In a real implementation, this would be the agent's response to the test input."
    }

