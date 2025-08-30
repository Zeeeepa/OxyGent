/**
 * OxyGent Management Interface - System JavaScript
 * 
 * This file contains the functionality for managing system configuration in the OxyGent framework.
 */

// Global variables for system configuration
let systemConfig = null;

/**
 * Initialize system section
 */
function initSystemSection() {
    // Initialize form submission
    document.getElementById('general-settings-form').addEventListener('submit', function(event) {
        event.preventDefault();
        saveGeneralSettings();
    });
    
    // Initialize reset button
    document.querySelector('#general-settings-form .reset-btn').addEventListener('click', function() {
        loadSystemConfig();
    });
    
    // Initialize import/export buttons
    document.getElementById('import-config-btn').addEventListener('click', function() {
        importConfig();
    });
    
    document.getElementById('export-config-btn').addEventListener('click', function() {
        exportConfig();
    });
    
    // Initialize restart button
    document.getElementById('restart-system-btn').addEventListener('click', function() {
        restartSystem();
    });
    
    // Initialize add LLM button
    document.getElementById('add-llm-btn').addEventListener('click', function() {
        addLlm();
    });
    
    // Initialize add database button
    document.getElementById('add-db-btn').addEventListener('click', function() {
        addDatabase();
    });
    
    // Load system configuration
    loadSystemConfig();
}

/**
 * Load system configuration from the API
 */
async function loadSystemConfig() {
    try {
        systemConfig = await apiRequest('/system/config');
        renderSystemConfig();
    } catch (error) {
        console.error('Error loading system configuration:', error);
        // For development, use mock data if API is not available
        systemConfig = {
            llm_configs: [
                {
                    name: 'default_llm',
                    api_key: '***',
                    base_url: 'https://api.example.com',
                    model_name: 'example-model',
                    default_params: {
                        temperature: 0.7,
                        max_tokens: 1000
                    }
                }
            ],
            database_configs: [
                {
                    type: 'elasticsearch',
                    connection_string: 'http://localhost:9200',
                    config: {
                        index_prefix: 'oxygent_'
                    }
                }
            ],
            log_level: 'INFO',
            cache_dir: '/tmp/oxygent_cache',
            additional_config: {
                web_service_port: 8000,
                enable_monitoring: true
            }
        };
        renderSystemConfig();
    }
}

/**
 * Render system configuration
 */
function renderSystemConfig() {
    // Render LLM configurations
    renderLlmConfigs();
    
    // Render database configurations
    renderDatabaseConfigs();
    
    // Render general settings
    renderGeneralSettings();
}

/**
 * Render LLM configurations
 */
function renderLlmConfigs() {
    const llmConfigList = document.getElementById('llm-config-list');
    llmConfigList.innerHTML = '';
    
    if (!systemConfig.llm_configs || systemConfig.llm_configs.length === 0) {
        llmConfigList.innerHTML = '<p>No LLM configurations found</p>';
        return;
    }
    
    systemConfig.llm_configs.forEach((llm, index) => {
        const llmConfig = document.createElement('div');
        llmConfig.className = 'config-item';
        
        llmConfig.innerHTML = `
            <div class="config-header">
                <h4>${llm.name}</h4>
                <div class="config-actions">
                    <button class="action-btn edit-llm" data-index="${index}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-llm" data-index="${index}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="config-details">
                <div class="config-row">
                    <span class="config-label">Model:</span>
                    <span class="config-value">${llm.model_name || '-'}</span>
                </div>
                <div class="config-row">
                    <span class="config-label">Base URL:</span>
                    <span class="config-value">${llm.base_url || '-'}</span>
                </div>
                <div class="config-row">
                    <span class="config-label">API Key:</span>
                    <span class="config-value">***</span>
                </div>
            </div>
        `;
        
        llmConfigList.appendChild(llmConfig);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.action-btn.edit-llm').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            editLlm(index);
        });
    });
    
    document.querySelectorAll('.action-btn.delete-llm').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteLlm(index);
        });
    });
}

/**
 * Render database configurations
 */
