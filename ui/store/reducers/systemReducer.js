// Initial state
const initialState = {
    info: null,
    metrics: null,
    config: null,
    llmProviders: [],
    databaseConnections: [],
    loading: false,
    error: null,
    status: 'operational',
    version: null,
};

// Reducer
const systemReducer = (state = initialState, action) => {
    switch (action.type) {
        // Fetch system info
        case 'FETCH_SYSTEM_INFO_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_SYSTEM_INFO_SUCCESS':
            return {
                ...state,
                info: action.payload,
                version: action.payload.version,
                status: action.payload.status || 'operational',
                loading: false,
                error: null,
            };
        case 'FETCH_SYSTEM_INFO_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                status: 'error',
            };
            
        // Fetch system metrics
        case 'FETCH_SYSTEM_METRICS_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_SYSTEM_METRICS_SUCCESS':
            return {
                ...state,
                metrics: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_SYSTEM_METRICS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Fetch system config
        case 'FETCH_SYSTEM_CONFIG_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_SYSTEM_CONFIG_SUCCESS':
            return {
                ...state,
                config: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_SYSTEM_CONFIG_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Update system config
        case 'UPDATE_SYSTEM_CONFIG_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'UPDATE_SYSTEM_CONFIG_SUCCESS':
            return {
                ...state,
                config: action.payload,
                loading: false,
                error: null,
            };
        case 'UPDATE_SYSTEM_CONFIG_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Fetch LLM providers
        case 'FETCH_LLM_PROVIDERS_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_LLM_PROVIDERS_SUCCESS':
            return {
                ...state,
                llmProviders: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_LLM_PROVIDERS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Update LLM provider
        case 'UPDATE_LLM_PROVIDER_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'UPDATE_LLM_PROVIDER_SUCCESS':
            return {
                ...state,
                llmProviders: state.llmProviders.map(provider => 
                    provider.id === action.payload.id ? action.payload : provider
                ),
                loading: false,
                error: null,
            };
        case 'UPDATE_LLM_PROVIDER_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Fetch database connections
        case 'FETCH_DATABASE_CONNECTIONS_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_DATABASE_CONNECTIONS_SUCCESS':
            return {
                ...state,
                databaseConnections: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_DATABASE_CONNECTIONS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Update database connection
        case 'UPDATE_DATABASE_CONNECTION_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'UPDATE_DATABASE_CONNECTION_SUCCESS':
            return {
                ...state,
                databaseConnections: state.databaseConnections.map(connection => 
                    connection.id === action.payload.id ? action.payload : connection
                ),
                loading: false,
                error: null,
            };
        case 'UPDATE_DATABASE_CONNECTION_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Update system status
        case 'UPDATE_SYSTEM_STATUS':
            return {
                ...state,
                status: action.payload,
            };
            
        default:
            return state;
    }
};

export default systemReducer;

