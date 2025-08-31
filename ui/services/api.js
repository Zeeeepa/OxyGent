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

// API endpoints for orchestration
export const orchestrationApi = {
    // Get all orchestrations
    getOrchestrations: () => api.get('/api/orchestrations'),
    
    // Get orchestration by ID
    getOrchestration: (orchestrationId) => api.get(`/api/orchestrations/${orchestrationId}`),
    
    // Create new orchestration
    createOrchestration: (orchestrationData) => api.post('/api/orchestrations', orchestrationData),
    
    // Update orchestration
    updateOrchestration: (orchestrationId, orchestrationData) => api.put(`/api/orchestrations/${orchestrationId}`, orchestrationData),
    
    // Delete orchestration
    deleteOrchestration: (orchestrationId) => api.delete(`/api/orchestrations/${orchestrationId}`),
    
    // Get orchestration types
    getOrchestrationTypes: () => api.get('/api/orchestration-types'),
    
    // Start orchestration
    startOrchestration: (orchestrationId) => api.post(`/api/orchestrations/${orchestrationId}/start`),
    
    // Pause orchestration
    pauseOrchestration: (orchestrationId) => api.post(`/api/orchestrations/${orchestrationId}/pause`),
    
    // Stop orchestration
    stopOrchestration: (orchestrationId) => api.post(`/api/orchestrations/${orchestrationId}/stop`),
    
    // Get orchestration events
    getOrchestrationEvents: (orchestrationId, params) => api.get(`/api/orchestrations/${orchestrationId}/events`, { params }),
    
    // Get orchestration metrics
    getOrchestrationMetrics: (orchestrationId) => api.get(`/api/orchestrations/${orchestrationId}/metrics`),
    
    // Get orchestration logs
    getOrchestrationLogs: (orchestrationId, params) => api.get(`/api/orchestrations/${orchestrationId}/logs`, { params }),
};

// API endpoints for flows
export const flowApi = {
    // Get all flows
    getFlows: () => api.get('/api/flows'),
    
    // Get flow by ID
    getFlow: (flowId) => api.get(`/api/flows/${flowId}`),
    
    // Create new flow
    createFlow: (flowData) => api.post('/api/flows', flowData),
    
    // Update flow
    updateFlow: (flowId, flowData) => api.put(`/api/flows/${flowId}`, flowData),
    
    // Delete flow
    deleteFlow: (flowId) => api.delete(`/api/flows/${flowId}`),
    
    // Get flow types
    getFlowTypes: () => api.get('/api/flow-types'),
    
    // Execute flow
    executeFlow: (flowId, inputData) => api.post(`/api/flows/${flowId}/execute`, inputData),
    
    // Get flow execution status
    getFlowExecutionStatus: (executionId) => api.get(`/api/flow-executions/${executionId}`),
    
    // Get flow execution results
    getFlowExecutionResults: (executionId) => api.get(`/api/flow-executions/${executionId}/results`),
};

// API endpoints for events
export const eventApi = {
    // Get all events
    getEvents: (params) => api.get('/api/events', { params }),
    
    // Get event by ID
    getEvent: (eventId) => api.get(`/api/events/${eventId}`),
    
    // Get event types
    getEventTypes: () => api.get('/api/event-types'),
    
    // Get events by agent
    getAgentEvents: (agentId, params) => api.get(`/api/agents/${agentId}/events`, { params }),
    
    // Get events by tool
    getToolEvents: (toolId, params) => api.get(`/api/tools/${toolId}/events`, { params }),
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

// API endpoints for MAS (Multi-Agent System)
export const masApi = {
    // Get all MAS instances
    getMASInstances: () => api.get('/api/mas'),
    
    // Get MAS instance by ID
    getMASInstance: (masId) => api.get(`/api/mas/${masId}`),
    
    // Create new MAS instance
    createMASInstance: (masData) => api.post('/api/mas', masData),
    
    // Update MAS instance
    updateMASInstance: (masId, masData) => api.put(`/api/mas/${masId}`, masData),
    
    // Delete MAS instance
    deleteMASInstance: (masId) => api.delete(`/api/mas/${masId}`),
    
    // Start MAS instance
    startMASInstance: (masId) => api.post(`/api/mas/${masId}/start`),
    
    // Stop MAS instance
    stopMASInstance: (masId) => api.post(`/api/mas/${masId}/stop`),
    
    // Get MAS metrics
    getMASMetrics: (masId) => api.get(`/api/mas/${masId}/metrics`),
    
    // Get MAS events
    getMASEvents: (masId, params) => api.get(`/api/mas/${masId}/events`, { params }),
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

