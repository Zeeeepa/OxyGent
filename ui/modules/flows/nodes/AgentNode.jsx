import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

/**
 * AgentNode component for displaying an agent node in the flow
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Node data
 * @param {boolean} props.selected - Whether the node is selected
 */
const AgentNode = ({ data, selected }) => {
    return (
        <div className={`agent-node ${selected ? 'selected' : ''} ${data.status ? `status-${data.status}` : ''}`}>
            <Handle
                type="target"
                position={Position.Top}
                className="agent-handle agent-handle-target"
            />
            
            <div className="agent-content">
                <div className="agent-header">
                    <div className="agent-icon">🤖</div>
                    <div className="agent-title">{data.label}</div>
                    {data.status && (
                        <div className={`agent-status status-${data.status}`}>
                            {data.status}
                        </div>
                    )}
                </div>
                
                {data.description && (
                    <div className="agent-description">
                        {data.description}
                    </div>
                )}
                
                {data.type && (
                    <div className="agent-type">
                        Type: {data.type}
                    </div>
                )}
                
                {data.tools && data.tools.length > 0 && (
                    <div className="agent-tools">
                        <div className="tools-label">Tools:</div>
                        <div className="tools-list">
                            {data.tools.map((tool, index) => (
                                <div key={index} className="tool-item">
                                    {tool}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <Handle
                type="source"
                position={Position.Bottom}
                className="agent-handle agent-handle-source"
            />
        </div>
    );
};

export default memo(AgentNode);

