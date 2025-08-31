import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

// Components
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Input } from '../../components/Form';

// Actions
import { agentApi } from '../../services/api';

/**
 * AgentList component that displays a list of all agents
 */
const AgentList = () => {
    const dispatch = useDispatch();
    const agents = useSelector(state => state.agents.items);
    const loading = useSelector(state => state.agents.loading);
    const error = useSelector(state => state.agents.error);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAgents, setFilteredAgents] = useState([]);
    
    // Fetch agents on component mount
    useEffect(() => {
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
    }, [dispatch]);
    
    // Filter agents based on search term
    useEffect(() => {
        if (agents) {
            setFilteredAgents(
                agents.filter(agent => 
                    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    agent.desc?.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [agents, searchTerm]);
    
    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    
    return (
        <div className="agent-list">
            <div className="page-header">
                <h1>Agents</h1>
                <Link to="/agents/create">
                    <Button variant="primary">
                        Create Agent
                    </Button>
                </Link>
            </div>
            
            <Card>
                <div className="card-filters">
                    <Input
                        type="text"
                        placeholder="Search agents..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                
                {loading ? (
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                        <p>Loading agents...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        <p>Error loading agents: {error}</p>
                        <Button 
                            variant="primary" 
                            onClick={() => dispatch({ type: 'FETCH_AGENTS_REQUEST' })}
                        >
                            Retry
                        </Button>
                    </div>
                ) : filteredAgents.length === 0 ? (
                    <div className="empty-state">
                        <p>No agents found.</p>
                        <Link to="/agents/create">
                            <Button variant="primary">
                                Create your first agent
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="agent-grid">
                        {filteredAgents.map(agent => (
                            <Link 
                                to={`/agents/${agent.id}`} 
                                key={agent.id}
                                className="agent-card"
                            >
                                <div className="agent-icon">
                                    {agent.type === 'react_agent' ? '🤖' : 
                                     agent.type === 'chat_agent' ? '💬' : 
                                     agent.type === 'parallel_agent' ? '⚡' : 
                                     agent.type === 'workflow_agent' ? '🔄' : '🧠'}
                                </div>
                                <div className="agent-info">
                                    <h3 className="agent-name">{agent.name}</h3>
                                    <p className="agent-type">{agent.type}</p>
                                    {agent.desc && (
                                        <p className="agent-description">{agent.desc}</p>
                                    )}
                                </div>
                                {agent.is_master && (
                                    <div className="agent-badge">Master</div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AgentList;

