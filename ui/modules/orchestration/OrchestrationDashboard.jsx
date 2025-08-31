import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

// Components
import Card from '../../components/Card';
import Button from '../../components/Button';

// Actions
import { orchestrationApi } from '../../services/api';

/**
 * OrchestrationDashboard component for displaying an overview of all orchestrations
 */
const OrchestrationDashboard = () => {
    const dispatch = useDispatch();
    
    const orchestrations = useSelector(state => state.orchestration.items);
    const loading = useSelector(state => state.orchestration.loading);
    const error = useSelector(state => state.orchestration.error);
    
    // Fetch orchestrations on component mount
    useEffect(() => {
        dispatch({ type: 'FETCH_ORCHESTRATIONS_REQUEST' });
        
        orchestrationApi.getOrchestrations()
            .then(response => {
                dispatch({
                    type: 'FETCH_ORCHESTRATIONS_SUCCESS',
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: 'FETCH_ORCHESTRATIONS_FAILURE',
                    payload: error.message,
                });
            });
    }, [dispatch]);
    
    // Group orchestrations by status
    const activeOrchestrations = orchestrations.filter(orch => orch.status === 'active');
    const pausedOrchestrations = orchestrations.filter(orch => orch.status === 'paused');
    const completedOrchestrations = orchestrations.filter(orch => orch.status === 'completed');
    
    return (
        <div className="orchestration-dashboard">
            <div className="dashboard-header">
                <h1>Orchestration Dashboard</h1>
                <Link to="/orchestrations/create">
                    <Button variant="primary">Create New Orchestration</Button>
                </Link>
            </div>
            
            {loading && <div className="loading-indicator">Loading orchestrations...</div>}
            
            {error && (
                <div className="error-message">
                    Error loading orchestrations: {error}
                </div>
            )}
            
            <div className="dashboard-metrics">
                <Card className="metric-card">
                    <h3>Active Orchestrations</h3>
                    <div className="metric-value">{activeOrchestrations.length}</div>
                </Card>
                
                <Card className="metric-card">
                    <h3>Paused Orchestrations</h3>
                    <div className="metric-value">{pausedOrchestrations.length}</div>
                </Card>
                
                <Card className="metric-card">
                    <h3>Completed Orchestrations</h3>
                    <div className="metric-value">{completedOrchestrations.length}</div>
                </Card>
                
                <Card className="metric-card">
                    <h3>Total Orchestrations</h3>
                    <div className="metric-value">{orchestrations.length}</div>
                </Card>
            </div>
            
            <div className="orchestration-lists">
                <Card className="orchestration-section">
                    <h2>Active Orchestrations</h2>
                    {activeOrchestrations.length === 0 ? (
                        <p>No active orchestrations</p>
                    ) : (
                        <div className="orchestration-grid">
                            {activeOrchestrations.map(orchestration => (
                                <OrchestrationCard 
                                    key={orchestration.id} 
                                    orchestration={orchestration} 
                                />
                            ))}
                        </div>
                    )}
                </Card>
                
                <Card className="orchestration-section">
                    <h2>Paused Orchestrations</h2>
                    {pausedOrchestrations.length === 0 ? (
                        <p>No paused orchestrations</p>
                    ) : (
                        <div className="orchestration-grid">
                            {pausedOrchestrations.map(orchestration => (
                                <OrchestrationCard 
                                    key={orchestration.id} 
                                    orchestration={orchestration} 
                                />
                            ))}
                        </div>
                    )}
                </Card>
                
                <Card className="orchestration-section">
                    <h2>Recent Completed Orchestrations</h2>
                    {completedOrchestrations.length === 0 ? (
                        <p>No completed orchestrations</p>
                    ) : (
                        <div className="orchestration-grid">
                            {completedOrchestrations.slice(0, 5).map(orchestration => (
                                <OrchestrationCard 
                                    key={orchestration.id} 
                                    orchestration={orchestration} 
                                />
                            ))}
                        </div>
                    )}
                    {completedOrchestrations.length > 5 && (
                        <Link to="/orchestrations/completed" className="view-all-link">
                            View all completed orchestrations
                        </Link>
                    )}
                </Card>
            </div>
        </div>
    );
};

