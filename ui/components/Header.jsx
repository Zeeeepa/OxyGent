import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

// Actions
import { toggleTheme } from '../store/actions/uiActions';

/**
 * Header component that displays the top navigation bar
 */
const Header = () => {
    const dispatch = useDispatch();
    const theme = useSelector(state => state.ui.theme);
    const user = useSelector(state => state.auth.user);
    
    // Handle theme toggle
    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };
    
    return (
        <header className="app-header">
            <div className="header-left">
                <Link to="/" className="logo">
                    <img src="/assets/images/logo.png" alt="OxyGent Logo" />
                    <span className="logo-text">OxyGent</span>
                </Link>
            </div>
            
            <div className="header-center">
                <h1 className="page-title">Multi-Agent Collaboration Framework</h1>
            </div>
            
            <div className="header-right">
                {/* Theme toggle button */}
                <button 
                    className="theme-toggle" 
                    onClick={handleThemeToggle}
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? (
                        <span className="icon icon-moon">🌙</span>
                    ) : (
                        <span className="icon icon-sun">☀️</span>
                    )}
                </button>
                
                {/* User profile */}
                {user && (
                    <div className="user-profile">
                        <span className="user-name">{user.name}</span>
                        <img 
                            src={user.avatar || '/assets/images/default-avatar.png'} 
                            alt={`${user.name}'s avatar`} 
                            className="user-avatar" 
                        />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

