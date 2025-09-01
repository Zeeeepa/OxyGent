import React from 'react';

/**
 * ToolTypeSelector component for selecting tool types
 * 
 * @param {Object} props - Component props
 * @param {Array} props.toolTypes - Available tool types
 * @param {string} props.selectedType - Currently selected tool type
 * @param {Function} props.onSelect - Function to call when a type is selected
 */
const ToolTypeSelector = ({ toolTypes, selectedType, onSelect }) => {
    if (!toolTypes || toolTypes.length === 0) {
        return <div className="loading-indicator">Loading tool types...</div>;
    }
    
    return (
        <div className="tool-type-selector">
            <div className="tool-types-grid">
                {toolTypes.map(type => (
                    <div
                        key={type.id}
                        className={`tool-type-card ${selectedType === type.id ? 'selected' : ''}`}
                        onClick={() => onSelect(type.id)}
                    >
                        <div className="tool-type-icon">
                            {type.icon || getDefaultIcon(type.id)}
                        </div>
                        
                        <div className="tool-type-content">
                            <h3 className="tool-type-name">{type.name}</h3>
                            
                            <p className="tool-type-description">
                                {type.description}
                            </p>
                            
                            {type.capabilities && type.capabilities.length > 0 && (
                                <div className="tool-type-capabilities">
                                    <h4>Capabilities:</h4>
                                    <ul>
                                        {type.capabilities.map((capability, index) => (
                                            <li key={index}>{capability}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        
                        {selectedType === type.id && (
                            <div className="tool-type-selected-indicator">
                                ✓
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Get default icon for tool type
 * 
 * @param {string} typeId - Tool type ID
 * @returns {string} - Icon for tool type
 */
const getDefaultIcon = (typeId) => {
    const icons = {
        'http': '🌐',
        'function': '⚙️',
        'mcp': '🔌',
        'search': '🔍',
        'file': '📁',
        'math': '🧮',
        'request': '📡',
        'sql': '💾',
        'time': '⏰',
        'default': '🔧',
    };
    
    return icons[typeId] || icons.default;
};

export default ToolTypeSelector;

