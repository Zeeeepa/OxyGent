import React from 'react';

/**
 * Tabs component for creating tabbed interfaces
 * 
 * @param {Object} props - Component props
 * @param {string} props.activeTab - ID of the active tab
 * @param {Function} props.onChange - Function to call when a tab is clicked
 * @param {Array} props.tabs - Array of tab objects with id and label properties
 * @param {string} props.className - Additional CSS class names
 */
const Tabs = ({ activeTab, onChange, tabs, className = '' }) => {
    return (
        <div className={`tabs-container ${className}`}>
            <div className="tabs-header">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => onChange(tab.id)}
                    >
                        {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Tabs;

