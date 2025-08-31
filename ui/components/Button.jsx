import React from 'react';

/**
 * Button component for user interactions
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, danger, success, etc.)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.loading - Whether the button is in a loading state
 * @param {Function} props.onClick - Function to call when the button is clicked
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.icon - Icon to display in the button
 */
const Button = ({ 
    variant = 'primary', 
    size = 'medium', 
    disabled = false, 
    loading = false, 
    onClick, 
    type = 'button', 
    className = '', 
    children,
    icon
}) => {
    // Determine button classes based on props
    const buttonClasses = [
        'button',
        `button-${variant}`,
        `button-${size}`,
        disabled || loading ? 'button-disabled' : '',
        loading ? 'button-loading' : '',
        className
    ].filter(Boolean).join(' ');
    
    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading && (
                <span className="button-spinner"></span>
            )}
            
            {icon && !loading && (
                <span className="button-icon">{icon}</span>
            )}
            
            <span className="button-text">{children}</span>
        </button>
    );
};

export default Button;

