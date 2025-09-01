import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// Components
import Form, { FormGroup, Input, Select, Textarea, Checkbox } from '../../components/Form';
import Button from '../../components/Button';

/**
 * ToolConfigurationForm component for configuring tool parameters
 * 
 * @param {Object} props - Component props
 * @param {Object} props.tool - Tool data
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {Function} props.onCancel - Function to call when form is cancelled
 * @param {boolean} props.isEditing - Whether the form is in edit mode
 */
const ToolConfigurationForm = ({ tool, onSubmit, onCancel, isEditing = false }) => {
    // Redux state
    const toolTypes = useSelector(state => state.tools.toolTypes);
    
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
    
    // Initialize form data from tool
    useEffect(() => {
        if (tool) {
            setFormData({
                name: tool.name || '',
                description: tool.description || '',
                type: tool.type || '',
                parameters: tool.parameters || {},
                isActive: tool.isActive !== undefined ? tool.isActive : true,
            });
        }
    }, [tool]);
    
    // Update type parameters when tool type changes
    useEffect(() => {
        if (formData.type && toolTypes) {
            const selectedType = toolTypes.find(type => type.id === formData.type);
            if (selectedType && selectedType.parameters) {
                setTypeParameters(selectedType.parameters);
                
                // Initialize parameters with default values for new parameters
                const updatedParams = { ...formData.parameters };
                selectedType.parameters.forEach(param => {
                    if (updatedParams[param.name] === undefined) {
                        updatedParams[param.name] = param.defaultValue || '';
                    }
                });
                
                setFormData(prevData => ({
                    ...prevData,
                    parameters: updatedParams,
                }));
            } else {
                setTypeParameters([]);
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
        
        onSubmit(formData);
    };
    
    return (
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
                <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    disabled={isEditing} // Can't change type when editing
                    required
                >
                    <option value="">Select tool type</option>
                    {toolTypes.map(type => (
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
            
            <FormGroup>
                <Checkbox
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    label={isEditing ? 'Tool is active' : 'Activate tool after creation'}
                />
            </FormGroup>
            
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
                    {isEditing ? 'Update Tool' : 'Create Tool'}
                </Button>
            </div>
        </Form>
    );
};

export default ToolConfigurationForm;

