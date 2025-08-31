import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Components
import Card from '../../components/Card';
import Button from '../../components/Button';
import Tabs from '../../components/Tabs';

// Actions
import { orchestrationApi } from '../../services/api';
import webSocketService from '../../services/WebSocketService';

/**
 * OrchestrationDetail component for viewing and managing a specific orchestration
 */
const OrchestrationDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orchestrationId } = useParams();
    
    const orchestration = useSelector(state => state.orchestration.selectedOrchestration);
    const loading = useSelector(state => state.orchestration.loading);
    const error = useSelector(state => state.orchestration.error);
    
    // Local state
    const [activeTab, setActiveTab] = useState('overview');
    const [events, setEvents] = useState([]);
    const [metrics, setMetrics] = useState({});
    
    // Fetch orchestration details on component mount
    useEffect(() => {
        dispatch({ type: 'FETCH_ORCHESTRATION_REQUEST', payload: orchestrationId });
        
        orchestrationApi.getOrchestration(orchestrationId)
            .then(response => {
                dispatch({
                    type: 'FETCH_ORCHESTRATION_SUCCESS',
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: 'FETCH_ORCHESTRATION_FAILURE',
                    payload: error.message,
                });
            });
            
        // Fetch orchestration events
        orchestrationApi.getOrchestrationEvents(orchestrationId)
            .then(response => {
                setEvents(response);
            })
            .catch(error => {
                console.error('Error fetching orchestration events:', error);
            });
            
        // Fetch orchestration metrics
        orchestrationApi.getOrchestrationMetrics(orchestrationId)
            .then(response => {
                setMetrics(response);
            })
            .catch(error => {
                console.error('Error fetching orchestration metrics:', error);
            });
            
        // Connect to WebSocket for real-time updates
        webSocketService.connect(orchestrationId)
            .then(() => {
                console.log('Connected to WebSocket for orchestration updates');
                
                // Listen for orchestration events
                webSocketService.addEventListener('orchestration_event', handleOrchestrationEvent);
                webSocketService.addEventListener('orchestration_update', handleOrchestrationUpdate);
                webSocketService.addEventListener('orchestration_metrics', handleOrchestrationMetrics);
            })
            .catch(error => {
                console.error('Error connecting to WebSocket:', error);
            });
            
        // Cleanup WebSocket connection on component unmount
        return () => {
            webSocketService.removeEventListener('orchestration_event', handleOrchestrationEvent);
            webSocketService.removeEventListener('orchestration_update', handleOrchestrationUpdate);
            webSocketService.removeEventListener('orchestration_metrics', handleOrchestrationMetrics);
            webSocketService.disconnect();
        };
    }, [dispatch, orchestrationId]);
    
    // WebSocket event handlers
    const handleOrchestrationEvent = (data) => {
        setEvents(prevEvents => [data, ...prevEvents]);
    };
    
    const handleOrchestrationUpdate = (data) => {
        dispatch({
            type: 'UPDATE_ORCHESTRATION',
            payload: data,
        });
    };
    
    const handleOrchestrationMetrics = (data) => {
        setMetrics(prevMetrics => ({
            ...prevMetrics,
            ...data,
        }));
    };
    
    // Handle orchestration actions
    const handleStart = () => {
        dispatch({ type: 'START_ORCHESTRATION_REQUEST', payload: orchestrationId });
        
        orchestrationApi.startOrchestration(orchestrationId)
            .then(response => {
                dispatch({
                    type: 'START_ORCHESTRATION_SUCCESS',
                    payload: { id: orchestrationId, data: response },
                });
            })
            .catch(error => {
                dispatch({
                    type: 'START_ORCHESTRATION_FAILURE',
                    payload: { id: orchestrationId, error: error.message },
                });
            });
    };
    
    const handlePause = () => {
        dispatch({ type: 'PAUSE_ORCHESTRATION_REQUEST', payload: orchestrationId });
        
        orchestrationApi.pauseOrchestration(orchestrationId)
            .then(response => {
                dispatch({
                    type: 'PAUSE_ORCHESTRATION_SUCCESS',
                    payload: { id: orchestrationId, data: response },
                });
            })
            .catch(error => {
                dispatch({
                    type: 'PAUSE_ORCHESTRATION_FAILURE',
                    payload: { id: orchestrationId, error: error.message },
                });
            });
    };
    
    const handleStop = () => {
        dispatch({ type: 'STOP_ORCHESTRATION_REQUEST', payload: orchestrationId });
        
        orchestrationApi.stopOrchestration(orchestrationId)
            .then(response => {
                dispatch({
                    type: 'STOP_ORCHESTRATION_SUCCESS',
                    payload: { id: orchestrationId, data: response },
                });
            })
            .catch(error => {
                dispatch({
                    type: 'STOP_ORCHESTRATION_FAILURE',
                    payload: { id: orchestrationId, error: error.message },
                });
            });
    };
    
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this orchestration? This action cannot be undone.')) {
            dispatch({ type: 'DELETE_ORCHESTRATION_REQUEST', payload: orchestrationId });
            
            orchestrationApi.deleteOrchestration(orchestrationId)
                .then(response => {
                    dispatch({
                        type: 'DELETE_ORCHESTRATION_SUCCESS',
                        payload: orchestrationId,
                    });
                    
                    // Navigate back to orchestration list
                    navigate('/orchestrations');
                })
                .catch(error => {
                    dispatch({
                        type: 'DELETE_ORCHESTRATION_FAILURE',
                        payload: { id: orchestrationId, error: error.message },
                    });
                });
        }
    };
    
    if (loading && !orchestration) {
        return <div className="loading-indicator">Loading orchestration details...</div>;
    }
    
    if (error && !orchestration) {
        return (
            <div className="error-message">
                Error loading orchestration: {error}
                <Button onClick={() => navigate('/orchestrations')}>
                    Back to Orchestrations
                </Button>
            </div>
        );
    }
    
    if (!orchestration) {
        return (
            <div className="not-found-message">
                Orchestration not found
                <Button onClick={() => navigate('/orchestrations')}>
                    Back to Orchestrations
                </Button>
            </div>
        );
    }
    
    return (
        <div className="orchestration-detail">
            <div className="detail-header">
                <div className="header-content">
                    <h1>{orchestration.name}</h1>
                    <span className={`status-badge status-${orchestration.status}`}>
                        {orchestration.status}
                    </span>
                </div>
                
                <div className="header-actions">
                    {orchestration.status === 'paused' && (
                        <Button 
                            variant="primary" 
                            onClick={handleStart}
                            disabled={loading}
                        >
                            Resume
                        </Button>
                    )}
                    
                    {orchestration.status === 'active' && (
                        <>
                            <Button 
                                variant="secondary" 
                                onClick={handlePause}
                                disabled={loading}
                            >
                                Pause
                            </Button>
                            <Button 
                                variant="danger" 
                                onClick={handleStop}
                                disabled={loading}
                            >
                                Stop
                            </Button>
                        </>
                    )}
                    
                    {orchestration.status === 'completed' && (
                        <Button 
                            variant="primary" 
                            onClick={handleStart}
                            disabled={loading}
                        >
                            Restart
                        </Button>
                    )}
                    
                    <Button 
                        variant="secondary"
                        onClick={() => navigate(`/orchestrations/${orchestrationId}/edit`)}
                    >
                        Edit
                    </Button>
                    
                    <Button 
                        variant="danger"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Delete
                    </Button>
                </div>
            </div>
            
            <Tabs
                activeTab={activeTab}
                onChange={setActiveTab}
                tabs={[
                    { id: 'overview', label: 'Overview' },
                    { id: 'agents', label: 'Agents' },
                    { id: 'events', label: 'Events' },
                    { id: 'metrics', label: 'Metrics' },
                    { id: 'logs', label: 'Logs' },
                ]}
            />
            
            <div className="tab-content">
                {activeTab === 'overview' && (
                    <OrchestrationOverview 
                        orchestration={orchestration} 
                        metrics={metrics}
                    />
                )}
                
                {activeTab === 'agents' && (
                    <OrchestrationAgents 
                        orchestration={orchestration} 
                    />
                )}
                
                {activeTab === 'events' && (
                    <OrchestrationEvents 
                        events={events} 
                        orchestrationId={orchestrationId}
                    />
                )}
                
                {activeTab === 'metrics' && (
                    <OrchestrationMetrics 
                        metrics={metrics} 
                        orchestrationId={orchestrationId}
                    />
                )}
                
                {activeTab === 'logs' && (
                    <OrchestrationLogs 
                        orchestrationId={orchestrationId} 
                    />
                )}
            </div>
        </div>
    );
};

