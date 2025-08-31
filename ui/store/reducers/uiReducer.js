// Initial state
const initialState = {
    theme: 'light',
    sidebarExpanded: true,
    notifications: [],
    modal: null,
};

// Reducer
const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        // Toggle theme
        case 'TOGGLE_THEME':
            return {
                ...state,
                theme: state.theme === 'light' ? 'dark' : 'light',
            };
            
        // Set theme
        case 'SET_THEME':
            return {
                ...state,
                theme: action.payload,
            };
            
        // Toggle sidebar
        case 'TOGGLE_SIDEBAR':
            return {
                ...state,
                sidebarExpanded: !state.sidebarExpanded,
            };
            
        // Set sidebar expanded
        case 'SET_SIDEBAR_EXPANDED':
            return {
                ...state,
                sidebarExpanded: action.payload,
            };
            
        // Add notification
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [...state.notifications, {
                    id: Date.now(),
                    ...action.payload,
                }],
            };
            
        // Remove notification
        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter(
                    notification => notification.id !== action.payload
                ),
            };
            
        // Clear all notifications
        case 'CLEAR_NOTIFICATIONS':
            return {
                ...state,
                notifications: [],
            };
            
        // Show modal
        case 'SHOW_MODAL':
            return {
                ...state,
                modal: action.payload,
            };
            
        // Hide modal
        case 'HIDE_MODAL':
            return {
                ...state,
                modal: null,
            };
            
        default:
            return state;
    }
};

export default uiReducer;

