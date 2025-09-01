// Initial state
const initialState = {
    items: [],
    selectedTool: null,
    toolTypes: [],
    loading: false,
    error: null,
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
                items: state.items.map(item => 
                    item.id === action.payload.id ? action.payload : item
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
                items: state.items.filter(item => item.id !== action.payload),
                selectedTool: state.selectedTool && state.selectedTool.id === action.payload ? null : state.selectedTool,
                loading: false,
                error: null,
            };
        case 'DELETE_TOOL_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Activate tool
        case 'ACTIVATE_TOOL_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'ACTIVATE_TOOL_SUCCESS':
            return {
                ...state,
                items: state.items.map(item => 
                    item.id === action.payload.id ? { ...item, isActive: true } : item
                ),
                selectedTool: state.selectedTool && state.selectedTool.id === action.payload.id ? 
                    { ...state.selectedTool, isActive: true } : state.selectedTool,
                loading: false,
                error: null,
            };
        case 'ACTIVATE_TOOL_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Deactivate tool
        case 'DEACTIVATE_TOOL_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'DEACTIVATE_TOOL_SUCCESS':
            return {
                ...state,
                items: state.items.map(item => 
                    item.id === action.payload.id ? { ...item, isActive: false } : item
                ),
                selectedTool: state.selectedTool && state.selectedTool.id === action.payload.id ? 
                    { ...state.selectedTool, isActive: false } : state.selectedTool,
                loading: false,
                error: null,
            };
        case 'DEACTIVATE_TOOL_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        default:
            return state;
    }
};

export default toolsReducer;