/**
 * OrchestrationOverview component for displaying orchestration overview
 * 
 * @param {Object} props - Component props
 * @param {Object} props.orchestration - Orchestration data
 * @param {Object} props.metrics - Orchestration metrics
 */
const OrchestrationOverview = ({ orchestration, metrics }) => {
    return (
        <div className="orchestration-overview">
            <Card>
                <h2>Orchestration Details</h2>
                
                <div className="detail-grid">
                    <div className="detail-item">
                        <span className="detail-label">ID:</span>
                        <span className="detail-value">{orchestration.id}</span>
                    </div>
                    
                    <div className="detail-item">
                        <span className="detail-label">Type:</span>
                        <span className="detail-value">{orchestration.type}</span>
                    </div>
                    
                    <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className={`detail-value status-${orchestration.status}`}>
                            {orchestration.status}
                        </span>
                    </div>
                    
                    <div className="detail-item">
                        <span className="detail-label">Created:</span>
                        <span className="detail-value">
                            {new Date(orchestration.createdAt).toLocaleString()}
                        </span>
                    </div>
                    
                    <div className="detail-item">
                        <span className="detail-label">Last Updated:</span>
                        <span className="detail-value">
                            {new Date(orchestration.updatedAt).toLocaleString()}
                        </span>
                    </div>
                    
                    <div className="detail-item">
                        <span className="detail-label">Agent Count:</span>
                        <span className="detail-value">{orchestration.agentCount}</span>
                    </div>
                </div>
                
                <div className="detail-description">
                    <h3>Description</h3>
                    <p>{orchestration.description || 'No description provided'}</p>
                </div>
            </Card>
            
            <Card>
                <h2>Key Metrics</h2>
                
                <div className="metrics-grid">
                    <div className="metric-card">
                        <h3>Total Events</h3>
                        <div className="metric-value">{metrics.totalEvents || 0}</div>
                    </div>
                    
                    <div className="metric-card">
                        <h3>Agent Interactions</h3>
                        <div className="metric-value">{metrics.agentInteractions || 0}</div>
                    </div>
                    
                    <div className="metric-card">
                        <h3>Tool Calls</h3>
                        <div className="metric-value">{metrics.toolCalls || 0}</div>
                    </div>
                    
                    <div className="metric-card">
                        <h3>Runtime</h3>
                        <div className="metric-value">
                            {metrics.runtime ? `${metrics.runtime}s` : 'N/A'}
                        </div>
                    </div>
                </div>
            </Card>
            
            <Card>
                <h2>Parameters</h2>
                
                {orchestration.parameters && Object.keys(orchestration.parameters).length > 0 ? (
                    <div className="parameters-list">
                        {Object.entries(orchestration.parameters).map(([key, value]) => (
                            <div key={key} className="parameter-item">
                                <span className="parameter-name">{key}:</span>
                                <span className="parameter-value">
                                    {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No parameters configured</p>
                )}
            </Card>
        </div>
    );
};

/**
 * OrchestrationAgents component for displaying orchestration agents
 * 
 * @param {Object} props - Component props
 * @param {Object} props.orchestration - Orchestration data
 */
const OrchestrationAgents = ({ orchestration }) => {
    return (
        <div className="orchestration-agents">
            <Card>
                <h2>Agents</h2>
                
                {orchestration.agents && orchestration.agents.length > 0 ? (
                    <div className="agents-grid">
                        {orchestration.agents.map(agent => (
                            <Card key={agent.id} className="agent-card">
                                <div className="agent-header">
                                    <h3 className="agent-name">{agent.name}</h3>
                                    {agent.id === orchestration.masterAgent && (
                                        <span className="master-badge">Master</span>
                                    )}
                                </div>
                                
                                <div className="agent-details">
                                    <div className="agent-type">
                                        <span className="detail-label">Type:</span>
                                        <span className="detail-value">{agent.type}</span>
                                    </div>
                                    
                                    <div className="agent-status">
                                        <span className="detail-label">Status:</span>
                                        <span className={`detail-value status-${agent.status}`}>
                                            {agent.status}
                                        </span>
                                    </div>
                                    
                                    <div className="agent-description">
                                        <p>{agent.description || 'No description provided'}</p>
                                    </div>
                                </div>
                                
                                <div className="agent-actions">
                                    <Link to={`/agents/${agent.id}`}>
                                        <Button variant="secondary" size="small">
                                            View Agent
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p>No agents configured for this orchestration</p>
                )}
            </Card>
            
            <Card>
                <h2>Agent Relationships</h2>
                
                <div className="agent-relationships">
                    {/* Agent relationship visualization would go here */}
                    <p>Agent relationship visualization not available</p>
                </div>
            </Card>
        </div>
    );
};

/**
 * OrchestrationEvents component for displaying orchestration events
 * 
 * @param {Object} props - Component props
 * @param {Array} props.events - Orchestration events
 * @param {string} props.orchestrationId - Orchestration ID
 */
const OrchestrationEvents = ({ events, orchestrationId }) => {
    const [filter, setFilter] = useState('all');
    
    // Filter events based on selected filter
    const filteredEvents = filter === 'all' 
        ? events 
        : events.filter(event => event.type === filter);
    
    return (
        <div className="orchestration-events">
            <Card>
                <div className="card-header-with-actions">
                    <h2>Events</h2>
                    
                    <div className="filter-controls">
                        <label htmlFor="event-filter">Filter:</label>
                        <select 
                            id="event-filter" 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Events</option>
                            <option value="agent">Agent Events</option>
                            <option value="tool">Tool Events</option>
                            <option value="system">System Events</option>
                            <option value="error">Error Events</option>
                        </select>
                    </div>
                </div>
                
                {filteredEvents.length === 0 ? (
                    <p>No events to display</p>
                ) : (
                    <div className="events-list">
                        {filteredEvents.map(event => (
                            <div key={event.id} className={`event-item event-${event.type}`}>
                                <div className="event-header">
                                    <span className="event-timestamp">
                                        {new Date(event.timestamp).toLocaleString()}
                                    </span>
                                    <span className={`event-type event-type-${event.type}`}>
                                        {event.type}
                                    </span>
                                </div>
                                
                                <div className="event-content">
                                    <p className="event-message">{event.message}</p>
                                    
                                    {event.data && (
                                        <div className="event-data">
                                            <pre>{JSON.stringify(event.data, null, 2)}</pre>
                                        </div>
                                    )}
                                </div>
                                
                                {event.agent && (
                                    <div className="event-agent">
                                        <span className="event-agent-label">Agent:</span>
                                        <span className="event-agent-value">{event.agent}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

/**
 * OrchestrationMetrics component for displaying orchestration metrics
 * 
 * @param {Object} props - Component props
 * @param {Object} props.metrics - Orchestration metrics
 * @param {string} props.orchestrationId - Orchestration ID
 */
const OrchestrationMetrics = ({ metrics, orchestrationId }) => {
    return (
        <div className="orchestration-metrics">
            <Card>
                <h2>Performance Metrics</h2>
                
                <div className="metrics-grid">
                    <div className="metric-card">
                        <h3>Total Events</h3>
                        <div className="metric-value">{metrics.totalEvents || 0}</div>
                    </div>
                    
                    <div className="metric-card">
                        <h3>Agent Interactions</h3>
                        <div className="metric-value">{metrics.agentInteractions || 0}</div>
                    </div>
                    
                    <div className="metric-card">
                        <h3>Tool Calls</h3>
                        <div className="metric-value">{metrics.toolCalls || 0}</div>
                    </div>
                    
                    <div className="metric-card">
                        <h3>Runtime</h3>
                        <div className="metric-value">
                            {metrics.runtime ? `${metrics.runtime}s` : 'N/A'}
                        </div>
                    </div>
                    
                    <div className="metric-card">
                        <h3>Average Response Time</h3>
                        <div className="metric-value">
                            {metrics.avgResponseTime ? `${metrics.avgResponseTime}ms` : 'N/A'}
                        </div>
                    </div>
                    
                    <div className="metric-card">
                        <h3>Error Rate</h3>
                        <div className="metric-value">
                            {metrics.errorRate !== undefined ? `${metrics.errorRate}%` : 'N/A'}
                        </div>
                    </div>
                </div>
            </Card>
            
            <Card>
                <h2>Agent Metrics</h2>
                
                {metrics.agentMetrics ? (
                    <div className="agent-metrics-list">
                        {Object.entries(metrics.agentMetrics).map(([agentId, agentMetrics]) => (
                            <div key={agentId} className="agent-metrics-item">
                                <h3>{agentMetrics.name}</h3>
                                
                                <div className="agent-metrics-grid">
                                    <div className="agent-metric">
                                        <span className="metric-label">Events:</span>
                                        <span className="metric-value">{agentMetrics.events || 0}</span>
                                    </div>
                                    
                                    <div className="agent-metric">
                                        <span className="metric-label">Tool Calls:</span>
                                        <span className="metric-value">{agentMetrics.toolCalls || 0}</span>
                                    </div>
                                    
                                    <div className="agent-metric">
                                        <span className="metric-label">Response Time:</span>
                                        <span className="metric-value">
                                            {agentMetrics.avgResponseTime ? `${agentMetrics.avgResponseTime}ms` : 'N/A'}
                                        </span>
                                    </div>
                                    
                                    <div className="agent-metric">
                                        <span className="metric-label">Error Rate:</span>
                                        <span className="metric-value">
                                            {agentMetrics.errorRate !== undefined ? `${agentMetrics.errorRate}%` : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No agent metrics available</p>
                )}
            </Card>
            
            <Card>
                <h2>Tool Metrics</h2>
                
                {metrics.toolMetrics ? (
                    <div className="tool-metrics-list">
                        {Object.entries(metrics.toolMetrics).map(([toolId, toolMetrics]) => (
                            <div key={toolId} className="tool-metrics-item">
                                <h3>{toolMetrics.name}</h3>
                                
                                <div className="tool-metrics-grid">
                                    <div className="tool-metric">
                                        <span className="metric-label">Calls:</span>
                                        <span className="metric-value">{toolMetrics.calls || 0}</span>
                                    </div>
                                    
                                    <div className="tool-metric">
                                        <span className="metric-label">Success Rate:</span>
                                        <span className="metric-value">
                                            {toolMetrics.successRate !== undefined ? `${toolMetrics.successRate}%` : 'N/A'}
                                        </span>
                                    </div>
                                    
                                    <div className="tool-metric">
                                        <span className="metric-label">Avg. Duration:</span>
                                        <span className="metric-value">
                                            {toolMetrics.avgDuration ? `${toolMetrics.avgDuration}ms` : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No tool metrics available</p>
                )}
            </Card>
        </div>
    );
};

/**
 * OrchestrationLogs component for displaying orchestration logs
 * 
 * @param {Object} props - Component props
 * @param {string} props.orchestrationId - Orchestration ID
 */
const OrchestrationLogs = ({ orchestrationId }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    // Fetch logs on component mount and when page changes
    useEffect(() => {
        setLoading(true);
        
        orchestrationApi.getOrchestrationLogs(orchestrationId, { page, filter })
            .then(response => {
                if (page === 1) {
                    setLogs(response.logs);
                } else {
                    setLogs(prevLogs => [...prevLogs, ...response.logs]);
                }
                
                setHasMore(response.hasMore);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [orchestrationId, page, filter]);
    
    // Handle filter change
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setPage(1); // Reset to first page when filter changes
    };
    
    // Load more logs
    const loadMore = () => {
        setPage(prevPage => prevPage + 1);
    };
    
    // Filter logs based on selected filter
    const filteredLogs = filter === 'all' 
        ? logs 
        : logs.filter(log => log.level === filter);
    
    return (
        <div className="orchestration-logs">
            <Card>
                <div className="card-header-with-actions">
                    <h2>Logs</h2>
                    
                    <div className="filter-controls">
                        <label htmlFor="log-filter">Filter:</label>
                        <select 
                            id="log-filter" 
                            value={filter} 
                            onChange={handleFilterChange}
                        >
                            <option value="all">All Logs</option>
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="error">Error</option>
                            <option value="debug">Debug</option>
                        </select>
                    </div>
                </div>
                
                {error && (
                    <div className="error-message">
                        Error loading logs: {error}
                    </div>
                )}
                
                {filteredLogs.length === 0 && !loading ? (
                    <p>No logs to display</p>
                ) : (
                    <div className="logs-list">
                        {filteredLogs.map(log => (
                            <div key={log.id} className={`log-item log-${log.level}`}>
                                <div className="log-header">
                                    <span className="log-timestamp">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </span>
                                    <span className={`log-level log-level-${log.level}`}>
                                        {log.level}
                                    </span>
                                </div>
                                
                                <div className="log-content">
                                    <p className="log-message">{log.message}</p>
                                </div>
                                
                                {log.context && (
                                    <div className="log-context">
                                        <pre>{JSON.stringify(log.context, null, 2)}</pre>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {hasMore && (
                            <div className="load-more">
                                <Button 
                                    variant="secondary" 
                                    onClick={loadMore}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Load More'}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default OrchestrationDetail;

