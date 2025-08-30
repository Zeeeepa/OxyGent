/**
 * OxyGent Management Interface - Workflows JavaScript
 * 
 * This file contains the functionality for managing workflows in the OxyGent framework.
 */

// Global variables for workflows
let workflows = [];
let editingWorkflowId = null;

/**
 * Initialize workflows section
 */
function initWorkflowsSection() {
    // Initialize workflow search
    document.getElementById('workflow-search').addEventListener('input', function() {
        filterWorkflows();
    });
    
    // Load workflows
    loadWorkflows();
}

/**
 * Load workflows from the API
 */
async function loadWorkflows() {
    try {
        workflows = await apiRequest('/workflows');
        renderWorkflows();
    } catch (error) {
        console.error('Error loading workflows:', error);
        // For development, use mock data if API is not available
        workflows = [
            {
                id: '1',
                name: 'weather_forecast',
                description: 'A workflow for getting weather forecasts',
                agents: ['1', '2'],
                status: 'active'
            },
            {
                id: '2',
                name: 'time_calculator',
                description: 'A workflow for time-based calculations',
                agents: ['1', '3'],
                status: 'active'
            },
            {
                id: '3',
                name: 'data_processor',
                description: 'A workflow for processing data',
                agents: ['2', '3'],
                status: 'inactive'
            }
        ];
        renderWorkflows();
    }
}

/**
 * Render workflows in the table
 */
function renderWorkflows() {
    const workflowList = document.getElementById('workflow-list');
    workflowList.innerHTML = '';
    
    if (workflows.length === 0) {
        workflowList.innerHTML = '<tr><td colspan="5" class="text-center">No workflows found</td></tr>';
        return;
    }
    
    workflows.forEach(workflow => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${workflow.name}</td>
            <td>${workflow.description || '-'}</td>
            <td>${formatAgentsList(workflow.agents)}</td>
            <td><span class="status-badge ${workflow.status}">${workflow.status}</span></td>
            <td>
                <button class="action-btn edit" data-id="${workflow.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn run" data-id="${workflow.id}">
                    <i class="fas fa-play"></i> Run
                </button>
                <button class="action-btn validate" data-id="${workflow.id}">
                    <i class="fas fa-check-circle"></i> Validate
                </button>
                <button class="action-btn delete" data-id="${workflow.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        
        workflowList.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.action-btn.edit').forEach(button => {
        button.addEventListener('click', function() {
            const workflowId = this.getAttribute('data-id');
            editWorkflow(workflowId);
        });
    });
    
    document.querySelectorAll('.action-btn.run').forEach(button => {
        button.addEventListener('click', function() {
            const workflowId = this.getAttribute('data-id');
            runWorkflow(workflowId);
        });
    });
    
    document.querySelectorAll('.action-btn.validate').forEach(button => {
        button.addEventListener('click', function() {
            const workflowId = this.getAttribute('data-id');
            validateWorkflow(workflowId);
        });
    });
    
    document.querySelectorAll('.action-btn.delete').forEach(button => {
        button.addEventListener('click', function() {
            const workflowId = this.getAttribute('data-id');
            deleteWorkflow(workflowId);
        });
    });
}

/**
 * Format agents list for display
 * 
 * @param {Array} agentIds - The agent IDs
 * @returns {string} - The formatted agents list
 */
function formatAgentsList(agentIds) {
    if (!agentIds || agentIds.length === 0) {
        return '-';
    }
    
    // In a real implementation, this would look up agent names from the agent IDs
    // For now, we'll just show the IDs
    return agentIds.map(id => {
        const agent = agents.find(a => a.id === id);
        return agent ? agent.name : `Agent ${id}`;
    }).join(', ');
}

/**
 * Filter workflows based on search
 */
function filterWorkflows() {
    const searchTerm = document.getElementById('workflow-search').value.toLowerCase();
    
    const filteredWorkflows = workflows.filter(workflow => {
        return workflow.name.toLowerCase().includes(searchTerm) || 
               (workflow.description && workflow.description.toLowerCase().includes(searchTerm));
    });
    
    renderFilteredWorkflows(filteredWorkflows);
}

/**
 * Render filtered workflows in the table
 * 
 * @param {Array} filteredWorkflows - The filtered workflows to render
 */
