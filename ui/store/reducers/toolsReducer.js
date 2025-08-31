// Initial state
const initialState = {
    items: [],
    selectedTool: null,
    toolTypes: [],
    loading: false,
    error: null,
    testResult: null,
};

// Reducer
const toolsReducer = (state = initialState, action) => {
    switch (action.type) {
        // Fetch tools
        case 'FETCH_TOOLS_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_TOOLS_SUCCESS':
            return {
                ...state,
                items: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_TOOLS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Fetch tool
        case 'FETCH_TOOL_REQUEST':
            return {
                ...state,
                selectedTool: null,
                loading: true,
                error: null,
            };
        case 'FETCH_TOOL_SUCCESS':
            return {
                ...state,
                selectedTool: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_TOOL_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Create tool
        case 'CREATE_TOOL_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'CREATE_TOOL_SUCCESS':
            return {
                ...state,
                items: [...state.items, action.payload],
                selectedTool: action.payload,
                loading: false,
                error: null,
            };
        case 'CREATE_TOOL_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Update tool
        case 'UPDATE_TOOL_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'UPDATE_TOOL_SUCCESS':
            return {
                ...state,
                items: state.items.map(tool => 
                    tool.id === action.payload.id ? action.payload : tool
                ),
                selectedTool: action.payload,
                loading: false,
                error: null,
            };
        case 'UPDATE_TOOL_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Delete tool
        case 'DELETE_TOOL_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'DELETE_TOOL_SUCCESS':
            return {
                ...state,
                items: state.items.filter(tool => tool.id !== action.payload),
                selectedTool: null,
                loading: false,
                error: null,
            };
        case 'DELETE_TOOL_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Fetch tool types
        case 'FETCH_TOOL_TYPES_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_TOOL_TYPES_SUCCESS':
            return {
                ...state,
                toolTypes: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_TOOL_TYPES_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Test tool
        case 'TEST_TOOL_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
                testResult: null,
            };
        case 'TEST_TOOL_SUCCESS':
            return {
                ...state,
                testResult: action.payload,
                loading: false,
                error: null,
            };
        case 'TEST_TOOL_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                testResult: null,
            };
            
        // Clear test result
        case 'CLEAR_TOOL_TEST_RESULT':
            return {
                ...state,
                testResult: null,
            };
            
        default:
            return state;
    }
};

export default toolsReducer;

