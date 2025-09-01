// Initial state
const initialState = {
    items: [],
    selectedAgent: null,
    agentTypes: [],
    loading: false,
    error: null,
};

// Reducer
const agentsReducer = (state = initialState, action) => {
    switch (action.type) {
        // Fetch agents
        case 'FETCH_AGENTS_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_AGENTS_SUCCESS':
            return {
                ...state,
                items: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_AGENTS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Fetch agent
        case 'FETCH_AGENT_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_AGENT_SUCCESS':
            return {
                ...state,
                selectedAgent: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_AGENT_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Fetch agent types
        case 'FETCH_AGENT_TYPES_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_AGENT_TYPES_SUCCESS':
            return {
                ...state,
                agentTypes: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_AGENT_TYPES_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Create agent
        case 'CREATE_AGENT_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'CREATE_AGENT_SUCCESS':
            return {
                ...state,
                items: [...state.items, action.payload],
                selectedAgent: action.payload,
                loading: false,
                error: null,
            };
        case 'CREATE_AGENT_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Update agent
        case 'UPDATE_AGENT_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'UPDATE_AGENT_SUCCESS':
            return {
                ...state,
                items: state.items.map(item => 
                    item.id === action.payload.id ? action.payload : item
                ),
                selectedAgent: action.payload,
                loading: false,
                error: null,
            };
        case 'UPDATE_AGENT_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Delete agent
        case 'DELETE_AGENT_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'DELETE_AGENT_SUCCESS':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
                selectedAgent: state.selectedAgent && state.selectedAgent.id === action.payload ? null : state.selectedAgent,
                loading: false,
                error: null,
            };
        case 'DELETE_AGENT_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Activate agent
        case 'ACTIVATE_AGENT_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'ACTIVATE_AGENT_SUCCESS':
            return {
                ...state,
                items: state.items.map(item => 
                    item.id === action.payload.id ? { ...item, isActive: true } : item
                ),
                selectedAgent: state.selectedAgent && state.selectedAgent.id === action.payload.id ? 
                    { ...state.selectedAgent, isActive: true } : state.selectedAgent,
                loading: false,
                error: null,
            };
        case 'ACTIVATE_AGENT_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Deactivate agent
        case 'DEACTIVATE_AGENT_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'DEACTIVATE_AGENT_SUCCESS':
            return {
                ...state,
                items: state.items.map(item => 
                    item.id === action.payload.id ? { ...item, isActive: false } : item
                ),
                selectedAgent: state.selectedAgent && state.selectedAgent.id === action.payload.id ? 
                    { ...state.selectedAgent, isActive: false } : state.selectedAgent,
                loading: false,
                error: null,
            };
        case 'DEACTIVATE_AGENT_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        default:
            return state;
    }
};

export default agentsReducer;

