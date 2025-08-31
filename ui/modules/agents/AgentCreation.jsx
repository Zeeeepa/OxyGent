import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Components
import Card from '../../components/Card';
import Button from '../../components/Button';
import Form, { FormGroup, Input, Select, Textarea, Checkbox } from '../../components/Form';

// Actions
import { agentApi, toolApi } from '../../services/api';

/**
 * AgentCreation component for creating new agents
 */
const AgentCreation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const agentTypes = useSelector(state => state.agents.agentTypes);
    const tools = useSelector(state => state.tools.items);
    const loading = useSelector(state => state.agents.loading);
    const error = useSelector(state => state.agents.error);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        desc: '',
        is_master: false,
        tools: [],
        sub_agents: [],
        llm_model: '',
        max_react_rounds: 16,
        memory_max_tokens: 24800,
    });
    
    // Form validation
    const [errors, setErrors] = useState({});
    
    // Fetch agent types and tools on component mount
    useEffect(() => {
        // Fetch agent types
        dispatch({ type: 'FETCH_AGENT_TYPES_REQUEST' });
        
        agentApi.getAgentTypes()
            .then(response => {
                dispatch({
                    type: 'FETCH_AGENT_TYPES_SUCCESS',
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: 'FETCH_AGENT_TYPES_FAILURE',
                    payload: error.message,
                });
            });
        
        // Fetch tools
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
    }, [dispatch]);
    
    // Handle form input change
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
        
        // Clear error for the field
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: null,
            }));
        }
    };
    
    // Handle multi-select change
    const handleMultiSelectChange = (event) => {
        const { name, options } = event.target;
        const selectedValues = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);
        
        setFormData(prevData => ({
            ...prevData,
            [name]: selectedValues,
        }));
        
        // Clear error for the field
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: null,
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
            newErrors.type = 'Agent type is required';
        }
        
        if (formData.is_master && formData.sub_agents.length === 0) {
            newErrors.sub_agents = 'Master agent must have at least one sub-agent';
        }
        
        if (!formData.is_master && formData.tools.length === 0) {
            newErrors.tools = 'Agent must have at least one tool';
        }
        
        if (!formData.llm_model) {
            newErrors.llm_model = 'LLM model is required';
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
        
        dispatch({ type: 'CREATE_AGENT_REQUEST' });
        
        agentApi.createAgent(formData)
            .then(response => {
                dispatch({
                    type: 'CREATE_AGENT_SUCCESS',
                    payload: response,
                });
                
                // Show success notification
                dispatch({
                    type: 'ADD_NOTIFICATION',
                    payload: {
                        type: 'success',
                        message: `Agent "${formData.name}" created successfully`,
                        duration: 5000,
                    },
                });
                
                // Navigate to agent detail page
                navigate(`/agents/${response.id}`);
            })
            .catch(error => {
                dispatch({
                    type: 'CREATE_AGENT_FAILURE',
                    payload: error.message,
                });
                
                // Show error notification
                dispatch({
                    type: 'ADD_NOTIFICATION',
                    payload: {
                        type: 'error',
                        message: `Failed to create agent: ${error.message}`,
                        duration: 5000,
                    },
                });
            });
    };
    
    return (
        <div className="agent-creation">
            <div className="page-header">
                <h1>Create Agent</h1>
            </div>
            
            <Card>
                <Form onSubmit={handleSubmit} loading={loading}>
                    {/* Basic Information */}
                    <h2 className="form-section-title">Basic Information</h2>
                    
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
                            placeholder="Enter agent name"
                            required
                        />
                    </FormGroup>
                    
                    <FormGroup
                        label="Agent Type"
                        htmlFor="type"
                        error={errors.type}
                        required
                    >
                        <Select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            options={agentTypes.map(type => ({
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
                            placeholder="Enter agent description"
                            rows={3}
                        />
                    </FormGroup>
                    
                    <FormGroup>
                        <Checkbox
                            id="is_master"
                            name="is_master"
                            checked={formData.is_master}
                            onChange={handleInputChange}
                            label="Master Agent"
                        />
                    </FormGroup>
                    
                    {/* Agent Configuration */}
                    <h2 className="form-section-title">Agent Configuration</h2>
                    
                    <FormGroup
                        label="LLM Model"
                        htmlFor="llm_model"
                        error={errors.llm_model}
                        required
                    >
                        <Input
                            id="llm_model"
                            name="llm_model"
                            value={formData.llm_model}
                            onChange={handleInputChange}
                            placeholder="Enter LLM model name"
                            required
                        />
                    </FormGroup>
                    
                    {formData.is_master ? (
                        <FormGroup
                            label="Sub Agents"
                            htmlFor="sub_agents"
                            error={errors.sub_agents}
                            required
                        >
                            <select
                                id="sub_agents"
                                name="sub_agents"
                                value={formData.sub_agents}
                                onChange={handleMultiSelectChange}
                                multiple
                                className="form-select"
                                required
                            >
                                {/* This would be populated with existing agents */}
                                <option value="agent1">Agent 1</option>
                                <option value="agent2">Agent 2</option>
                                <option value="agent3">Agent 3</option>
                            </select>
                            <div className="form-help-text">
                                Hold Ctrl (or Cmd) to select multiple agents
                            </div>
                        </FormGroup>
                    ) : (
                        <FormGroup
                            label="Tools"
                            htmlFor="tools"
                            error={errors.tools}
                            required
                        >
                            <select
                                id="tools"
                                name="tools"
                                value={formData.tools}
                                onChange={handleMultiSelectChange}
                                multiple
                                className="form-select"
                                required
                            >
                                {tools.map(tool => (
                                    <option key={tool.id} value={tool.id}>
                                        {tool.name}
                                    </option>
                                ))}
                            </select>
                            <div className="form-help-text">
                                Hold Ctrl (or Cmd) to select multiple tools
                            </div>
                        </FormGroup>
                    )}
                    
                    {/* Advanced Configuration */}
                    <h2 className="form-section-title">Advanced Configuration</h2>
                    
                    <FormGroup
                        label="Max React Rounds"
                        htmlFor="max_react_rounds"
                    >
                        <Input
                            type="number"
                            id="max_react_rounds"
                            name="max_react_rounds"
                            value={formData.max_react_rounds}
                            onChange={handleInputChange}
                            min={1}
                            max={100}
                        />
                        <div className="form-help-text">
                            Maximum number of reasoning-acting iterations
                        </div>
                    </FormGroup>
                    
                    <FormGroup
                        label="Memory Max Tokens"
                        htmlFor="memory_max_tokens"
                    >
                        <Input
                            type="number"
                            id="memory_max_tokens"
                            name="memory_max_tokens"
                            value={formData.memory_max_tokens}
                            onChange={handleInputChange}
                            min={1000}
                            max={100000}
                        />
                        <div className="form-help-text">
                            Maximum tokens supported by memory
                        </div>
                    </FormGroup>
                    
                    {/* Form Actions */}
                    <div className="form-actions">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/agents')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            loading={loading}
                        >
                            Create Agent
                        </Button>
                    </div>
                    
                    {error && (
                        <div className="form-error-message">
                            {error}
                        </div>
                    )}
                </Form>
            </Card>
        </div>
    );
};

export default AgentCreation;

