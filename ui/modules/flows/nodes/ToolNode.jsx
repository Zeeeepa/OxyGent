import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

/**
 * ToolNode component for displaying a tool node in the flow
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Node data
 * @param {boolean} props.selected - Whether the node is selected
 */
const ToolNode = ({ data, selected }) => {
    return (
        <div className={`tool-node ${selected ? 'selected' : ''} ${data.status ? `status-${data.status}` : ''}`}>
            <Handle
                type="target"
                position={Position.Top}
                className="tool-handle tool-handle-target"
            />
            
            <div className="tool-content">
                <div className="tool-header">
                    <div className="tool-icon">🔧</div>
                    <div className="tool-title">{data.label}</div>
                    {data.status && (
                        <div className={`tool-status status-${data.status}`}>
                            {data.status}
                        </div>
                    )}
                </div>
                
                {data.description && (
                    <div className="tool-description">
                        {data.description}
                    </div>
                )}
                
                {data.type && (
                    <div className="tool-type">
                        Type: {data.type}
                    </div>
                )}
                
                {data.parameters && data.parameters.length > 0 && (
                    <div className="tool-parameters">
                        <div className="parameters-label">Parameters:</div>
                        <div className="parameters-list">
                            {data.parameters.map((param, index) => (
                                <div key={index} className="parameter-item">
                                    {param.name}: {param.type}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <Handle
                type="source"
                position={Position.Bottom}
                className="tool-handle tool-handle-source"
            />
        </div>
    );
};

export default memo(ToolNode);