function renderFilteredWorkflows(filteredWorkflows) {
    const workflowList = document.getElementById('workflow-list');
    workflowList.innerHTML = '';
    
    if (filteredWorkflows.length === 0) {
        workflowList.innerHTML = '<tr><td colspan="5" class="text-center">No workflows found</td></tr>';
        return;
    }
    
    filteredWorkflows.forEach(workflow => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${workflow.name}</td>
            <td>${workflow.description || '-'}</td>
            <td>${formatAgentsList(workflow.agents)}</td>
            <td><span class="status-badge ${workflow.status}">${workflow.status}</span></td>
            <td>
                <button class="action-btn edit" data-id="${workflow.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn run" data-id="${workflow.id}">
                    <i class="fas fa-play"></i> Run
                </button>
                <button class="action-btn validate" data-id="${workflow.id}">
                    <i class="fas fa-check-circle"></i> Validate
                </button>
                <button class="action-btn delete" data-id="${workflow.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        
        workflowList.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.action-btn.edit').forEach(button => {
        button.addEventListener('click', function() {
            const workflowId = this.getAttribute('data-id');
            editWorkflow(workflowId);
        });
    });
    
    document.querySelectorAll('.action-btn.run').forEach(button => {
        button.addEventListener('click', function() {
            const workflowId = this.getAttribute('data-id');
            runWorkflow(workflowId);
        });
    });
    
    document.querySelectorAll('.action-btn.validate').forEach(button => {
        button.addEventListener('click', function() {
            const workflowId = this.getAttribute('data-id');
            validateWorkflow(workflowId);
        });
    });
    
    document.querySelectorAll('.action-btn.delete').forEach(button => {
        button.addEventListener('click', function() {
            const workflowId = this.getAttribute('data-id');
            deleteWorkflow(workflowId);
        });
    });
}

/**
 * Open the workflow modal for creating a new workflow
 */
function openWorkflowModal() {
    // This would be implemented similar to the agent modal
    // For brevity, we'll just show a placeholder
    alert('Workflow creation modal would open here');
}

/**
 * Edit a workflow
 * 
 * @param {string} workflowId - The ID of the workflow to edit
 */
function editWorkflow(workflowId) {
    // This would be implemented similar to editing an agent
    // For brevity, we'll just show a placeholder
    alert(`Editing workflow with ID: ${workflowId}`);
}

/**
 * Run a workflow
 * 
 * @param {string} workflowId - The ID of the workflow to run
 */
async function runWorkflow(workflowId) {
    try {
        // In a real implementation, this would open a modal with a form for run input
        // For now, we'll use a simple prompt
        const runInput = prompt('Enter input for the workflow (JSON format):');
        
        if (runInput) {
            try {
                const inputData = JSON.parse(runInput);
                const runResult = await apiRequest(`/workflows/${workflowId}/run`, 'POST', { input_data: inputData });
                alert(`Run Result: ${JSON.stringify(runResult.output)}`);
            } catch (parseError) {
                alert('Invalid JSON input. Please enter valid JSON.');
            }
        }
    } catch (error) {
        console.error('Error running workflow:', error);
        showToast('Error running workflow', 'error');
    }
}

/**
 * Validate a workflow
 * 
 * @param {string} workflowId - The ID of the workflow to validate
 */
async function validateWorkflow(workflowId) {
    try {
        const validationResult = await apiRequest(`/workflows/${workflowId}/validate`, 'POST');
        
        if (validationResult.is_valid) {
            showToast('Workflow is valid', 'success');
        } else {
            showToast(`Workflow validation failed: ${validationResult.messages.join(', ')}`, 'error');
        }
    } catch (error) {
        console.error('Error validating workflow:', error);
        showToast('Error validating workflow', 'error');
    }
}

/**
 * Delete a workflow
 * 
 * @param {string} workflowId - The ID of the workflow to delete
 */
async function deleteWorkflow(workflowId) {
    if (confirm('Are you sure you want to delete this workflow?')) {
        try {
            await apiRequest(`/workflows/${workflowId}`, 'DELETE');
            showToast('Workflow deleted successfully');
            
            // Reload workflows
            loadWorkflows();
        } catch (error) {
            console.error('Error deleting workflow:', error);
            showToast('Error deleting workflow', 'error');
        }
    }
}

