/**
 * OxyGent Management Interface - Agents JavaScript
 * 
 * This file contains the functionality for managing agents in the OxyGent framework.
 */

// Global variables for agents
let agents = [];
let editingAgentId = null;

/**
 * Initialize agents section
 */
function initAgentsSection() {
    // Initialize agent search
    document.getElementById('agent-search').addEventListener('input', function() {
        filterAgents();
    });
    
    // Initialize agent type filter
    document.getElementById('agent-type-filter').addEventListener('change', function() {
        filterAgents();
    });
    
    // Initialize agent form submission
    document.getElementById('agent-form').addEventListener('submit', function(event) {
        event.preventDefault();
        saveAgent();
    });
    
    // Load agents
    loadAgents();
}

/**
 * Load agents from the API
 */
async function loadAgents() {
    try {
        agents = await apiRequest('/agents');
        renderAgents();
    } catch (error) {
        console.error('Error loading agents:', error);
        // For development, use mock data if API is not available
        agents = [
            {
                id: '1',
                name: 'time_agent',
                agent_type: 'react',
                description: 'An agent that provides time-related information',
                is_master: true,
                status: 'active'
            },
            {
                id: '2',
                name: 'weather_agent',
                agent_type: 'chat',
                description: 'An agent that provides weather information',
                is_master: false,
                status: 'active'
            },
            {
                id: '3',
                name: 'calculator_agent',
                agent_type: 'local',
                description: 'An agent that performs calculations',
                is_master: false,
                status: 'inactive'
            }
        ];
        renderAgents();
    }
}

/**
 * Render agents in the table
 */
function renderAgents() {
    const agentList = document.getElementById('agent-list');
    agentList.innerHTML = '';
    
    if (agents.length === 0) {
        agentList.innerHTML = '<tr><td colspan="5" class="text-center">No agents found</td></tr>';
        return;
    }
    
    agents.forEach(agent => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${agent.name}</td>
            <td>${formatAgentType(agent.agent_type)}</td>
            <td>${agent.description || '-'}</td>
            <td><span class="status-badge ${agent.status}">${agent.status}</span></td>
            <td>
                <button class="action-btn edit" data-id="${agent.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn test" data-id="${agent.id}">
                    <i class="fas fa-vial"></i> Test
                </button>
                <button class="action-btn delete" data-id="${agent.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        
        agentList.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.action-btn.edit').forEach(button => {
        button.addEventListener('click', function() {
            const agentId = this.getAttribute('data-id');
            editAgent(agentId);
        });
    });
    
    document.querySelectorAll('.action-btn.test').forEach(button => {
        button.addEventListener('click', function() {
            const agentId = this.getAttribute('data-id');
            testAgent(agentId);
        });
    });
    
    document.querySelectorAll('.action-btn.delete').forEach(button => {
        button.addEventListener('click', function() {
            const agentId = this.getAttribute('data-id');
            deleteAgent(agentId);
        });
    });
}

/**
 * Filter agents based on search and type filter
 */
function filterAgents() {
    const searchTerm = document.getElementById('agent-search').value.toLowerCase();
    const typeFilter = document.getElementById('agent-type-filter').value;
    
    const filteredAgents = agents.filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(searchTerm) || 
                             (agent.description && agent.description.toLowerCase().includes(searchTerm));
        const matchesType = typeFilter === '' || agent.agent_type === typeFilter;
        
        return matchesSearch && matchesType;
    });
    
    renderFilteredAgents(filteredAgents);
}

/**
 * Render filtered agents in the table
 * 
 * @param {Array} filteredAgents - The filtered agents to render
 */
function renderFilteredAgents(filteredAgents) {
    const agentList = document.getElementById('agent-list');
    agentList.innerHTML = '';
    
    if (filteredAgents.length === 0) {
        agentList.innerHTML = '<tr><td colspan="5" class="text-center">No agents found</td></tr>';
        return;
    }
    
    filteredAgents.forEach(agent => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${agent.name}</td>
            <td>${formatAgentType(agent.agent_type)}</td>
            <td>${agent.description || '-'}</td>
            <td><span class="status-badge ${agent.status}">${agent.status}</span></td>
            <td>
                <button class="action-btn edit" data-id="${agent.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn test" data-id="${agent.id}">
                    <i class="fas fa-vial"></i> Test
                </button>
                <button class="action-btn delete" data-id="${agent.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        
        agentList.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.action-btn.edit').forEach(button => {
        button.addEventListener('click', function() {
            const agentId = this.getAttribute('data-id');
            editAgent(agentId);
        });
    });
    
    document.querySelectorAll('.action-btn.test').forEach(button => {
        button.addEventListener('click', function() {
            const agentId = this.getAttribute('data-id');
            testAgent(agentId);
        });
    });
    
    document.querySelectorAll('.action-btn.delete').forEach(button => {
        button.addEventListener('click', function() {
            const agentId = this.getAttribute('data-id');
            deleteAgent(agentId);
        });
    });
}

