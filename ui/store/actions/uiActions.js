/**
 * Toggle theme between light and dark
 * 
 * @returns {Object} Action object
 */
export const toggleTheme = () => ({
    type: 'TOGGLE_THEME',
});

/**
 * Set theme to a specific value
 * 
 * @param {string} theme - Theme to set (light or dark)
 * @returns {Object} Action object
 */
export const setTheme = (theme) => ({
    type: 'SET_THEME',
    payload: theme,
});

/**
 * Toggle sidebar expanded state
 * 
 * @returns {Object} Action object
 */
export const toggleSidebar = () => ({
    type: 'TOGGLE_SIDEBAR',
});

/**
 * Set sidebar expanded state
 * 
 * @param {boolean} expanded - Whether the sidebar is expanded
 * @returns {Object} Action object
 */
export const setSidebarExpanded = (expanded) => ({
    type: 'SET_SIDEBAR_EXPANDED',
    payload: expanded,
});

/**
 * Add a notification
 * 
 * @param {Object} notification - Notification object
 * @param {string} notification.type - Notification type (success, error, warning, info)
 * @param {string} notification.message - Notification message
 * @param {number} notification.duration - Notification duration in milliseconds
 * @returns {Object} Action object
 */
export const addNotification = (notification) => ({
    type: 'ADD_NOTIFICATION',
    payload: notification,
});

/**
 * Remove a notification
 * 
 * @param {number} id - Notification ID
 * @returns {Object} Action object
 */
export const removeNotification = (id) => ({
    type: 'REMOVE_NOTIFICATION',
    payload: id,
});

/**
 * Clear all notifications
 * 
 * @returns {Object} Action object
 */
export const clearNotifications = () => ({
    type: 'CLEAR_NOTIFICATIONS',
});

/**
 * Show a modal
 * 
 * @param {Object} modal - Modal configuration
 * @param {string} modal.type - Modal type
 * @param {Object} modal.props - Modal props
 * @returns {Object} Action object
 */
export const showModal = (modal) => ({
    type: 'SHOW_MODAL',
    payload: modal,
});

/**
 * Hide the current modal
 * 
 * @returns {Object} Action object
 */
export const hideModal = () => ({
    type: 'HIDE_MODAL',
});

