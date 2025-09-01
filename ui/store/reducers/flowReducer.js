// Initial state
const initialState = {
    items: [],
    selectedFlow: null,
    flowTypes: [],
    loading: false,
    error: null,
};

// Reducer
const flowReducer = (state = initialState, action) => {
    switch (action.type) {
        // Fetch flows
        case 'FETCH_FLOWS_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_FLOWS_SUCCESS':
            return {
                ...state,
                items: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_FLOWS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Fetch flow
        case 'FETCH_FLOW_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_FLOW_SUCCESS':
            return {
                ...state,
                selectedFlow: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_FLOW_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Fetch flow types
        case 'FETCH_FLOW_TYPES_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_FLOW_TYPES_SUCCESS':
            return {
                ...state,
                flowTypes: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_FLOW_TYPES_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Create flow
        case 'CREATE_FLOW_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'CREATE_FLOW_SUCCESS':
            return {
                ...state,
                items: [...state.items, action.payload],
                selectedFlow: action.payload,
                loading: false,
                error: null,
            };
        case 'CREATE_FLOW_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Update flow
        case 'UPDATE_FLOW_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'UPDATE_FLOW_SUCCESS':
            return {
                ...state,
                items: state.items.map(item => 
                    item.id === action.payload.id ? action.payload : item
                ),
                selectedFlow: action.payload,
                loading: false,
                error: null,
            };
        case 'UPDATE_FLOW_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Delete flow
        case 'DELETE_FLOW_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'DELETE_FLOW_SUCCESS':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
                selectedFlow: state.selectedFlow && state.selectedFlow.id === action.payload ? null : state.selectedFlow,
                loading: false,
                error: null,
            };
        case 'DELETE_FLOW_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Execute flow
        case 'EXECUTE_FLOW_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'EXECUTE_FLOW_SUCCESS':
            return {
                ...state,
                loading: false,
                error: null,
            };
        case 'EXECUTE_FLOW_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        default:
            return state;
    }
};

export default flowReducer;

