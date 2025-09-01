import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

/**
 * LLMNode component for displaying an LLM node in the flow
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Node data
 * @param {boolean} props.selected - Whether the node is selected
 */
const LLMNode = ({ data, selected }) => {
    return (
        <div className={`llm-node ${selected ? 'selected' : ''} ${data.status ? `status-${data.status}` : ''}`}>
            <Handle
                type="target"
                position={Position.Top}
                className="llm-handle llm-handle-target"
            />
            
            <div className="llm-content">
                <div className="llm-header">
                    <div className="llm-icon">🧠</div>
                    <div className="llm-title">{data.label}</div>
                    {data.status && (
                        <div className={`llm-status status-${data.status}`}>
                            {data.status}
                        </div>
                    )}
                </div>
                
                {data.description && (
                    <div className="llm-description">
                        {data.description}
                    </div>
                )}
                
                {data.provider && (
                    <div className="llm-provider">
                        Provider: {data.provider}
                    </div>
                )}
                
                {data.model && (
                    <div className="llm-model">
                        Model: {data.model}
                    </div>
                )}
                
                {data.parameters && Object.keys(data.parameters).length > 0 && (
                    <div className="llm-parameters">
                        <div className="parameters-label">Parameters:</div>
                        <div className="parameters-list">
                            {Object.entries(data.parameters).map(([key, value], index) => (
                                <div key={index} className="parameter-item">
                                    {key}: {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <Handle
                type="source"
                position={Position.Bottom}
                className="llm-handle llm-handle-source"
            />
        </div>
    );
};

export default memo(LLMNode);

