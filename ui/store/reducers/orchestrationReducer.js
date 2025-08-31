// Initial state
const initialState = {
    items: [],
    selectedOrchestration: null,
    orchestrationTypes: [],
    loading: false,
    error: null,
};

// Reducer
const orchestrationReducer = (state = initialState, action) => {
    switch (action.type) {
        // Fetch orchestrations
        case 'FETCH_ORCHESTRATIONS_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_ORCHESTRATIONS_SUCCESS':
            return {
                ...state,
                items: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_ORCHESTRATIONS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Fetch orchestration
        case 'FETCH_ORCHESTRATION_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_ORCHESTRATION_SUCCESS':
            return {
                ...state,
                selectedOrchestration: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_ORCHESTRATION_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Fetch orchestration types
        case 'FETCH_ORCHESTRATION_TYPES_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_ORCHESTRATION_TYPES_SUCCESS':
            return {
                ...state,
                orchestrationTypes: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_ORCHESTRATION_TYPES_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Create orchestration
        case 'CREATE_ORCHESTRATION_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'CREATE_ORCHESTRATION_SUCCESS':
            return {
                ...state,
                items: [...state.items, action.payload],
                selectedOrchestration: action.payload,
                loading: false,
                error: null,
            };
        case 'CREATE_ORCHESTRATION_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Update orchestration
        case 'UPDATE_ORCHESTRATION_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'UPDATE_ORCHESTRATION_SUCCESS':
            return {
                ...state,
                items: state.items.map(item => 
                    item.id === action.payload.id ? action.payload : item
                ),
                selectedOrchestration: state.selectedOrchestration && 
                    state.selectedOrchestration.id === action.payload.id ? 
                    action.payload : state.selectedOrchestration,
                loading: false,
                error: null,
            };
        case 'UPDATE_ORCHESTRATION_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Delete orchestration
        case 'DELETE_ORCHESTRATION_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'DELETE_ORCHESTRATION_SUCCESS':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
                selectedOrchestration: state.selectedOrchestration && 
                    state.selectedOrchestration.id === action.payload ? 
                    null : state.selectedOrchestration,
                loading: false,
                error: null,
            };
        case 'DELETE_ORCHESTRATION_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
            
        // Start orchestration
        case 'START_ORCHESTRATION_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'START_ORCHESTRATION_SUCCESS':
            return {
                ...state,
                items: state.items.map(item => 
                    item.id === action.payload.id ? 
                    { ...item, status: 'active', ...action.payload.data } : item
                ),
                selectedOrchestration: state.selectedOrchestration && 
                    state.selectedOrchestration.id === action.payload.id ? 
                    { ...state.selectedOrchestration, status: 'active', ...action.payload.data } : 
                    state.selectedOrchestration,
                loading: false,
                error: null,
            };
        case 'START_ORCHESTRATION_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
            
        // Pause orchestration
        case 'PAUSE_ORCHESTRATION_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'PAUSE_ORCHESTRATION_SUCCESS':
            return {
                ...state,
                items: state.items.map(item => 
                    item.id === action.payload.id ? 
                    { ...item, status: 'paused', ...action.payload.data } : item
                ),
                selectedOrchestration: state.selectedOrchestration && 
                    state.selectedOrchestration.id === action.payload.id ? 
                    { ...state.selectedOrchestration, status: 'paused', ...action.payload.data } : 
                    state.selectedOrchestration,
                loading: false,
                error: null,
            };
        case 'PAUSE_ORCHESTRATION_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
            
        // Stop orchestration
        case 'STOP_ORCHESTRATION_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'STOP_ORCHESTRATION_SUCCESS':
            return {
                ...state,
                items: state.items.map(item => 
                    item.id === action.payload.id ? 
                    { ...item, status: 'completed', ...action.payload.data } : item
                ),
                selectedOrchestration: state.selectedOrchestration && 
                    state.selectedOrchestration.id === action.payload.id ? 
                    { ...state.selectedOrchestration, status: 'completed', ...action.payload.data } : 
                    state.selectedOrchestration,
                loading: false,
                error: null,
            };
        case 'STOP_ORCHESTRATION_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
            
        // Update orchestration (from WebSocket)
        case 'UPDATE_ORCHESTRATION':
            return {
                ...state,
                items: state.items.map(item => 
                    item.id === action.payload.id ? 
                    { ...item, ...action.payload } : item
                ),
                selectedOrchestration: state.selectedOrchestration && 
                    state.selectedOrchestration.id === action.payload.id ? 
                    { ...state.selectedOrchestration, ...action.payload } : 
                    state.selectedOrchestration,
            };
            
        default:
            return state;
    }
};

export default orchestrationReducer;

