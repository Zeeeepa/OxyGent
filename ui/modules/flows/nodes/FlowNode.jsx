import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

/**
 * FlowNode component for displaying a flow node in the flow
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Node data
 * @param {boolean} props.selected - Whether the node is selected
 */
const FlowNode = ({ data, selected }) => {
    return (
        <div className={`flow-node ${selected ? 'selected' : ''} ${data.status ? `status-${data.status}` : ''}`}>
            <Handle
                type="target"
                position={Position.Top}
                className="flow-handle flow-handle-target"
            />
            
            <div className="flow-content">
                <div className="flow-header">
                    <div className="flow-icon">📝</div>
                    <div className="flow-title">{data.label}</div>
                    {data.status && (
                        <div className={`flow-status status-${data.status}`}>
                            {data.status}
                        </div>
                    )}
                </div>
                
                {data.description && (
                    <div className="flow-description">
                        {data.description}
                    </div>
                )}
                
                {data.type && (
                    <div className="flow-type">
                        Type: {data.type}
                    </div>
                )}
                
                {data.steps && data.steps.length > 0 && (
                    <div className="flow-steps">
                        <div className="steps-label">Steps:</div>
                        <div className="steps-list">
                            {data.steps.map((step, index) => (
                                <div key={index} className="step-item">
                                    {index + 1}. {step}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <Handle
                type="source"
                position={Position.Bottom}
                className="flow-handle flow-handle-source"
            />
        </div>
    );
};

export default memo(FlowNode);