/**
 * Format agent type for display
 * 
 * @param {string} type - The agent type
 * @returns {string} - The formatted agent type
 */
function formatAgentType(type) {
    const typeMap = {
        'react': 'ReAct Agent',
        'chat': 'Chat Agent',
        'workflow': 'Workflow Agent',
        'local': 'Local Agent',
        'parallel': 'Parallel Agent',
        'remote': 'Remote Agent',
        'sse': 'SSE Agent'
    };
    
    return typeMap[type] || type;
}

/**
 * Open the agent modal for creating a new agent
 */
function openAgentModal() {
    // Reset form
    document.getElementById('agent-form').reset();
    
    // Set modal title
    document.getElementById('agent-modal-title').textContent = 'Create Agent';
    
    // Reset editing agent ID
    editingAgentId = null;
    
    // Show modal
    document.getElementById('agent-modal').style.display = 'block';
    
    // Load tools for the agent
    loadToolsForAgent();
    
    // Load agents for sub-agents
    loadAgentsForSubAgents();
    
    // Load LLM models
    loadLlmModels();
}

/**
 * Load tools for the agent form
 */
async function loadToolsForAgent() {
    try {
        const tools = await apiRequest('/tools');
        const toolsSelect = document.getElementById('agent-tools');
        
        toolsSelect.innerHTML = '';
        
        tools.forEach(tool => {
            const option = document.createElement('option');
            option.value = tool.id;
            option.textContent = tool.name;
            toolsSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading tools:', error);
        // For development, use mock data if API is not available
        const toolsSelect = document.getElementById('agent-tools');
        
        toolsSelect.innerHTML = `
            <option value="1">time_tools</option>
            <option value="2">weather_tools</option>
            <option value="3">calculator_tools</option>
        `;
    }
}

/**
 * Load agents for sub-agents in the agent form
 */
async function loadAgentsForSubAgents() {
    try {
        const subAgentsSelect = document.getElementById('agent-sub-agents');
        
        subAgentsSelect.innerHTML = '';
        
        agents.forEach(agent => {
            const option = document.createElement('option');
            option.value = agent.id;
            option.textContent = agent.name;
            subAgentsSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading agents for sub-agents:', error);
    }
}

/**
 * Load LLM models for the agent form
 */
async function loadLlmModels() {
    try {
        const systemConfig = await apiRequest('/system/config');
        const llmModelsSelect = document.getElementById('agent-llm-model');
        
        llmModelsSelect.innerHTML = '';
        
        systemConfig.llm_configs.forEach(llm => {
            const option = document.createElement('option');
            option.value = llm.name;
            option.textContent = `${llm.name} (${llm.model_name})`;
            llmModelsSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading LLM models:', error);
        // For development, use mock data if API is not available
        const llmModelsSelect = document.getElementById('agent-llm-model');
        
        llmModelsSelect.innerHTML = `
            <option value="default_llm">default_llm (example-model)</option>
            <option value="gpt4">gpt4 (gpt-4)</option>
            <option value="claude">claude (claude-2)</option>
        `;
    }
}

/**
 * Edit an agent
 * 
 * @param {string} agentId - The ID of the agent to edit
 */
async function editAgent(agentId) {
    try {
        const agent = await apiRequest(`/agents/${agentId}`);
        
        // Set form values
        document.getElementById('agent-name').value = agent.name;
        document.getElementById('agent-type').value = agent.agent_type;
        document.getElementById('agent-description').value = agent.description || '';
        document.getElementById('agent-is-master').checked = agent.is_master;
        
        // Set tools
        if (agent.tools) {
            const toolsSelect = document.getElementById('agent-tools');
            Array.from(toolsSelect.options).forEach(option => {
                option.selected = agent.tools.includes(option.value);
            });
        }
        
        // Set sub-agents
        if (agent.sub_agents) {
            const subAgentsSelect = document.getElementById('agent-sub-agents');
            Array.from(subAgentsSelect.options).forEach(option => {
                option.selected = agent.sub_agents.includes(option.value);
            });
        }
        
        // Set LLM model
        if (agent.llm_model) {
            document.getElementById('agent-llm-model').value = agent.llm_model;
        }
        
        // Set additional prompt
        if (agent.additional_prompt) {
            document.getElementById('agent-additional-prompt').value = agent.additional_prompt;
        }
        
        // Set timeout
        if (agent.timeout) {
            document.getElementById('agent-timeout').value = agent.timeout;
        }
        
        // Set trust mode
        if (agent.trust_mode !== undefined) {
            document.getElementById('agent-trust-mode').checked = agent.trust_mode;
        }
        
        // Set modal title
        document.getElementById('agent-modal-title').textContent = 'Edit Agent';
        
        // Set editing agent ID
        editingAgentId = agentId;
        
        // Show modal
        document.getElementById('agent-modal').style.display = 'block';
    } catch (error) {
        console.error('Error editing agent:', error);
        showToast('Error loading agent details', 'error');
    }
}

/**
 * Save an agent (create or update)
 */
async function saveAgent() {
    // Get form values
    const name = document.getElementById('agent-name').value;
    const agentType = document.getElementById('agent-type').value;
    const description = document.getElementById('agent-description').value;
    const isMaster = document.getElementById('agent-is-master').checked;
    
    // Get selected tools
    const toolsSelect = document.getElementById('agent-tools');
    const tools = Array.from(toolsSelect.selectedOptions).map(option => option.value);
    
    // Get selected sub-agents
    const subAgentsSelect = document.getElementById('agent-sub-agents');
    const subAgents = Array.from(subAgentsSelect.selectedOptions).map(option => option.value);
    
    // Get LLM model
    const llmModel = document.getElementById('agent-llm-model').value;
    
    // Get additional prompt
    const additionalPrompt = document.getElementById('agent-additional-prompt').value;
    
    // Get timeout
    const timeout = document.getElementById('agent-timeout').value;
    
    // Get trust mode
    const trustMode = document.getElementById('agent-trust-mode').checked;
    
    // Create agent data
    const agentData = {
        name,
        agent_type: agentType,
        description,
        is_master: isMaster,
        tools,
        sub_agents: subAgents,
        llm_model: llmModel,
        additional_prompt: additionalPrompt,
        timeout: timeout ? parseInt(timeout) : undefined,
        trust_mode: trustMode
    };
    
    try {
        if (editingAgentId) {
            // Update existing agent
            await apiRequest(`/agents/${editingAgentId}`, 'PUT', agentData);
            showToast('Agent updated successfully');
        } else {
            // Create new agent
            await apiRequest('/agents', 'POST', agentData);
            showToast('Agent created successfully');
        }
        
        // Close modal
        document.getElementById('agent-modal').style.display = 'none';
        
        // Reload agents
        loadAgents();
    } catch (error) {
        console.error('Error saving agent:', error);
        showToast('Error saving agent', 'error');
    }
}

/**
 * Test an agent
 * 
 * @param {string} agentId - The ID of the agent to test
 */
async function testAgent(agentId) {
    try {
        // In a real implementation, this would open a modal with a form for test input
        // For now, we'll use a simple prompt
        const testInput = prompt('Enter test input for the agent:');
        
        if (testInput) {
            const testResult = await apiRequest(`/agents/${agentId}/test`, 'POST', { input: testInput });
            alert(`Test Result: ${testResult.output}`);
        }
    } catch (error) {
        console.error('Error testing agent:', error);
        showToast('Error testing agent', 'error');
    }
}

/**
 * Delete an agent
 * 
 * @param {string} agentId - The ID of the agent to delete
 */
async function deleteAgent(agentId) {
    if (confirm('Are you sure you want to delete this agent?')) {
        try {
            await apiRequest(`/agents/${agentId}`, 'DELETE');
            showToast('Agent deleted successfully');
            
            // Reload agents
            loadAgents();
        } catch (error) {
            console.error('Error deleting agent:', error);
            showToast('Error deleting agent', 'error');
        }
    }
}

