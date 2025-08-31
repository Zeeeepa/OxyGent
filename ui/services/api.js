import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: '/',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for authentication and other headers
api.interceptors.request.use(
    (config) => {
        // Add any auth tokens or other headers here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        // Handle successful responses
        return response.data;
    },
    (error) => {
        // Handle error responses
        if (error.response) {
            // Server responded with an error status
            console.error('API Error:', error.response.data);
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network Error:', error.request);
            return Promise.reject({ message: 'Network error. Please check your connection.' });
        } else {
            // Something else happened
            console.error('Request Error:', error.message);
            return Promise.reject({ message: error.message });
        }
    }
);

// API endpoints for agents
export const agentApi = {
    // Get all agents
    getAgents: () => api.get('/api/agents'),
    
    // Get agent by ID
    getAgent: (agentId) => api.get(`/api/agents/${agentId}`),
    
    // Create new agent
    createAgent: (agentData) => api.post('/api/agents', agentData),
    
    // Update agent
    updateAgent: (agentId, agentData) => api.put(`/api/agents/${agentId}`, agentData),
    
    // Delete agent
    deleteAgent: (agentId) => api.delete(`/api/agents/${agentId}`),
    
    // Get agent types
    getAgentTypes: () => api.get('/api/agent-types'),
};

// API endpoints for tools
export const toolApi = {
    // Get all tools
    getTools: () => api.get('/api/tools'),
    
    // Get tool by ID
    getTool: (toolId) => api.get(`/api/tools/${toolId}`),
    
    // Create new tool
    createTool: (toolData) => api.post('/api/tools', toolData),
    
    // Update tool
    updateTool: (toolId, toolData) => api.put(`/api/tools/${toolId}`, toolData),
    
    // Delete tool
    deleteTool: (toolId) => api.delete(`/api/tools/${toolId}`),
    
    // Get tool types
    getToolTypes: () => api.get('/api/tool-types'),
    
    // Test tool
    testTool: (toolId, testData) => api.post(`/api/tools/${toolId}/test`, testData),
};

// API endpoints for workflows
export const workflowApi = {
    // Get all workflows
    getWorkflows: () => api.get('/api/workflows'),
    
    // Get workflow by ID
    getWorkflow: (workflowId) => api.get(`/api/workflows/${workflowId}`),
    
    // Create new workflow
    createWorkflow: (workflowData) => api.post('/api/workflows', workflowData),
    
    // Update workflow
    updateWorkflow: (workflowId, workflowData) => api.put(`/api/workflows/${workflowId}`, workflowData),
    
    // Delete workflow
    deleteWorkflow: (workflowId) => api.delete(`/api/workflows/${workflowId}`),
    
    // Get workflow types
    getWorkflowTypes: () => api.get('/api/workflow-types'),
    
    // Execute workflow
    executeWorkflow: (workflowId, inputData) => api.post(`/api/workflows/${workflowId}/execute`, inputData),
};

// API endpoints for system
export const systemApi = {
    // Get system info
    getSystemInfo: () => api.get('/api/system/info'),
    
    // Get system metrics
    getSystemMetrics: () => api.get('/api/system/metrics'),
    
    // Get system configuration
    getSystemConfig: () => api.get('/api/system/config'),
    
    // Update system configuration
    updateSystemConfig: (configData) => api.put('/api/system/config', configData),
    
    // Get LLM providers
    getLLMProviders: () => api.get('/api/system/llm-providers'),
    
    // Update LLM provider
    updateLLMProvider: (providerId, providerData) => api.put(`/api/system/llm-providers/${providerId}`, providerData),
    
    // Get database connections
    getDatabaseConnections: () => api.get('/api/system/database-connections'),
    
    // Update database connection
    updateDatabaseConnection: (connectionId, connectionData) => api.put(`/api/system/database-connections/${connectionId}`, connectionData),
};

// API endpoints for organization
export const organizationApi = {
    // Get agent organization
    getAgentOrganization: () => api.get('/get_organization'),
    
    // Get first query
    getFirstQuery: () => api.get('/get_first_query'),
    
    // Get welcome message
    getWelcomeMessage: () => api.get('/get_welcome_message'),
};

// Redux action creators
export const fetchAgentOrganization = () => async (dispatch) => {
    dispatch({ type: 'FETCH_AGENT_ORGANIZATION_REQUEST' });
    try {
        const response = await organizationApi.getAgentOrganization();
        dispatch({
            type: 'FETCH_AGENT_ORGANIZATION_SUCCESS',
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: 'FETCH_AGENT_ORGANIZATION_FAILURE',
            payload: error.message,
        });
    }
};

export const fetchSystemInfo = () => async (dispatch) => {
    dispatch({ type: 'FETCH_SYSTEM_INFO_REQUEST' });
    try {
        const response = await systemApi.getSystemInfo();
        dispatch({
            type: 'FETCH_SYSTEM_INFO_SUCCESS',
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: 'FETCH_SYSTEM_INFO_FAILURE',
            payload: error.message,
        });
    }
};

// Export the API instance for direct use
export default api;

