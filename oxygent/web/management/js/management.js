/**
 * OxyGent Management Interface - Main JavaScript
 * 
 * This file contains the core functionality for the OxyGent management interface.
 */

// Global variables
let currentSection = 'dashboard';
let apiBaseUrl = '/api/v1';

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize dashboard
    loadDashboardData();
    
    // Initialize sections
    initAgentsSection();
    initToolsSection();
    initWorkflowsSection();
    initMasSection();
    initSystemSection();
    initDocsSection();
    
    // Initialize modals
    initModals();
    
    // Initialize toast notifications
    initToast();
});

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Update active nav item
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // Update active section
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(`${target}-section`).classList.add('active');
            
            // Update current section
            currentSection = target;
            
            // Refresh data for the section
            if (target === 'dashboard') {
                loadDashboardData();
            } else if (target === 'agents') {
                loadAgents();
            } else if (target === 'tools') {
                loadTools();
            } else if (target === 'workflows') {
                loadWorkflows();
            } else if (target === 'mas') {
                loadMasInstances();
            } else if (target === 'system') {
                loadSystemConfig();
            }
        });
    });
}

/**
 * Initialize modal functionality
 */
function initModals() {
    // Close modal when clicking the close button or outside the modal
    const closeButtons = document.querySelectorAll('.close-modal, .cancel-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Initialize agent modal
    document.getElementById('create-agent-btn').addEventListener('click', function() {
        openAgentModal();
    });
    
    // Initialize tool modal
    document.getElementById('create-tool-btn').addEventListener('click', function() {
        openToolModal();
    });
    
    // Initialize workflow modal
    document.getElementById('create-workflow-btn').addEventListener('click', function() {
        openWorkflowModal();
    });
    
    // Initialize MAS modal
    document.getElementById('create-mas-btn').addEventListener('click', function() {
        openMasModal();
    });
}

/**
 * Initialize toast notification functionality
 */
function initToast() {
    // Toast will be shown by the showToast function
}

/**
 * Show a toast notification
 * 
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning)
 * @param {number} duration - The duration in milliseconds
 */
function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set message and type
    toastMessage.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type);
    
    // Show toast
    toast.style.display = 'block';
    
    // Hide toast after duration
    setTimeout(() => {
        toast.style.display = 'none';
    }, duration);
}

/**
 * Load dashboard data
 */
function loadDashboardData() {
    // In a real implementation, this would fetch data from the API
    
    // For now, we'll use mock data
    document.getElementById('agent-count').textContent = '5';
    document.getElementById('tool-count').textContent = '12';
    document.getElementById('workflow-count').textContent = '3';
    document.getElementById('mas-count').textContent = '2';
    
    // Load charts (in a real implementation)
    // loadAgentActivityChart();
    // loadToolUsageChart();
    
    // Load recent activity (in a real implementation)
    // loadRecentActivity();
}

/**
 * Initialize documentation section
 */
function initDocsSection() {
    const docsItems = document.querySelectorAll('.docs-item');
    
    docsItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Update active docs item
            docsItems.forEach(docsItem => docsItem.classList.remove('active'));
            this.classList.add('active');
            
            // Update active docs section
            const docsSections = document.querySelectorAll('.docs-section');
            docsSections.forEach(section => section.classList.remove('active'));
            document.getElementById(`${target}-docs`).classList.add('active');
        });
    });
}

/**
 * Make an API request
 * 
 * @param {string} endpoint - The API endpoint
 * @param {string} method - The HTTP method
 * @param {object} data - The request data
 * @returns {Promise} - The API response
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
    const url = `${apiBaseUrl}${endpoint}`;
    
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'API request failed');
        }
        
        if (method === 'DELETE') {
            return { success: true };
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        showToast(error.message, 'error');
        throw error;
    }
}

