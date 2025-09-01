import React from 'react';

/**
 * AgentTypeSelector component for selecting agent types
 * 
 * @param {Object} props - Component props
 * @param {Array} props.agentTypes - Available agent types
 * @param {string} props.selectedType - Currently selected agent type
 * @param {Function} props.onSelect - Function to call when a type is selected
 */
const AgentTypeSelector = ({ agentTypes, selectedType, onSelect }) => {
    if (!agentTypes || agentTypes.length === 0) {
        return <div className="loading-indicator">Loading agent types...</div>;
    }
    
    return (
        <div className="agent-type-selector">
            <div className="agent-types-grid">
                {agentTypes.map(type => (
                    <div
                        key={type.id}
                        className={`agent-type-card ${selectedType === type.id ? 'selected' : ''}`}
                        onClick={() => onSelect(type.id)}
                    >
                        <div className="agent-type-icon">
                            {type.icon || getDefaultIcon(type.id)}
                        </div>
                        
                        <div className="agent-type-content">
                            <h3 className="agent-type-name">{type.name}</h3>
                            
                            <p className="agent-type-description">
                                {type.description}
                            </p>
                            
                            {type.capabilities && type.capabilities.length > 0 && (
                                <div className="agent-type-capabilities">
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
                            <div className="agent-type-selected-indicator">
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
 * Get default icon for agent type
 * 
 * @param {string} typeId - Agent type ID
 * @returns {string} - Icon for agent type
 */
const getDefaultIcon = (typeId) => {
    const icons = {
        'react': '🔄',
        'chat': '💬',
        'local': '💻',
        'parallel': '⚡',
        'remote': '🌐',
        'sse': '📡',
        'workflow': '📝',
        'default': '🤖',
    };
    
    return icons[typeId] || icons.default;
};

export default AgentTypeSelector;

