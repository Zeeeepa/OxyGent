import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Components
import Card from '../../components/Card';
import Button from '../../components/Button';
import Form, { FormGroup, Input, Select, Textarea, Checkbox } from '../../components/Form';
import AgentTypeSelector from './AgentTypeSelector';

// Actions
import { agentApi, toolApi, llmApi } from '../../services/api';

/**
 * AgentRegistration component for registering new agents
 */
const AgentRegistration = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Redux state
    const tools = useSelector(state => state.tools.items);
    const llms = useSelector(state => state.llms?.items || []);
    const agentTypes = useSelector(state => state.agents.agentTypes);
    const loading = useSelector(state => state.agents.loading);
    const error = useSelector(state => state.agents.error);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        tools: [],
        llm: '',
        parameters: {},
        isActive: true,
    });
    
    // Validation state
    const [validation, setValidation] = useState({
        name: { valid: true, message: '' },
        type: { valid: true, message: '' },
        llm: { valid: true, message: '' },
    });
    
    // Dynamic parameters based on agent type
    const [typeParameters, setTypeParameters] = useState([]);
    
    // Fetch tools, LLMs, and agent types on component mount
    useEffect(() => {
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
        
        // Fetch LLMs if not already loaded
        if (llms.length === 0) {
            dispatch({ type: 'FETCH_LLMS_REQUEST' });
            
            llmApi.getLLMs()
                .then(response => {
                    dispatch({
                        type: 'FETCH_LLMS_SUCCESS',
                        payload: response,
                    });
                })
                .catch(error => {
                    dispatch({
                        type: 'FETCH_LLMS_FAILURE',
                        payload: error.message,
                    });
                });
        }
        
        // Fetch agent types if not already loaded
        if (agentTypes.length === 0) {
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
        }
    }, [dispatch, tools.length, llms.length, agentTypes.length]);
    
    // Update type parameters when agent type changes
    useEffect(() => {
        if (formData.type && agentTypes) {
            const selectedType = agentTypes.find(type => type.id === formData.type);
            if (selectedType && selectedType.parameters) {
                setTypeParameters(selectedType.parameters);
                
                // Initialize parameters with default values
                const defaultParams = {};
                selectedType.parameters.forEach(param => {
                    defaultParams[param.name] = param.defaultValue || '';
                });
                
                setFormData(prevData => ({
                    ...prevData,
                    parameters: defaultParams,
                }));
            } else {
                setTypeParameters([]);
                setFormData(prevData => ({
                    ...prevData,
                    parameters: {},
                }));
            }
        }
    }, [formData.type, agentTypes]);
    
    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prevData => ({
                ...prevData,
                [name]: checked,
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
        
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
    
    // Handle tool selection
    const handleToolSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        
        setFormData(prevData => ({
            ...prevData,
            tools: selectedOptions,
        }));
    };
    
    // Handle agent type selection
    const handleAgentTypeSelect = (typeId) => {
        setFormData(prevData => ({
            ...prevData,
            type: typeId,
        }));
        
        // Clear validation error when field is edited
        setValidation(prevValidation => ({
            ...prevValidation,
            type: { valid: true, message: '' },
        }));
    };
    
    // Validate form
    const validateForm = () => {
        const newValidation = {
            name: { valid: true, message: '' },
            type: { valid: true, message: '' },
            llm: { valid: true, message: '' },
        };
        
        let isValid = true;
        
        // Validate name
        if (!formData.name.trim()) {
            newValidation.name = { valid: false, message: 'Name is required' };
            isValid = false;
        }
        
        // Validate type
        if (!formData.type) {
            newValidation.type = { valid: false, message: 'Agent type is required' };
            isValid = false;
        }
        
        // Validate LLM
        if (!formData.llm) {
            newValidation.llm = { valid: false, message: 'LLM is required' };
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
        
        dispatch({ type: 'CREATE_AGENT_REQUEST' });
        
        agentApi.createAgent(formData)
            .then(response => {
                dispatch({
                    type: 'CREATE_AGENT_SUCCESS',
                    payload: response,
                });
                
                // Navigate to the new agent
                navigate(`/agents/${response.id}`);
            })
            .catch(error => {
                dispatch({
                    type: 'CREATE_AGENT_FAILURE',
                    payload: error.message,
                });
            });
    };
    
    return (
        <div className="agent-registration">
            <Card>
                <div className="card-header">
                    <h1>Register New Agent</h1>
                </div>
                
                <div className="card-body">
                    {loading && <div className="loading-indicator">Loading...</div>}
                    
                    {error && (
                        <div className="error-message">
                            Error: {error}
                        </div>
                    )}
                    
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
                                placeholder="Enter agent name"
                                required
                            />
                        </FormGroup>
                        
                        <FormGroup label="Description">
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter agent description"
                                rows={3}
                            />
                        </FormGroup>
                        
                        <FormGroup
                            label="Agent Type"
                            error={!validation.type.valid ? validation.type.message : null}
                        >
                            <AgentTypeSelector
                                agentTypes={agentTypes}
                                selectedType={formData.type}
                                onSelect={handleAgentTypeSelect}
                            />
                        </FormGroup>
                        
                        {typeParameters.length > 0 && (
                            <div className="parameters-section">
                                <h3>Type Parameters</h3>
                                
                                {typeParameters.map(param => (
                                    <FormGroup key={param.name} label={param.label || param.name}>
                                        {param.type === 'boolean' ? (
                                            <Checkbox
                                                name={`param-${param.name}`}
                                                checked={!!formData.parameters[param.name]}
                                                onChange={(e) => handleParameterChange(param.name, e.target.checked)}
                                                label={param.description}
                                            />
                                        ) : param.type === 'select' ? (
                                            <Select
                                                name={`param-${param.name}`}
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
                                                name={`param-${param.name}`}
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
                                                name={`param-${param.name}`}
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
                        
                        <FormGroup
                            label="LLM"
                            error={!validation.llm.valid ? validation.llm.message : null}
                        >
                            <Select
                                name="llm"
                                value={formData.llm}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select LLM</option>
                                {llms.map(llm => (
                                    <option key={llm.id} value={llm.id}>
                                        {llm.name} ({llm.provider})
                                    </option>
                                ))}
                            </Select>
                        </FormGroup>
                        
                        <FormGroup label="Tools">
                            <Select
                                name="tools"
                                multiple
                                value={formData.tools}
                                onChange={handleToolSelection}
                                size={5}
                            >
                                {tools.map(tool => (
                                    <option key={tool.id} value={tool.id}>
                                        {tool.name} ({tool.type})
                                    </option>
                                ))}
                            </Select>
                            <div className="form-help-text">
                                Hold Ctrl/Cmd to select multiple tools
                            </div>
                        </FormGroup>
                        
                        <FormGroup>
                            <Checkbox
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                label="Activate agent after creation"
                            />
                        </FormGroup>
                        
                        <div className="form-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/agents')}
                            >
                                Cancel
                            </Button>
                            
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register Agent'}
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default AgentRegistration;