function renderDatabaseConfigs() {
    const dbConfigList = document.getElementById('db-config-list');
    dbConfigList.innerHTML = '';
    
    if (!systemConfig.database_configs || systemConfig.database_configs.length === 0) {
        dbConfigList.innerHTML = '<p>No database configurations found</p>';
        return;
    }
    
    systemConfig.database_configs.forEach((db, index) => {
        const dbConfig = document.createElement('div');
        dbConfig.className = 'config-item';
        
        dbConfig.innerHTML = `
            <div class="config-header">
                <h4>${db.type}</h4>
                <div class="config-actions">
                    <button class="action-btn edit-db" data-index="${index}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-db" data-index="${index}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="config-details">
                <div class="config-row">
                    <span class="config-label">Connection:</span>
                    <span class="config-value">${db.connection_string || '-'}</span>
                </div>
            </div>
        `;
        
        dbConfigList.appendChild(dbConfig);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.action-btn.edit-db').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            editDatabase(index);
        });
    });
    
    document.querySelectorAll('.action-btn.delete-db').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteDatabase(index);
        });
    });
}

/**
 * Render general settings
 */
function renderGeneralSettings() {
    // Set log level
    document.getElementById('log-level').value = systemConfig.log_level || 'INFO';
    
    // Set cache directory
    document.getElementById('cache-dir').value = systemConfig.cache_dir || '';
}

/**
 * Save general settings
 */
async function saveGeneralSettings() {
    // Get form values
    const logLevel = document.getElementById('log-level').value;
    const cacheDir = document.getElementById('cache-dir').value;
    
    // Update system configuration
    systemConfig.log_level = logLevel;
    systemConfig.cache_dir = cacheDir;
    
    try {
        await apiRequest('/system/config', 'PUT', systemConfig);
        showToast('Settings saved successfully');
    } catch (error) {
        console.error('Error saving settings:', error);
        showToast('Error saving settings', 'error');
    }
}

/**
 * Add a new LLM configuration
 */
function addLlm() {
    // In a real implementation, this would open a modal with a form
    // For brevity, we'll just show a placeholder
    alert('LLM configuration modal would open here');
}

/**
 * Edit an LLM configuration
 * 
 * @param {number} index - The index of the LLM configuration to edit
 */
function editLlm(index) {
    // In a real implementation, this would open a modal with a form
    // For brevity, we'll just show a placeholder
    alert(`Editing LLM configuration at index: ${index}`);
}

/**
 * Delete an LLM configuration
 * 
 * @param {number} index - The index of the LLM configuration to delete
 */
function deleteLlm(index) {
    if (confirm('Are you sure you want to delete this LLM configuration?')) {
        systemConfig.llm_configs.splice(index, 1);
        
        // Update system configuration
        updateSystemConfig();
    }
}

/**
 * Add a new database configuration
 */
function addDatabase() {
    // In a real implementation, this would open a modal with a form
    // For brevity, we'll just show a placeholder
    alert('Database configuration modal would open here');
}

/**
 * Edit a database configuration
 * 
 * @param {number} index - The index of the database configuration to edit
 */
function editDatabase(index) {
    // In a real implementation, this would open a modal with a form
    // For brevity, we'll just show a placeholder
    alert(`Editing database configuration at index: ${index}`);
}

/**
 * Delete a database configuration
 * 
 * @param {number} index - The index of the database configuration to delete
 */
function deleteDatabase(index) {
    if (confirm('Are you sure you want to delete this database configuration?')) {
        systemConfig.database_configs.splice(index, 1);
        
        // Update system configuration
        updateSystemConfig();
    }
}

/**
 * Update system configuration
 */
async function updateSystemConfig() {
    try {
        await apiRequest('/system/config', 'PUT', systemConfig);
        showToast('Configuration updated successfully');
        
        // Reload system configuration
        loadSystemConfig();
    } catch (error) {
        console.error('Error updating configuration:', error);
        showToast('Error updating configuration', 'error');
    }
}

/**
 * Import system configuration
 */
function importConfig() {
    // In a real implementation, this would open a file upload dialog
    // For brevity, we'll just show a placeholder
    alert('Configuration import dialog would open here');
}

/**
 * Export system configuration
 */
async function exportConfig() {
    try {
        const exportResult = await apiRequest('/system/export', 'GET');
        
        // In a real implementation, this would trigger a file download
        alert(`Configuration exported successfully. Download URL: ${exportResult.download_url}`);
    } catch (error) {
        console.error('Error exporting configuration:', error);
        showToast('Error exporting configuration', 'error');
    }
}

/**
 * Restart the system
 */
async function restartSystem() {
    if (confirm('Are you sure you want to restart the system? This will disconnect all active sessions.')) {
        try {
            await apiRequest('/system/restart', 'POST');
            showToast('System restart initiated');
        } catch (error) {
            console.error('Error restarting system:', error);
            showToast('Error restarting system', 'error');
        }
    }
}

