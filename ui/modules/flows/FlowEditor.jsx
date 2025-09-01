import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import Card from '../../components/Card';
import Button from '../../components/Button';
import Form, { FormGroup, Input, Select, Textarea } from '../../components/Form';
import FlowVisualizer from './FlowVisualizer';

// Actions
import { flowApi, agentApi, toolApi } from '../../services/api';

/**
 * FlowEditor component for creating and editing flows
 */
const FlowEditor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { flowId } = useParams();
    
    const isEditing = !!flowId;
    
    // Redux state
    const agents = useSelector(state => state.agents.items);
    const tools = useSelector(state => state.tools.items);
    const flowTypes = useSelector(state => state.flows.flowTypes);
    const selectedFlow = useSelector(state => state.flows.selectedFlow);
    const loading = useSelector(state => state.flows.loading);
    const error = useSelector(state => state.flows.error);
    
    // Local state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        parameters: {},
    });
    
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [showNodeForm, setShowNodeForm] = useState(false);
    const [nodeFormType, setNodeFormType] = useState('agent');
    const [selectedNode, setSelectedNode] = useState(null);
    const [validation, setValidation] = useState({
        name: { valid: true, message: '' },
        type: { valid: true, message: '' },
    });
    
    // Fetch flow data when component mounts
    useEffect(() => {
        // Fetch flow types if not already loaded
        if (flowTypes.length === 0) {
            dispatch({ type: 'FETCH_FLOW_TYPES_REQUEST' });
            
            flowApi.getFlowTypes()
                .then(response => {
                    dispatch({
                        type: 'FETCH_FLOW_TYPES_SUCCESS',
                        payload: response,
                    });
                })
                .catch(error => {
                    dispatch({
                        type: 'FETCH_FLOW_TYPES_FAILURE',
                        payload: error.message,
                    });
                });
        }
        
        // Fetch agents if not already loaded
        if (agents.length === 0) {
            dispatch({ type: 'FETCH_AGENTS_REQUEST' });
            
            agentApi.getAgents()
                .then(response => {
                    dispatch({
                        type: 'FETCH_AGENTS_SUCCESS',
                        payload: response,
                    });
                })
                .catch(error => {
                    dispatch({
                        type: 'FETCH_AGENTS_FAILURE',
                        payload: error.message,
                    });
                });
        }
        
        // Fetch tools if not already loaded
        if (tools.length === 0) {
            dispatch({ type: 'FETCH_TOOLS_REQUEST' });
            
            toolApi.getTools()
                .then(response => {
                    dispatch({
                        type: 'FETCH_TOOLS_SUCCESS',
                        payload: response,
                    });
                })
                .catch(error => {
                    dispatch({
                        type: 'FETCH_TOOLS_FAILURE',
                        payload: error.message,
                    });
                });
        }
        
        // If editing, fetch flow data
        if (isEditing) {
            dispatch({ type: 'FETCH_FLOW_REQUEST', payload: flowId });
            
            flowApi.getFlow(flowId)
                .then(response => {
                    dispatch({
                        type: 'FETCH_FLOW_SUCCESS',
                        payload: response,
                    });
                    
                    setFormData({
                        name: response.name,
                        description: response.description,
                        type: response.type,
                        parameters: response.parameters || {},
                    });
                    
                    if (response.nodes && response.edges) {
                        setNodes(response.nodes);
                        setEdges(response.edges);
                    }
                })
                .catch(error => {
                    dispatch({
                        type: 'FETCH_FLOW_FAILURE',
                        payload: error.message,
                    });
                });
        }
    }, [dispatch, flowId, isEditing, flowTypes.length, agents.length, tools.length]);
    
    // Update form data when selectedFlow changes
    useEffect(() => {
        if (isEditing && selectedFlow) {
            setFormData({
                name: selectedFlow.name,
                description: selectedFlow.description,
                type: selectedFlow.type,
                parameters: selectedFlow.parameters || {},
            });
            
            if (selectedFlow.nodes && selectedFlow.edges) {
                setNodes(selectedFlow.nodes);
                setEdges(selectedFlow.edges);
            }
        }
    }, [isEditing, selectedFlow]);
    
    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        
        // Clear validation error when field is edited
        if (validation[name]) {
            setValidation(prevValidation => ({
                ...prevValidation,
                [name]: { valid: true, message: '' },
            }));
        }
    };
    
    // Handle parameter changes
    const handleParameterChange = (paramName, value) => {
        setFormData(prevData => ({
            ...prevData,
            parameters: {
                ...prevData.parameters,
                [paramName]: value,
            },
        }));
    };
    
    // Validate form
    const validateForm = () => {
        const newValidation = {
            name: { valid: true, message: '' },
            type: { valid: true, message: '' },
        };
        
        let isValid = true;
        
        // Validate name
        if (!formData.name.trim()) {
            newValidation.name = { valid: false, message: 'Name is required' };
            isValid = false;
        }
        
        // Validate type
        if (!formData.type) {
            newValidation.type = { valid: false, message: 'Flow type is required' };
            isValid = false;
        }
        
        setValidation(newValidation);
        return isValid;
    };
    
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const flowData = {
            ...formData,
            nodes,
            edges,
        };
        
        if (isEditing) {
            dispatch({ type: 'UPDATE_FLOW_REQUEST' });
            
            flowApi.updateFlow(flowId, flowData)
                .then(response => {
                    dispatch({
                        type: 'UPDATE_FLOW_SUCCESS',
                        payload: response,
                    });
                    
                    navigate(`/flows/${flowId}`);
                })
                .catch(error => {
                    dispatch({
                        type: 'UPDATE_FLOW_FAILURE',
                        payload: error.message,
                    });
                });
        } else {
            dispatch({ type: 'CREATE_FLOW_REQUEST' });
            
            flowApi.createFlow(flowData)
                .then(response => {
                    dispatch({
                        type: 'CREATE_FLOW_SUCCESS',
                        payload: response,
                    });
                    
                    navigate(`/flows/${response.id}`);
                })
                .catch(error => {
                    dispatch({
                        type: 'CREATE_FLOW_FAILURE',
                        payload: error.message,
                    });
                });
        }
    };
    
    // Handle node click
    const handleNodeClick = (event, node) => {
        setSelectedNode(node);
    };
    
    // Handle node double click
    const handleNodeDoubleClick = (event, node) => {
        setSelectedNode(node);
        setNodeFormType(node.type.replace('Node', ''));
        setShowNodeForm(true);
    };
    
    // Handle pane click
    const handlePaneClick = () => {
        setSelectedNode(null);
    };
    
    // Handle node form submission
    const handleNodeFormSubmit = (nodeData) => {
        if (selectedNode) {
            // Update existing node
            const updatedNodes = nodes.map(node => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...nodeData,
                        },
                    };
                }
                return node;
            });
            
            setNodes(updatedNodes);
        } else {
            // Create new node
            const newNode = {
                id: `${nodeFormType}-${Date.now()}`,
                type: `${nodeFormType}Node`,
                position: { x: 100, y: 100 },
                data: nodeData,
            };
            
            setNodes([...nodes, newNode]);
        }
        
        setShowNodeForm(false);
        setSelectedNode(null);
    };
    
    // Handle node form cancel
    const handleNodeFormCancel = () => {
        setShowNodeForm(false);
        setSelectedNode(null);
    };
    
    // Handle add node button click
    const handleAddNodeClick = (type) => {
        setNodeFormType(type);
        setSelectedNode(null);
        setShowNodeForm(true);
    };
    
    // Handle save flow
    const handleSaveFlow = (updatedNodes, updatedEdges) => {
        setNodes(updatedNodes);
        setEdges(updatedEdges);
    };
    
    return (
        <div className="flow-editor">
            <div className="editor-header">
                <h1>{isEditing ? 'Edit Flow' : 'Create Flow'}</h1>
                
                <div className="header-actions">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/flows')}
                    >
                        Cancel
                    </Button>
                    
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update Flow' : 'Create Flow')}
                    </Button>
                </div>
            </div>
            
            {error && (
                <div className="error-message">
                    Error: {error}
                </div>
            )}
            
            <div className="editor-layout">
                <div className="editor-sidebar">
                    <Card>
                        <h2>Flow Details</h2>
                        
                        <Form onSubmit={handleSubmit}>
                            <FormGroup
                                label="Name"
                                error={!validation.name.valid ? validation.name.message : null}
                            >
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter flow name"
                                    required
                                />
                            </FormGroup>
                            
                            <FormGroup label="Description">
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter flow description"
                                    rows={3}
                                />
                            </FormGroup>
                            
                            <FormGroup
                                label="Flow Type"
                                error={!validation.type.valid ? validation.type.message : null}
                            >
                                <Select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select flow type</option>
                                    {flowTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormGroup>
                            
                            {formData.type && flowTypes.find(type => type.id === formData.type)?.parameters && (
                                <div className="parameters-section">
                                    <h3>Parameters</h3>
                                    
                                    {flowTypes.find(type => type.id === formData.type).parameters.map(param => (
                                        <FormGroup key={param.name} label={param.label || param.name}>
                                            {param.type === 'boolean' ? (
                                                <input
                                                    type="checkbox"
                                                    checked={!!formData.parameters[param.name]}
                                                    onChange={(e) => handleParameterChange(param.name, e.target.checked)}
                                                />
                                            ) : param.type === 'select' ? (
                                                <Select
                                                    value={formData.parameters[param.name] || ''}
                                                    onChange={(e) => handleParameterChange(param.name, e.target.value)}
                                                >
                                                    <option value="">Select {param.label || param.name}</option>
                                                    {param.options && param.options.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </Select>
                                            ) : param.type === 'number' ? (
                                                <Input
                                                    type="number"
                                                    value={formData.parameters[param.name] || ''}
                                                    onChange={(e) => handleParameterChange(param.name, e.target.value)}
                                                    placeholder={param.placeholder || ''}
                                                    min={param.min}
                                                    max={param.max}
                                                    step={param.step || 1}
                                                />
                                            ) : (
                                                <Input
                                                    type="text"
                                                    value={formData.parameters[param.name] || ''}
                                                    onChange={(e) => handleParameterChange(param.name, e.target.value)}
                                                    placeholder={param.placeholder || ''}
                                                />
                                            )}
                                            
                                            {param.description && (
                                                <div className="parameter-description">
                                                    {param.description}
                                                </div>
                                            )}
                                        </FormGroup>
                                    ))}
                                </div>
                            )}
                        </Form>
                    </Card>
                    
                    <Card>
                        <h2>Add Nodes</h2>
                        
                        <div className="add-nodes-buttons">
                            <Button
                                variant="secondary"
                                onClick={() => handleAddNodeClick('agent')}
                            >
                                Add Agent
                            </Button>
                            
                            <Button
                                variant="secondary"
                                onClick={() => handleAddNodeClick('tool')}
                            >
                                Add Tool
                            </Button>
                            
                            <Button
                                variant="secondary"
                                onClick={() => handleAddNodeClick('llm')}
                            >
                                Add LLM
                            </Button>
                            
                            <Button
                                variant="secondary"
                                onClick={() => handleAddNodeClick('flow')}
                            >
                                Add Flow
                            </Button>
                        </div>
                    </Card>
                </div>
                
                <div className="editor-main">
                    <Card className="flow-visualizer-container">
                        <FlowVisualizer
                            initialNodes={nodes}
                            initialEdges={edges}
                            onNodeClick={handleNodeClick}
                            onNodeDoubleClick={handleNodeDoubleClick}
                            onPaneClick={handlePaneClick}
                            onSave={handleSaveFlow}
                        />
                    </Card>
                </div>
            </div>
            
            {showNodeForm && (
                <NodeForm
                    type={nodeFormType}
                    node={selectedNode}
                    agents={agents}
                    tools={tools}
                    onSubmit={handleNodeFormSubmit}
                    onCancel={handleNodeFormCancel}
                />
            )}
        </div>
    );
};

/**
 * NodeForm component for creating and editing nodes
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Node type
 * @param {Object} props.node - Node data
 * @param {Array} props.agents - Available agents
 * @param {Array} props.tools - Available tools
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {Function} props.onCancel - Function to call when form is cancelled
 */
const NodeForm = ({ type, node, agents, tools, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        label: '',
        description: '',
    });
    
    // Initialize form data from node
    useEffect(() => {
        if (node) {
            setFormData({
                ...node.data,
            });
        }
    }, [node]);
    
    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };
    
    return (
        <div className="node-form-overlay">
            <Card className="node-form">
                <h2>{node ? `Edit ${type} Node` : `Add ${type} Node`}</h2>
                
                <Form onSubmit={handleSubmit}>
                    <FormGroup label="Label">
                        <Input
                            type="text"
                            name="label"
                            value={formData.label}
                            onChange={handleInputChange}
                            placeholder={`Enter ${type} label`}
                            required
                        />
                    </FormGroup>
                    
                    <FormGroup label="Description">
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder={`Enter ${type} description`}
                            rows={3}
                        />
                    </FormGroup>
                    
                    {type === 'agent' && (
                        <>
                            <FormGroup label="Agent Type">
                                <Select
                                    name="type"
                                    value={formData.type || ''}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select agent type</option>
                                    <option value="react">ReAct Agent</option>
                                    <option value="chat">Chat Agent</option>
                                    <option value="local">Local Agent</option>
                                    <option value="parallel">Parallel Agent</option>
                                    <option value="remote">Remote Agent</option>
                                </Select>
                            </FormGroup>
                            
                            <FormGroup label="Tools">
                                <Select
                                    name="tools"
                                    multiple
                                    value={formData.tools || []}
                                    onChange={(e) => {
                                        const selectedTools = Array.from(e.target.selectedOptions).map(option => option.value);
                                        setFormData(prevData => ({
                                            ...prevData,
                                            tools: selectedTools,
                                        }));
                                    }}
                                    size={5}
                                >
                                    {tools.map(tool => (
                                        <option key={tool.id} value={tool.id}>
                                            {tool.name}
                                        </option>
                                    ))}
                                </Select>
                                <div className="form-help-text">
                                    Hold Ctrl/Cmd to select multiple tools
                                </div>
                            </FormGroup>
                        </>
                    )}
                    
                    {type === 'tool' && (
                        <FormGroup label="Tool Type">
                            <Select
                                name="type"
                                value={formData.type || ''}
                                onChange={handleInputChange}
                            >
                                <option value="">Select tool type</option>
                                <option value="http">HTTP Tool</option>
                                <option value="function">Function Tool</option>
                                <option value="mcp">MCP Tool</option>
                                <option value="search">Search Tool</option>
                                <option value="file">File Tool</option>
                                <option value="math">Math Tool</option>
                            </Select>
                        </FormGroup>
                    )}
                    
                    {type === 'llm' && (
                        <>
                            <FormGroup label="Provider">
                                <Select
                                    name="provider"
                                    value={formData.provider || ''}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select provider</option>
                                    <option value="openai">OpenAI</option>
                                    <option value="anthropic">Anthropic</option>
                                    <option value="google">Google</option>
                                    <option value="local">Local</option>
                                </Select>
                            </FormGroup>
                            
                            <FormGroup label="Model">
                                <Input
                                    type="text"
                                    name="model"
                                    value={formData.model || ''}
                                    onChange={handleInputChange}
                                    placeholder="Enter model name"
                                />
                            </FormGroup>
                        </>
                    )}
                    
                    {type === 'flow' && (
                        <FormGroup label="Flow Type">
                            <Select
                                name="type"
                                value={formData.type || ''}
                                onChange={handleInputChange}
                            >
                                <option value="">Select flow type</option>
                                <option value="parallel">Parallel Flow</option>
                                <option value="planAndSolve">Plan and Solve Flow</option>
                                <option value="reflexion">Reflexion Flow</option>
                                <option value="workflow">Workflow Flow</option>
                            </Select>
                        </FormGroup>
                    )}
                    
                    <div className="form-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        
                        <Button
                            type="submit"
                            variant="primary"
                        >
                            {node ? 'Update Node' : 'Add Node'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default FlowEditor;

