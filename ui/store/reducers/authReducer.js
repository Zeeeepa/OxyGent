// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Reducer
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        // Login
        case 'LOGIN_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            
        // Logout
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null,
            };
            
        // Check auth
        case 'CHECK_AUTH_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'CHECK_AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
                error: null,
            };
        case 'CHECK_AUTH_FAILURE':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload,
            };
            
        default:
            return state;
    }
};

export default authReducer;

