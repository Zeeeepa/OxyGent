"""
API routes for system configuration.

This module defines the FastAPI routes for managing system configuration in the OxyGent framework.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends, File, UploadFile
from pydantic import BaseModel, Field

from oxygent.config import Config

router = APIRouter()

# Pydantic models for request/response validation
class LLMConfig(BaseModel):
    name: str
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    model_name: Optional[str] = None
    default_params: Optional[Dict[str, Any]] = None

class DatabaseConfig(BaseModel):
    type: str
    connection_string: Optional[str] = None
    config: Optional[Dict[str, Any]] = None

class SystemConfig(BaseModel):
    llm_configs: Optional[List[LLMConfig]] = None
    database_configs: Optional[List[DatabaseConfig]] = None
    log_level: Optional[str] = None
    cache_dir: Optional[str] = None
    additional_config: Optional[Dict[str, Any]] = None

class SystemStatus(BaseModel):
    version: str
    status: str
    uptime: float
    active_mas_count: int
    registered_agents_count: int
    registered_tools_count: int
    registered_workflows_count: int

# Mock system configuration for development
system_config = {
    "llm_configs": [
        {
            "name": "default_llm",
            "api_key": "***",
            "base_url": "https://api.example.com",
            "model_name": "example-model",
            "default_params": {
                "temperature": 0.7,
                "max_tokens": 1000
            }
        }
    ],
    "database_configs": [
        {
            "type": "elasticsearch",
            "connection_string": "http://localhost:9200",
            "config": {
                "index_prefix": "oxygent_"
            }
        }
    ],
    "log_level": "INFO",
    "cache_dir": "/tmp/oxygent_cache",
    "additional_config": {
        "web_service_port": 8000,
        "enable_monitoring": True
    }
}

@router.get("/config", response_model=SystemConfig)
async def get_system_config():
    """
    Get system configuration.
    
    Returns:
        SystemConfig: System configuration.
    """
    return system_config

@router.put("/config", response_model=SystemConfig)
async def update_system_config(config: SystemConfig):
    """
    Update system configuration.
    
    Args:
        config (SystemConfig): Updated system configuration.
        
    Returns:
        SystemConfig: Updated system configuration.
    """
    global system_config
    
    # Update only the provided fields
    if config.llm_configs is not None:
        system_config["llm_configs"] = [llm.dict() for llm in config.llm_configs]
    
    if config.database_configs is not None:
        system_config["database_configs"] = [db.dict() for db in config.database_configs]
    
    if config.log_level is not None:
        system_config["log_level"] = config.log_level
    
    if config.cache_dir is not None:
        system_config["cache_dir"] = config.cache_dir
    
    if config.additional_config is not None:
        system_config["additional_config"] = config.additional_config
    
    # In a real implementation, this would update the actual system configuration
    # Config.update_from_dict(system_config)
    
    return system_config

@router.get("/status", response_model=SystemStatus)
async def get_system_status():
    """
    Get system status.
    
    Returns:
        SystemStatus: System status.
    """
    # In a real implementation, this would get the actual system status
    
    return SystemStatus(
        version="0.1.0",
        status="running",
        uptime=3600.0,
        active_mas_count=2,
        registered_agents_count=10,
        registered_tools_count=15,
        registered_workflows_count=5
    )

@router.post("/import", response_model=Dict[str, Any])
async def import_config(file: UploadFile = File(...)):
    """
    Import system configuration from a file.
    
    Args:
        file (UploadFile): Configuration file.
        
    Returns:
        Dict[str, Any]: Import result.
    """
    # In a real implementation, this would import the configuration from the file
    
    return {
        "status": "success",
        "message": "Configuration imported successfully. In a real implementation, this would update the system configuration."
    }

@router.get("/export", response_model=Dict[str, Any])
async def export_config():
    """
    Export system configuration to a file.
    
    Returns:
        Dict[str, Any]: Export result with download URL.
    """
    # In a real implementation, this would export the configuration to a file
    # and return a download URL
    
    return {
        "status": "success",
        "download_url": "/api/v1/system/download-config",
        "message": "Configuration exported successfully. In a real implementation, this would provide a download URL for the configuration file."
    }

@router.post("/restart", response_model=Dict[str, Any])
async def restart_system():
    """
    Restart the system.
    
    Returns:
        Dict[str, Any]: Restart result.
    """
    # In a real implementation, this would restart the system
    
    return {
        "status": "success",
        "message": "System restart initiated. In a real implementation, this would restart the system."
    }

