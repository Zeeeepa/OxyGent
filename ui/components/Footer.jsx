import React from 'react';
import { useSelector } from 'react-redux';

/**
 * Footer component that displays the application footer
 */
const Footer = () => {
    const version = useSelector(state => state.system.version);
    
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="footer-left">
                    <p className="copyright">
                        &copy; {new Date().getFullYear()} OxyGent. All rights reserved.
                    </p>
                </div>
                
                <div className="footer-center">
                    <p className="version">
                        Version: {version || 'Unknown'}
                    </p>
                </div>
                
                <div className="footer-right">
                    <a href="https://github.com/jd-opensource/OxyGent" target="_blank" rel="noopener noreferrer" className="github-link">
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

