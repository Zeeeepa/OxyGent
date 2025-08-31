import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import Card from '../../components/Card';
import Button from '../../components/Button';
import Form, { FormGroup, Input, Select, Textarea } from '../../components/Form';

// Actions
import { workflowApi } from '../../services/api';

/**
 * WorkflowDesigner component for creating and editing workflows
 */
const WorkflowDesigner = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { workflowId } = useParams();
    
    const canvasRef = useRef(null);
    
    const workflow = useSelector(state => state.workflows.selectedWorkflow);
    const workflowTypes = useSelector(state => state.workflows.workflowTypes);
    const agents = useSelector(state => state.agents.items);
    const loading = useSelector(state => state.workflows.loading);
    const error = useSelector(state => state.workflows.error);
    
    // Determine if we're editing an existing workflow or creating a new one
    const isEditing = !!workflowId;
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        desc: '',
        nodes: [],
        edges: [],
    });
    
    // Canvas state
    const [canvasState, setCanvasState] = useState({
        isDragging: false,
        draggedNode: null,
        selectedNode: null,
        selectedEdge: null,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
    });
    
    // Form validation
    const [errors, setErrors] = useState({});
    
    // Fetch workflow types and agents on component mount
    useEffect(() => {
        // Fetch workflow types
        dispatch({ type: 'FETCH_WORKFLOW_TYPES_REQUEST' });
        
        workflowApi.getWorkflowTypes()
            .then(response => {
                dispatch({
                    type: 'FETCH_WORKFLOW_TYPES_SUCCESS',
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: 'FETCH_WORKFLOW_TYPES_FAILURE',
                    payload: error.message,
                });
            });
        
        // Fetch agents
        dispatch({ type: 'FETCH_AGENTS_REQUEST' });
        
        workflowApi.getAgents()
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
        
        // If editing, fetch the workflow
        if (isEditing) {
            dispatch({ type: 'FETCH_WORKFLOW_REQUEST' });
            
            workflowApi.getWorkflow(workflowId)
                .then(response => {
                    dispatch({
                        type: 'FETCH_WORKFLOW_SUCCESS',
                        payload: response,
                    });
                    
                    // Initialize form data with workflow data
                    setFormData({
                        name: response.name,
                        type: response.type,
                        desc: response.desc || '',
                        nodes: response.nodes || [],
                        edges: response.edges || [],
                    });
                })
                .catch(error => {
                    dispatch({
                        type: 'FETCH_WORKFLOW_FAILURE',
                        payload: error.message,
                    });
                });
        }
    }, [dispatch, workflowId, isEditing]);
    
    // Initialize canvas when component mounts
    useEffect(() => {
        if (canvasRef.current) {
            initCanvas();
        }
    }, [canvasRef, formData.nodes, formData.edges]);
    
    // Initialize canvas
    const initCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw nodes
        formData.nodes.forEach(node => {
            drawNode(ctx, node);
        });
        
        // Draw edges
        formData.edges.forEach(edge => {
            const sourceNode = formData.nodes.find(node => node.id === edge.source);
            const targetNode = formData.nodes.find(node => node.id === edge.target);
            
            if (sourceNode && targetNode) {
                drawEdge(ctx, sourceNode, targetNode, edge);
            }
        });
    };
    
    // Draw a node on the canvas
    const drawNode = (ctx, node) => {
        const { x, y, width, height, type, name } = node;
        const isSelected = canvasState.selectedNode?.id === node.id;
        
        // Draw node background
        ctx.fillStyle = getNodeColor(type);
        ctx.strokeStyle = isSelected ? '#4f46e5' : '#64748b';
        ctx.lineWidth = isSelected ? 3 : 1;
        
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 8);
        ctx.fill();
        ctx.stroke();
        
        // Draw node text
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name, x + width / 2, y + height / 2);
    };
    
    // Draw an edge on the canvas
    const drawEdge = (ctx, sourceNode, targetNode, edge) => {
        const isSelected = canvasState.selectedEdge?.id === edge.id;
        
        // Calculate source and target points
        const sourceX = sourceNode.x + sourceNode.width / 2;
        const sourceY = sourceNode.y + sourceNode.height / 2;
        const targetX = targetNode.x + targetNode.width / 2;
        const targetY = targetNode.y + targetNode.height / 2;
        
        // Draw edge
        ctx.strokeStyle = isSelected ? '#4f46e5' : '#64748b';
        ctx.lineWidth = isSelected ? 3 : 1;
        
        ctx.beginPath();
        ctx.moveTo(sourceX, sourceY);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        
        // Draw arrow
        const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
        const arrowSize = 10;
        
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(
            targetX - arrowSize * Math.cos(angle - Math.PI / 6),
            targetY - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            targetX - arrowSize * Math.cos(angle + Math.PI / 6),
            targetY - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
    };
    
    // Get node color based on type
    const getNodeColor = (type) => {
        switch (type) {
            case 'start':
                return '#10b981';
            case 'end':
                return '#ef4444';
            case 'agent':
                return '#3b82f6';
            case 'flow':
                return '#f59e0b';
            default:
                return '#64748b';
        }
    };
    
    // Handle form input change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        
        // Clear error for the field
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: null,
            }));
        }
    };
    
    // Handle canvas mouse down
    const handleCanvasMouseDown = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Check if a node was clicked
        const clickedNode = formData.nodes.find(node => 
            x >= node.x && x <= node.x + node.width &&
            y >= node.y && y <= node.y + node.height
        );
        
        if (clickedNode) {
            setCanvasState(prevState => ({
                ...prevState,
                isDragging: true,
                draggedNode: clickedNode,
                selectedNode: clickedNode,
                selectedEdge: null,
            }));
        } else {
            // Check if an edge was clicked
            const clickedEdge = formData.edges.find(edge => {
                const sourceNode = formData.nodes.find(node => node.id === edge.source);
                const targetNode = formData.nodes.find(node => node.id === edge.target);
                
                if (!sourceNode || !targetNode) {
                    return false;
                }
                
                const sourceX = sourceNode.x + sourceNode.width / 2;
                const sourceY = sourceNode.y + sourceNode.height / 2;
                const targetX = targetNode.x + targetNode.width / 2;
                const targetY = targetNode.y + targetNode.height / 2;
                
                // Calculate distance from point to line
                const lineLength = Math.sqrt(
                    Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2)
                );
                
                const distance = Math.abs(
                    (targetY - sourceY) * x - (targetX - sourceX) * y + targetX * sourceY - targetY * sourceX
                ) / lineLength;
                
                return distance < 5;
            });
            
            if (clickedEdge) {
                setCanvasState(prevState => ({
                    ...prevState,
                    selectedNode: null,
                    selectedEdge: clickedEdge,
                }));
            } else {
                setCanvasState(prevState => ({
                    ...prevState,
                    selectedNode: null,
                    selectedEdge: null,
                }));
            }
        }
    };
    
    // Handle canvas mouse move
    const handleCanvasMouseMove = (event) => {
        if (!canvasState.isDragging || !canvasState.draggedNode) {
            return;
        }
        
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Update node position
        setFormData(prevData => ({
            ...prevData,
            nodes: prevData.nodes.map(node => 
                node.id === canvasState.draggedNode.id
                    ? { ...node, x, y }
                    : node
            ),
        }));
    };
    
    // Handle canvas mouse up
    const handleCanvasMouseUp = () => {
        setCanvasState(prevState => ({
            ...prevState,
            isDragging: false,
            draggedNode: null,
        }));
    };
    
    // Add a new node
    const addNode = (type) => {
        const newNode = {
            id: `node-${Date.now()}`,
            type,
            name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            x: 100,
            y: 100,
            width: 150,
            height: 50,
        };
        
        setFormData(prevData => ({
            ...prevData,
            nodes: [...prevData.nodes, newNode],
        }));
    };
    
    // Add a new edge
    const addEdge = () => {
        if (!canvasState.selectedNode) {
            return;
        }
        
        // Show node selection modal
        // ...
    };
    
    // Delete selected node or edge
    const deleteSelected = () => {
        if (canvasState.selectedNode) {
            // Delete node and connected edges
            setFormData(prevData => ({
                ...prevData,
                nodes: prevData.nodes.filter(node => node.id !== canvasState.selectedNode.id),
                edges: prevData.edges.filter(edge => 
                    edge.source !== canvasState.selectedNode.id && 
                    edge.target !== canvasState.selectedNode.id
                ),
            }));
            
            setCanvasState(prevState => ({
                ...prevState,
                selectedNode: null,
            }));
        } else if (canvasState.selectedEdge) {
            // Delete edge
            setFormData(prevData => ({
                ...prevData,
                edges: prevData.edges.filter(edge => edge.id !== canvasState.selectedEdge.id),
            }));
            
            setCanvasState(prevState => ({
                ...prevState,
                selectedEdge: null,
            }));
        }
    };
    
    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.type) {
            newErrors.type = 'Workflow type is required';
        }
        
        if (formData.nodes.length === 0) {
            newErrors.nodes = 'Workflow must have at least one node';
        }
        
        setErrors(newErrors);
        
        return Object.keys(newErrors).length === 0;
    };
    
    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        if (isEditing) {
            // Update workflow
            dispatch({ type: 'UPDATE_WORKFLOW_REQUEST' });
            
            workflowApi.updateWorkflow(workflowId, formData)
                .then(response => {
                    dispatch({
                        type: 'UPDATE_WORKFLOW_SUCCESS',
                        payload: response,
                    });
                    
                    // Show success notification
                    dispatch({
                        type: 'ADD_NOTIFICATION',
                        payload: {
                            type: 'success',
                            message: `Workflow "${formData.name}" updated successfully`,
                            duration: 5000,
                        },
                    });
                    
                    // Navigate to workflow list
                    navigate('/workflows');
                })
                .catch(error => {
                    dispatch({
                        type: 'UPDATE_WORKFLOW_FAILURE',
                        payload: error.message,
                    });
                    
                    // Show error notification
                    dispatch({
                        type: 'ADD_NOTIFICATION',
                        payload: {
                            type: 'error',
                            message: `Failed to update workflow: ${error.message}`,
                            duration: 5000,
                        },
                    });
                });
        } else {
            // Create workflow
            dispatch({ type: 'CREATE_WORKFLOW_REQUEST' });
            
            workflowApi.createWorkflow(formData)
                .then(response => {
                    dispatch({
                        type: 'CREATE_WORKFLOW_SUCCESS',
                        payload: response,
                    });
                    
                    // Show success notification
                    dispatch({
                        type: 'ADD_NOTIFICATION',
                        payload: {
                            type: 'success',
                            message: `Workflow "${formData.name}" created successfully`,
                            duration: 5000,
                        },
                    });
                    
                    // Navigate to workflow list
                    navigate('/workflows');
                })
                .catch(error => {
                    dispatch({
                        type: 'CREATE_WORKFLOW_FAILURE',
                        payload: error.message,
                    });
                    
                    // Show error notification
                    dispatch({
                        type: 'ADD_NOTIFICATION',
                        payload: {
                            type: 'error',
                            message: `Failed to create workflow: ${error.message}`,
                            duration: 5000,
                        },
                    });
                });
        }
    };
    
    return (
        <div className="workflow-designer">
            <div className="page-header">
                <h1>{isEditing ? 'Edit Workflow' : 'Create Workflow'}</h1>
            </div>
            
            <div className="workflow-designer-container">
                {/* Workflow Properties */}
                <Card title="Workflow Properties" className="workflow-properties">
                    <Form onSubmit={handleSubmit} loading={loading}>
                        <FormGroup
                            label="Name"
                            htmlFor="name"
                            error={errors.name}
                            required
                        >
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter workflow name"
                                required
                            />
                        </FormGroup>
                        
                        <FormGroup
                            label="Workflow Type"
                            htmlFor="type"
                            error={errors.type}
                            required
                        >
                            <Select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                options={workflowTypes.map(type => ({
                                    value: type.value,
                                    label: type.label,
                                }))}
                                required
                            />
                        </FormGroup>
                        
                        <FormGroup
                            label="Description"
                            htmlFor="desc"
                        >
                            <Textarea
                                id="desc"
                                name="desc"
                                value={formData.desc}
                                onChange={handleInputChange}
                                placeholder="Enter workflow description"
                                rows={3}
                            />
                        </FormGroup>
                        
                        {/* Form Actions */}
                        <div className="form-actions">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/workflows')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                loading={loading}
                            >
                                {isEditing ? 'Update Workflow' : 'Create Workflow'}
                            </Button>
                        </div>
                        
                        {error && (
                            <div className="form-error-message">
                                {error}
                            </div>
                        )}
                    </Form>
                </Card>
                
                {/* Workflow Canvas */}
                <Card title="Workflow Designer" className="workflow-canvas-container">
                    <div className="canvas-toolbar">
                        <Button
                            variant="outline"
                            size="small"
                            onClick={() => addNode('agent')}
                        >
                            Add Agent
                        </Button>
                        <Button
                            variant="outline"
                            size="small"
                            onClick={() => addNode('flow')}
                        >
                            Add Flow
                        </Button>
                        <Button
                            variant="outline"
                            size="small"
                            onClick={addEdge}
                            disabled={!canvasState.selectedNode}
                        >
                            Add Connection
                        </Button>
                        <Button
                            variant="danger"
                            size="small"
                            onClick={deleteSelected}
                            disabled={!canvasState.selectedNode && !canvasState.selectedEdge}
                        >
                            Delete
                        </Button>
                    </div>
                    
                    <div className="canvas-wrapper">
                        <canvas
                            ref={canvasRef}
                            width={800}
                            height={600}
                            onMouseDown={handleCanvasMouseDown}
                            onMouseMove={handleCanvasMouseMove}
                            onMouseUp={handleCanvasMouseUp}
                            onMouseLeave={handleCanvasMouseUp}
                        ></canvas>
                    </div>
                    
                    {errors.nodes && (
                        <div className="canvas-error">
                            {errors.nodes}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default WorkflowDesigner;

