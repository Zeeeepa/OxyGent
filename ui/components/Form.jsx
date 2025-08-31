import React from 'react';

/**
 * Form component for user input
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Function to call when the form is submitted
 * @param {React.ReactNode} props.children - Form content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.loading - Whether the form is in a loading state
 */
const Form = ({ 
    onSubmit, 
    children, 
    className = '', 
    loading = false 
}) => {
    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!loading && onSubmit) {
            onSubmit(event);
        }
    };
    
    return (
        <form 
            className={`form ${className} ${loading ? 'form-loading' : ''}`} 
            onSubmit={handleSubmit}
            noValidate
        >
            {loading && (
                <div className="form-loading-overlay">
                    <div className="spinner"></div>
                    <p>Processing...</p>
                </div>
            )}
            
            {children}
        </form>
    );
};

/**
 * Form group component for grouping form controls
 */
export const FormGroup = ({ 
    label, 
    htmlFor, 
    children, 
    error, 
    required = false,
    helpText
}) => {
    return (
        <div className={`form-group ${error ? 'form-group-error' : ''}`}>
            {label && (
                <label className="form-label" htmlFor={htmlFor}>
                    {label}
                    {required && <span className="form-required">*</span>}
                </label>
            )}
            
            <div className="form-control">
                {children}
            </div>
            
            {helpText && (
                <div className="form-help-text">{helpText}</div>
            )}
            
            {error && (
                <div className="form-error">{error}</div>
            )}
        </div>
    );
};

/**
 * Input component for text input
 */
export const Input = ({ 
    type = 'text', 
    id, 
    name, 
    value, 
    onChange, 
    placeholder, 
    disabled = false,
    required = false,
    min,
    max,
    step,
    pattern,
    autoComplete = 'off',
    className = ''
}) => {
    return (
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            step={step}
            pattern={pattern}
            autoComplete={autoComplete}
            className={`form-input ${className}`}
        />
    );
};

/**
 * Select component for dropdown selection
 */
export const Select = ({ 
    id, 
    name, 
    value, 
    onChange, 
    options = [], 
    disabled = false,
    required = false,
    placeholder = 'Select an option',
    className = ''
}) => {
    return (
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`form-select ${className}`}
        >
            <option value="" disabled>{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

/**
 * Textarea component for multiline text input
 */
export const Textarea = ({ 
    id, 
    name, 
    value, 
    onChange, 
    placeholder, 
    rows = 4,
    disabled = false,
    required = false,
    className = ''
}) => {
    return (
        <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            required={required}
            className={`form-textarea ${className}`}
        />
    );
};

/**
 * Checkbox component for boolean input
 */
export const Checkbox = ({ 
    id, 
    name, 
    checked, 
    onChange, 
    label, 
    disabled = false,
    required = false,
    className = ''
}) => {
    return (
        <div className={`form-checkbox ${className}`}>
            <input
                type="checkbox"
                id={id}
                name={name}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className="form-checkbox-input"
            />
            <label htmlFor={id} className="form-checkbox-label">
                {label}
            </label>
        </div>
    );
};

export default Form;

