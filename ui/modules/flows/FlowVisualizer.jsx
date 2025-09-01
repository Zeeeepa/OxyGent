import React, { useEffect, useRef, useState } from 'react';
import ReactFlow, { 
    Controls, 
    Background, 
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel
} from 'reactflow';
import 'reactflow/dist/style.css';

// Components
import Card from '../../components/Card';
import Button from '../../components/Button';

// Custom node types
import AgentNode from './nodes/AgentNode';
import ToolNode from './nodes/ToolNode';
import LLMNode from './nodes/LLMNode';
import FlowNode from './nodes/FlowNode';

/**
 * FlowVisualizer component for visualizing agent flows
 * 
 * @param {Object} props - Component props
 * @param {Array} props.initialNodes - Initial nodes for the flow
 * @param {Array} props.initialEdges - Initial edges for the flow
 * @param {Function} props.onNodesChange - Function to call when nodes change
 * @param {Function} props.onEdgesChange - Function to call when edges change
 * @param {Function} props.onConnect - Function to call when nodes are connected
 * @param {boolean} props.readOnly - Whether the flow is read-only
 * @param {Function} props.onNodeClick - Function to call when a node is clicked
 * @param {Function} props.onNodeDoubleClick - Function to call when a node is double-clicked
 * @param {Function} props.onPaneClick - Function to call when the pane is clicked
 * @param {Function} props.onSave - Function to call when the flow is saved
 */
