import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

// Components
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * Main layout component that provides the structure for all pages
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in the content area
 */
const Layout = ({ children }) => {
    const location = useLocation();
    const systemStatus = useSelector(state => state.system.status);
    
    return (
        <div className="app-container">
            <Header />
            
            <div className="main-container">
                <Sidebar />
                
                <main className="content">
                    {/* Breadcrumb navigation */}
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        {location.pathname !== '/' && (
                            <>
                                <span className="separator">/</span>
                                <span className="current-page">
                                    {location.pathname.split('/').filter(Boolean).join(' / ')}
                                </span>
                            </>
                        )}
                    </div>
                    
                    {/* System status indicator */}
                    {systemStatus && systemStatus !== 'operational' && (
                        <div className={`system-status system-status-${systemStatus}`}>
                            System Status: {systemStatus}
                        </div>
                    )}
                    
                    {/* Main content */}
                    <div className="content-wrapper">
                        {children}
                    </div>
                </main>
            </div>
            
            <Footer />
        </div>
    );
};

export default Layout;