/**
 * OrchestrationCard component for displaying a single orchestration
 * 
 * @param {Object} props - Component props
 * @param {Object} props.orchestration - Orchestration data
 */
const OrchestrationCard = ({ orchestration }) => {
    const dispatch = useDispatch();
    
    // Handle orchestration actions
    const handleStart = () => {
        dispatch({ type: 'START_ORCHESTRATION_REQUEST', payload: orchestration.id });
        
        orchestrationApi.startOrchestration(orchestration.id)
            .then(response => {
                dispatch({
                    type: 'START_ORCHESTRATION_SUCCESS',
                    payload: { id: orchestration.id, data: response },
                });
            })
            .catch(error => {
                dispatch({
                    type: 'START_ORCHESTRATION_FAILURE',
                    payload: { id: orchestration.id, error: error.message },
                });
            });
    };
    
    const handlePause = () => {
        dispatch({ type: 'PAUSE_ORCHESTRATION_REQUEST', payload: orchestration.id });
        
        orchestrationApi.pauseOrchestration(orchestration.id)
            .then(response => {
                dispatch({
                    type: 'PAUSE_ORCHESTRATION_SUCCESS',
                    payload: { id: orchestration.id, data: response },
                });
            })
            .catch(error => {
                dispatch({
                    type: 'PAUSE_ORCHESTRATION_FAILURE',
                    payload: { id: orchestration.id, error: error.message },
                });
            });
    };
    
    const handleStop = () => {
        dispatch({ type: 'STOP_ORCHESTRATION_REQUEST', payload: orchestration.id });
        
        orchestrationApi.stopOrchestration(orchestration.id)
            .then(response => {
                dispatch({
                    type: 'STOP_ORCHESTRATION_SUCCESS',
                    payload: { id: orchestration.id, data: response },
                });
            })
            .catch(error => {
                dispatch({
                    type: 'STOP_ORCHESTRATION_FAILURE',
                    payload: { id: orchestration.id, error: error.message },
                });
            });
    };
    
    return (
        <Card className={`orchestration-card status-${orchestration.status}`}>
            <div className="orchestration-header">
                <h3 className="orchestration-name">{orchestration.name}</h3>
                <span className={`status-badge status-${orchestration.status}`}>
                    {orchestration.status}
                </span>
            </div>
            
            <div className="orchestration-details">
                <p className="orchestration-description">{orchestration.description}</p>
                
                <div className="orchestration-meta">
                    <div className="meta-item">
                        <span className="meta-label">Agents:</span>
                        <span className="meta-value">{orchestration.agentCount}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">Created:</span>
                        <span className="meta-value">
                            {new Date(orchestration.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">Last Updated:</span>
                        <span className="meta-value">
                            {new Date(orchestration.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="orchestration-actions">
                <Link to={`/orchestrations/${orchestration.id}`}>
                    <Button variant="secondary" size="small">View Details</Button>
                </Link>
                
                {orchestration.status === 'paused' && (
                    <Button 
                        variant="primary" 
                        size="small" 
                        onClick={handleStart}
                    >
                        Resume
                    </Button>
                )}
                
                {orchestration.status === 'active' && (
                    <>
                        <Button 
                            variant="secondary" 
                            size="small" 
                            onClick={handlePause}
                        >
                            Pause
                        </Button>
                        <Button 
                            variant="danger" 
                            size="small" 
                            onClick={handleStop}
                        >
                            Stop
                        </Button>
                    </>
                )}
                
                {orchestration.status === 'completed' && (
                    <Button 
                        variant="primary" 
                        size="small" 
                        onClick={handleStart}
                    >
                        Restart
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default OrchestrationDashboard;