const FlowVisualizer = ({
    initialNodes = [],
    initialEdges = [],
    onNodesChange,
    onEdgesChange,
    onConnect,
    readOnly = false,
    onNodeClick,
    onNodeDoubleClick,
    onPaneClick,
    onSave
}) => {
    // Flow state
    const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [viewportCenter, setViewportCenter] = useState({ x: 0, y: 0 });
    
    // Refs
    const reactFlowWrapper = useRef(null);
    const reactFlowInstance = useRef(null);
    
    // Custom node types
    const nodeTypes = {
        agentNode: AgentNode,
        toolNode: ToolNode,
        llmNode: LLMNode,
        flowNode: FlowNode,
    };
    
    // Update nodes and edges when initialNodes or initialEdges change
    useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, setNodes, setEdges]);
    
    // Handle node changes
    const handleNodesChange = (changes) => {
        onNodesChangeInternal(changes);
        if (onNodesChange) {
            onNodesChange(changes);
        }
    };
    
    // Handle edge changes
    const handleEdgesChange = (changes) => {
        onEdgesChangeInternal(changes);
        if (onEdgesChange) {
            onEdgesChange(changes);
        }
    };
    
    // Handle node connections
    const handleConnect = (params) => {
        const newEdge = {
            ...params,
            animated: true,
            style: { stroke: '#3182ce' },
        };
        
        setEdges((eds) => addEdge(newEdge, eds));
        
        if (onConnect) {
            onConnect(params);
        }
    };
    
    // Handle node selection
    const handleNodeClick = (event, node) => {
        setSelectedNode(node);
        
        if (onNodeClick) {
            onNodeClick(event, node);
        }
    };
    
    // Handle node double-click
    const handleNodeDoubleClick = (event, node) => {
        if (onNodeDoubleClick) {
            onNodeDoubleClick(event, node);
        }
    };
    
    // Handle pane click
    const handlePaneClick = (event) => {
        setSelectedNode(null);
        
        if (onPaneClick) {
            onPaneClick(event);
        }
    };
    
    // Handle flow initialization
    const onInit = (instance) => {
        reactFlowInstance.current = instance;
        
        // Center the flow
        setTimeout(() => {
            instance.fitView({ padding: 0.2 });
        }, 0);
    };
    
    // Handle viewport change
    const onViewportChange = (viewport) => {
        setZoom(viewport.zoom);
        setViewportCenter({
            x: viewport.x + (reactFlowWrapper.current?.offsetWidth || 0) / 2 / viewport.zoom,
            y: viewport.y + (reactFlowWrapper.current?.offsetHeight || 0) / 2 / viewport.zoom,
        });
    };
    
    // Handle save
    const handleSave = () => {
        if (onSave) {
            onSave(nodes, edges);
        }
    };
    
    // Center the flow
    const centerFlow = () => {
        if (reactFlowInstance.current) {
            reactFlowInstance.current.fitView({ padding: 0.2 });
        }
    };
    
    return (
        <div className="flow-visualizer">
            <div className="flow-container" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={handleEdgesChange}
                    onConnect={handleConnect}
                    onNodeClick={handleNodeClick}
                    onNodeDoubleClick={handleNodeDoubleClick}
                    onPaneClick={handlePaneClick}
                    onInit={onInit}
                    onViewportChange={onViewportChange}
                    nodeTypes={nodeTypes}
                    fitView
                    attributionPosition="bottom-right"
                    minZoom={0.1}
                    maxZoom={2}
                    defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                    nodesDraggable={!readOnly}
                    nodesConnectable={!readOnly}
                    elementsSelectable={!readOnly}
                    zoomOnScroll={true}
                    panOnScroll={false}
                    panOnDrag={true}
                    selectionOnDrag={true}
                    snapToGrid={true}
                    snapGrid={[15, 15]}
                >
                    <Background
                        variant="dots"
                        gap={24}
                        size={1}
                        color="#aaa"
                    />
                    <Controls />
                    <MiniMap
                        nodeStrokeColor={(n) => {
                            if (n.type === 'agentNode') return '#0041d0';
                            if (n.type === 'toolNode') return '#ff0072';
                            if (n.type === 'llmNode') return '#1a192b';
                            if (n.type === 'flowNode') return '#3182ce';
                            return '#eee';
                        }}
                        nodeColor={(n) => {
                            if (n.type === 'agentNode') return '#4299e1';
                            if (n.type === 'toolNode') return '#f56565';
                            if (n.type === 'llmNode') return '#805ad5';
                            if (n.type === 'flowNode') return '#3182ce';
                            return '#fff';
                        }}
                        nodeBorderRadius={2}
                    />
                    
                    {!readOnly && (
                        <Panel position="top-right">
                            <div className="flow-actions">
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={centerFlow}
                                >
                                    Center
                                </Button>
                                
                                <Button
                                    variant="primary"
                                    size="small"
                                    onClick={handleSave}
                                >
                                    Save Flow
                                </Button>
                            </div>
                        </Panel>
                    )}
                </ReactFlow>
            </div>
            
            {selectedNode && (
                <Card className="node-details">
                    <h3>Node Details</h3>
                    
                    <div className="node-info">
                        <div className="info-item">
                            <span className="info-label">ID:</span>
                            <span className="info-value">{selectedNode.id}</span>
                        </div>
                        
                        <div className="info-item">
                            <span className="info-label">Type:</span>
                            <span className="info-value">{selectedNode.type}</span>
                        </div>
                        
                        <div className="info-item">
                            <span className="info-label">Label:</span>
                            <span className="info-value">{selectedNode.data.label}</span>
                        </div>
                        
                        {selectedNode.data.description && (
                            <div className="info-item">
                                <span className="info-label">Description:</span>
                                <span className="info-value">{selectedNode.data.description}</span>
                            </div>
                        )}
                        
                        {selectedNode.data.status && (
                            <div className="info-item">
                                <span className="info-label">Status:</span>
                                <span className={`info-value status-${selectedNode.data.status}`}>
                                    {selectedNode.data.status}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {!readOnly && (
                        <div className="node-actions">
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={() => onNodeDoubleClick(null, selectedNode)}
                            >
                                Edit Node
                            </Button>
                            
                            <Button
                                variant="danger"
                                size="small"
                                onClick={() => {
                                    handleNodesChange([{ type: 'remove', id: selectedNode.id }]);
                                    setSelectedNode(null);
                                }}
                            >
                                Delete Node
                            </Button>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default FlowVisualizer;

