import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Import reducers
import agentsReducer from './reducers/agentsReducer';
import toolsReducer from './reducers/toolsReducer';
import workflowsReducer from './reducers/workflowsReducer';
import systemReducer from './reducers/systemReducer';
import uiReducer from './reducers/uiReducer';
import authReducer from './reducers/authReducer';

// Combine reducers
const rootReducer = combineReducers({
    agents: agentsReducer,
    tools: toolsReducer,
    workflows: workflowsReducer,
    system: systemReducer,
    ui: uiReducer,
    auth: authReducer,
});

// Create store with middleware
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;

