import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// Import store
import store from './store';

// Import main App component
import App from './App';

// Import styles
import './styles/main.css';

// Create root element
const root = createRoot(document.getElementById('root'));

// Render app
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);

