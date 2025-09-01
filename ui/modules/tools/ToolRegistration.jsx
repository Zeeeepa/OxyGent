import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Components
import Card from '../../components/Card';
import Button from '../../components/Button';
import Form, { FormGroup, Input, Select, Textarea, Checkbox } from '../../components/Form';
import ToolTypeSelector from './ToolTypeSelector';

// Actions
import { toolApi } from '../../services/api';

/**
 * ToolRegistration component for registering new tools
 */
const ToolRegistration = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Redux state
    const toolTypes = useSelector(state => state.tools.toolTypes);
    const loading = useSelector(state => state.tools.loading);
    const error = useSelector(state => state.tools.error);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        parameters: {},
        isActive: true,
    });
    
    // Validation state
    const [validation, setValidation] = useState({
        name: { valid: true, message: '' },
        type: { valid: true, message: '' },
    });
    
    // Dynamic parameters based on tool type
    const [typeParameters, setTypeParameters] = useState([]);
    
    // Fetch tool types on component mount
    useEffect(() => {
        // Fetch tool types if not already loaded
        if (toolTypes.length === 0) {
            dispatch({ type: 'FETCH_TOOL_TYPES_REQUEST' });
            
            toolApi.getToolTypes()
                .then(response => {
                    dispatch({
                        type: 'FETCH_TOOL_TYPES_SUCCESS',
                        payload: response,
                    });
                })
                .catch(error => {
                    dispatch({
                        type: 'FETCH_TOOL_TYPES_FAILURE',
                        payload: error.message,
                    });
                });
        }
    }, [dispatch, toolTypes.length]);
    
    // Update type parameters when tool type changes
    useEffect(() => {
        if (formData.type && toolTypes) {
            const selectedType = toolTypes.find(type => type.id === formData.type);
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
    }, [formData.type, toolTypes]);
    
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
    
    // Handle tool type selection
    const handleToolTypeSelect = (typeId) => {
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
        };
        
        let isValid = true;
        
        // Validate name
        if (!formData.name.trim()) {
            newValidation.name = { valid: false, message: 'Name is required' };
            isValid = false;
        }
        
        // Validate type
        if (!formData.type) {
            newValidation.type = { valid: false, message: 'Tool type is required' };
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
        
        dispatch({ type: 'CREATE_TOOL_REQUEST' });
        
        toolApi.createTool(formData)
            .then(response => {
                dispatch({
                    type: 'CREATE_TOOL_SUCCESS',
                    payload: response,
                });
                
                // Navigate to the new tool
                navigate(`/tools/${response.id}`);
            })
            .catch(error => {
                dispatch({
                    type: 'CREATE_TOOL_FAILURE',
                    payload: error.message,
                });
            });
    };
    
    return (
        <div className="tool-registration">
            <Card>
                <div className="card-header">
                    <h1>Register New Tool</h1>
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
                                placeholder="Enter tool name"
                                required
                            />
                        </FormGroup>
                        
                        <FormGroup label="Description">
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter tool description"
                                rows={3}
                            />
                        </FormGroup>
                        
                        <FormGroup
                            label="Tool Type"
                            error={!validation.type.valid ? validation.type.message : null}
                        >
                            <ToolTypeSelector
                                toolTypes={toolTypes}
                                selectedType={formData.type}
                                onSelect={handleToolTypeSelect}
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
                        
                        <FormGroup>
                            <Checkbox
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                label="Activate tool after creation"
                            />
                        </FormGroup>
                        
                        <div className="form-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/tools')}
                            >
                                Cancel
                            </Button>
                            
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register Tool'}
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default ToolRegistration;

