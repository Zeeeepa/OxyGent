/**
 * OxyGent Management Interface - Tools JavaScript
 * 
 * This file contains the functionality for managing tools in the OxyGent framework.
 */

// Global variables for tools
let tools = [];
let editingToolId = null;

/**
 * Initialize tools section
 */
function initToolsSection() {
    // Initialize tool search
    document.getElementById('tool-search').addEventListener('input', function() {
        filterTools();
    });
    
    // Initialize tool type filter
    document.getElementById('tool-type-filter').addEventListener('change', function() {
        filterTools();
    });
    
    // Load tools
    loadTools();
}

/**
 * Load tools from the API
 */
async function loadTools() {
    try {
        tools = await apiRequest('/tools');
        renderTools();
    } catch (error) {
        console.error('Error loading tools:', error);
        // For development, use mock data if API is not available
        tools = [
            {
                id: '1',
                name: 'time_tools',
                tool_type: 'function',
                description: 'Tools for time-related operations',
                status: 'active'
            },
            {
                id: '2',
                name: 'weather_tools',
                tool_type: 'api',
                description: 'Tools for weather information',
                status: 'active'
            },
            {
                id: '3',
                name: 'calculator_tools',
                tool_type: 'function',
                description: 'Tools for mathematical calculations',
                status: 'active'
            },
            {
                id: '4',
                name: 'browser_tools',
                tool_type: 'mcp',
                description: 'Tools for browser automation',
                status: 'inactive'
            }
        ];
        renderTools();
    }
}

/**
 * Render tools in the table
 */
function renderTools() {
    const toolList = document.getElementById('tool-list');
    toolList.innerHTML = '';
    
    if (tools.length === 0) {
        toolList.innerHTML = '<tr><td colspan="5" class="text-center">No tools found</td></tr>';
        return;
    }
    
    tools.forEach(tool => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${tool.name}</td>
            <td>${formatToolType(tool.tool_type)}</td>
            <td>${tool.description || '-'}</td>
            <td><span class="status-badge ${tool.status}">${tool.status}</span></td>
            <td>
                <button class="action-btn edit" data-id="${tool.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn test" data-id="${tool.id}">
                    <i class="fas fa-vial"></i> Test
                </button>
                <button class="action-btn delete" data-id="${tool.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        
        toolList.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.action-btn.edit').forEach(button => {
        button.addEventListener('click', function() {
            const toolId = this.getAttribute('data-id');
            editTool(toolId);
        });
    });
    
    document.querySelectorAll('.action-btn.test').forEach(button => {
        button.addEventListener('click', function() {
            const toolId = this.getAttribute('data-id');
            testTool(toolId);
        });
    });
    
    document.querySelectorAll('.action-btn.delete').forEach(button => {
        button.addEventListener('click', function() {
            const toolId = this.getAttribute('data-id');
            deleteTool(toolId);
        });
    });
}

/**
 * Filter tools based on search and type filter
 */
function filterTools() {
    const searchTerm = document.getElementById('tool-search').value.toLowerCase();
    const typeFilter = document.getElementById('tool-type-filter').value;
    
    const filteredTools = tools.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm) || 
                             (tool.description && tool.description.toLowerCase().includes(searchTerm));
        const matchesType = typeFilter === '' || tool.tool_type === typeFilter;
        
        return matchesSearch && matchesType;
    });
    
    renderFilteredTools(filteredTools);
}

/**
 * Render filtered tools in the table
 * 
 * @param {Array} filteredTools - The filtered tools to render
 */
function renderFilteredTools(filteredTools) {
    const toolList = document.getElementById('tool-list');
    toolList.innerHTML = '';
    
    if (filteredTools.length === 0) {
        toolList.innerHTML = '<tr><td colspan="5" class="text-center">No tools found</td></tr>';
        return;
    }
    
    filteredTools.forEach(tool => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${tool.name}</td>
            <td>${formatToolType(tool.tool_type)}</td>
            <td>${tool.description || '-'}</td>
            <td><span class="status-badge ${tool.status}">${tool.status}</span></td>
            <td>
                <button class="action-btn edit" data-id="${tool.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn test" data-id="${tool.id}">
                    <i class="fas fa-vial"></i> Test
                </button>
                <button class="action-btn delete" data-id="${tool.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        
        toolList.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.action-btn.edit').forEach(button => {
        button.addEventListener('click', function() {
            const toolId = this.getAttribute('data-id');
            editTool(toolId);
        });
    });
    
    document.querySelectorAll('.action-btn.test').forEach(button => {
        button.addEventListener('click', function() {
            const toolId = this.getAttribute('data-id');
            testTool(toolId);
        });
    });
    
    document.querySelectorAll('.action-btn.delete').forEach(button => {
        button.addEventListener('click', function() {
            const toolId = this.getAttribute('data-id');
            deleteTool(toolId);
        });
    });
}

/**
 * Format tool type for display
 * 
 * @param {string} type - The tool type
 * @returns {string} - The formatted tool type
 */
function formatToolType(type) {
    const typeMap = {
        'function': 'Function Tool',
        'mcp': 'MCP Tool',
        'api': 'API Tool'
    };
    
    return typeMap[type] || type;
}

/**
 * Open the tool modal for creating a new tool
 */
function openToolModal() {
    // This would be implemented similar to the agent modal
    // For brevity, we'll just show a placeholder
    alert('Tool creation modal would open here');
}

/**
 * Edit a tool
 * 
 * @param {string} toolId - The ID of the tool to edit
 */
function editTool(toolId) {
    // This would be implemented similar to editing an agent
    // For brevity, we'll just show a placeholder
    alert(`Editing tool with ID: ${toolId}`);
}

/**
 * Test a tool
 * 
 * @param {string} toolId - The ID of the tool to test
 */
async function testTool(toolId) {
    try {
        // In a real implementation, this would open a modal with a form for test input
        // For now, we'll use a simple prompt
        const testInput = prompt('Enter test input for the tool (JSON format):');
        
        if (testInput) {
            try {
                const inputData = JSON.parse(testInput);
                const testResult = await apiRequest(`/tools/${toolId}/test`, 'POST', { input_data: inputData });
                alert(`Test Result: ${JSON.stringify(testResult.output)}`);
            } catch (parseError) {
                alert('Invalid JSON input. Please enter valid JSON.');
            }
        }
    } catch (error) {
        console.error('Error testing tool:', error);
        showToast('Error testing tool', 'error');
    }
}

/**
 * Delete a tool
 * 
 * @param {string} toolId - The ID of the tool to delete
 */
async function deleteTool(toolId) {
    if (confirm('Are you sure you want to delete this tool?')) {
        try {
            await apiRequest(`/tools/${toolId}`, 'DELETE');
            showToast('Tool deleted successfully');
            
            // Reload tools
            loadTools();
        } catch (error) {
            console.error('Error deleting tool:', error);
            showToast('Error deleting tool', 'error');
        }
    }
}

