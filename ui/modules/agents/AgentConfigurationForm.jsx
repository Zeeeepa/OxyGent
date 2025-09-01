import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// Components
import Form, { FormGroup, Input, Select, Textarea, Checkbox } from '../../components/Form';
import Button from '../../components/Button';

/**
 * AgentConfigurationForm component for configuring agent parameters
 * 
 * @param {Object} props - Component props
 * @param {Object} props.agent - Agent data
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {Function} props.onCancel - Function to call when form is cancelled
 * @param {boolean} props.isEditing - Whether the form is in edit mode
 */
const AgentConfigurationForm = ({ agent, onSubmit, onCancel, isEditing = false }) => {
    // Redux state
    const tools = useSelector(state => state.tools.items);
    const llms = useSelector(state => state.llms?.items || []);
    const agentTypes = useSelector(state => state.agents.agentTypes);
    
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
    
    // Initialize form data from agent
    useEffect(() => {
        if (agent) {
            setFormData({
                name: agent.name || '',
                description: agent.description || '',
                type: agent.type || '',
                tools: agent.tools || [],
                llm: agent.llm || '',
                parameters: agent.parameters || {},
                isActive: agent.isActive !== undefined ? agent.isActive : true,
            });
        }
    }, [agent]);
    
    // Update type parameters when agent type changes
    useEffect(() => {
        if (formData.type && agentTypes) {
            const selectedType = agentTypes.find(type => type.id === formData.type);
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
                <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    disabled={isEditing} // Can't change type when editing
                    required
                >
                    <option value="">Select agent type</option>
                    {agentTypes.map(type => (
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
                    label={isEditing ? 'Agent is active' : 'Activate agent after creation'}
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
                    {isEditing ? 'Update Agent' : 'Create Agent'}
                </Button>
            </div>
        </Form>
    );
};

export default AgentConfigurationForm;

