import React from 'react';

/**
 * Card component for displaying content in a card layout
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClose - Function to call when the close button is clicked
 * @param {boolean} props.loading - Whether the card is in a loading state
 * @param {string} props.footerContent - Content to display in the card footer
 */
const Card = ({ 
    title, 
    children, 
    className = '', 
    onClose, 
    loading = false,
    footerContent
}) => {
    return (
        <div className={`card ${className} ${loading ? 'card-loading' : ''}`}>
            {title && (
                <div className="card-header">
                    <h3 className="card-title">{title}</h3>
                    {onClose && (
                        <button 
                            className="card-close" 
                            onClick={onClose}
                            aria-label="Close"
                        >
                            ×
                        </button>
                    )}
                </div>
            )}
            
            <div className="card-body">
                {loading ? (
                    <div className="card-loading-indicator">
                        <div className="spinner"></div>
                        <p>Loading...</p>
                    </div>
                ) : children}
            </div>
            
            {footerContent && (
                <div className="card-footer">
                    {footerContent}
                </div>
            )}
        </div>
    );
};

export default Card;

