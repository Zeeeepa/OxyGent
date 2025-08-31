import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Components
import Card from '../../components/Card';
import Button from '../../components/Button';
import Form, { FormGroup, Input, Select, Textarea, Checkbox } from '../../components/Form';

// Actions
import { orchestrationApi, agentApi } from '../../services/api';

/**
 * OrchestrationCreation component for creating new orchestrations
 */
const OrchestrationCreation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const agents = useSelector(state => state.agents.items);
    const orchestrationTypes = useSelector(state => state.orchestration.orchestrationTypes);
    const loading = useSelector(state => state.orchestration.loading);
    const error = useSelector(state => state.orchestration.error);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        agents: [],
        masterAgent: '',
        autoStart: false,
        parameters: {},
    });
    
    // Validation state
    const [validation, setValidation] = useState({
        name: { valid: true, message: '' },
        type: { valid: true, message: '' },
        agents: { valid: true, message: '' },
        masterAgent: { valid: true, message: '' },
    });
    
    // Dynamic parameters based on orchestration type
    const [typeParameters, setTypeParameters] = useState([]);
    
    // Fetch agents and orchestration types on component mount
    useEffect(() => {
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
        
        // Fetch orchestration types
        dispatch({ type: 'FETCH_ORCHESTRATION_TYPES_REQUEST' });
        
        orchestrationApi.getOrchestrationTypes()
            .then(response => {
                dispatch({
                    type: 'FETCH_ORCHESTRATION_TYPES_SUCCESS',
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: 'FETCH_ORCHESTRATION_TYPES_FAILURE',
                    payload: error.message,
                });
            });
    }, [dispatch, agents.length]);
    
    // Update type parameters when orchestration type changes
    useEffect(() => {
        if (formData.type && orchestrationTypes) {
            const selectedType = orchestrationTypes.find(type => type.id === formData.type);
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
    }, [formData.type, orchestrationTypes]);
    
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
    
    // Handle agent selection
    const handleAgentSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        
        setFormData(prevData => ({
            ...prevData,
            agents: selectedOptions,
        }));
        
        // Clear validation error when field is edited
        setValidation(prevValidation => ({
            ...prevValidation,
            agents: { valid: true, message: '' },
        }));
    };
    
    // Validate form
    const validateForm = () => {
        const newValidation = {
            name: { valid: true, message: '' },
            type: { valid: true, message: '' },
            agents: { valid: true, message: '' },
            masterAgent: { valid: true, message: '' },
        };
        
        let isValid = true;
        
        // Validate name
        if (!formData.name.trim()) {
            newValidation.name = { valid: false, message: 'Name is required' };
            isValid = false;
        }
        
        // Validate type
        if (!formData.type) {
            newValidation.type = { valid: false, message: 'Orchestration type is required' };
            isValid = false;
        }
        
        // Validate agents
        if (formData.agents.length === 0) {
            newValidation.agents = { valid: false, message: 'At least one agent is required' };
            isValid = false;
        }
        
        // Validate master agent if agents are selected
        if (formData.agents.length > 0 && !formData.masterAgent) {
            newValidation.masterAgent = { valid: false, message: 'Master agent is required' };
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
        
        dispatch({ type: 'CREATE_ORCHESTRATION_REQUEST' });
        
        orchestrationApi.createOrchestration(formData)
            .then(response => {
                dispatch({
                    type: 'CREATE_ORCHESTRATION_SUCCESS',
                    payload: response,
                });
                
                // Navigate to the new orchestration
                navigate(`/orchestrations/${response.id}`);
            })
            .catch(error => {
                dispatch({
                    type: 'CREATE_ORCHESTRATION_FAILURE',
                    payload: error.message,
                });
            });
    };
    
    return (
        <div className="orchestration-creation">
            <Card>
                <div className="card-header">
                    <h1>Create New Orchestration</h1>
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
                                placeholder="Enter orchestration name"
                                required
                            />
                        </FormGroup>
                        
                        <FormGroup label="Description">
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter orchestration description"
                                rows={3}
                            />
                        </FormGroup>
                        
                        <FormGroup
                            label="Orchestration Type"
                            error={!validation.type.valid ? validation.type.message : null}
                        >
                            <Select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select orchestration type</option>
                                {orchestrationTypes && orchestrationTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </Select>
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
                            label="Agents"
                            error={!validation.agents.valid ? validation.agents.message : null}
                        >
                            <Select
                                name="agents"
                                multiple
                                value={formData.agents}
                                onChange={handleAgentSelection}
                                size={5}
                                required
                            >
                                {agents.map(agent => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.name} ({agent.type})
                                    </option>
                                ))}
                            </Select>
                            <div className="form-help-text">
                                Hold Ctrl/Cmd to select multiple agents
                            </div>
                        </FormGroup>
                        
                        <FormGroup
                            label="Master Agent"
                            error={!validation.masterAgent.valid ? validation.masterAgent.message : null}
                        >
                            <Select
                                name="masterAgent"
                                value={formData.masterAgent}
                                onChange={handleInputChange}
                                disabled={formData.agents.length === 0}
                                required
                            >
                                <option value="">Select master agent</option>
                                {formData.agents.map(agentId => {
                                    const agent = agents.find(a => a.id === agentId);
                                    return agent ? (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.name} ({agent.type})
                                        </option>
                                    ) : null;
                                })}
                            </Select>
                        </FormGroup>
                        
                        <FormGroup>
                            <Checkbox
                                name="autoStart"
                                checked={formData.autoStart}
                                onChange={handleInputChange}
                                label="Auto-start orchestration after creation"
                            />
                        </FormGroup>
                        
                        <div className="form-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/orchestrations')}
                            >
                                Cancel
                            </Button>
                            
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Orchestration'}
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default OrchestrationCreation;

