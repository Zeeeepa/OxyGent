// Initial state
const initialState = {
    items: [],
    selectedWorkflow: null,
    workflowTypes: [],
    loading: false,
    error: null,
    executionResult: null,
    executionStatus: null,
};

// Reducer
const workflowsReducer = (state = initialState, action) => {
    switch (action.type) {
        // Fetch workflows
        case 'FETCH_WORKFLOWS_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_WORKFLOWS_SUCCESS':
            return {
                ...state,
                items: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_WORKFLOWS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Fetch workflow
        case 'FETCH_WORKFLOW_REQUEST':
            return {
                ...state,
                selectedWorkflow: null,
                loading: true,
                error: null,
            };
        case 'FETCH_WORKFLOW_SUCCESS':
            return {
                ...state,
                selectedWorkflow: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_WORKFLOW_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Create workflow
        case 'CREATE_WORKFLOW_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'CREATE_WORKFLOW_SUCCESS':
            return {
                ...state,
                items: [...state.items, action.payload],
                selectedWorkflow: action.payload,
                loading: false,
                error: null,
            };
        case 'CREATE_WORKFLOW_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Update workflow
        case 'UPDATE_WORKFLOW_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'UPDATE_WORKFLOW_SUCCESS':
            return {
                ...state,
                items: state.items.map(workflow => 
                    workflow.id === action.payload.id ? action.payload : workflow
                ),
                selectedWorkflow: action.payload,
                loading: false,
                error: null,
            };
        case 'UPDATE_WORKFLOW_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Delete workflow
        case 'DELETE_WORKFLOW_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'DELETE_WORKFLOW_SUCCESS':
            return {
                ...state,
                items: state.items.filter(workflow => workflow.id !== action.payload),
                selectedWorkflow: null,
                loading: false,
                error: null,
            };
        case 'DELETE_WORKFLOW_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Fetch workflow types
        case 'FETCH_WORKFLOW_TYPES_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_WORKFLOW_TYPES_SUCCESS':
            return {
                ...state,
                workflowTypes: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_WORKFLOW_TYPES_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Execute workflow
        case 'EXECUTE_WORKFLOW_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
                executionResult: null,
                executionStatus: 'running',
            };
        case 'EXECUTE_WORKFLOW_SUCCESS':
            return {
                ...state,
                executionResult: action.payload,
                executionStatus: 'completed',
                loading: false,
                error: null,
            };
        case 'EXECUTE_WORKFLOW_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                executionStatus: 'failed',
            };
            
        // Update execution status
        case 'UPDATE_EXECUTION_STATUS':
            return {
                ...state,
                executionStatus: action.payload,
            };
            
        // Clear execution result
        case 'CLEAR_EXECUTION_RESULT':
            return {
                ...state,
                executionResult: null,
                executionStatus: null,
            };
            
        default:
            return state;
    }
};

export default workflowsReducer;

