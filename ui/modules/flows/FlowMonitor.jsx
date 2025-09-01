import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Components
import Card from '../../components/Card';
import Button from '../../components/Button';
import Tabs from '../../components/Tabs';
import FlowVisualizer from './FlowVisualizer';

// Actions
import { flowApi } from '../../services/api';
import webSocketService from '../../services/WebSocketService';

/**
 * FlowMonitor component for monitoring flow execution
 */
const FlowMonitor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { flowId, executionId } = useParams();
    
    // Redux state
    const selectedFlow = useSelector(state => state.flows.selectedFlow);
    const loading = useSelector(state => state.flows.loading);
    const error = useSelector(state => state.flows.error);
    
    // Local state
    const [activeTab, setActiveTab] = useState('visualization');
    const [execution, setExecution] = useState(null);
    const [executionStatus, setExecutionStatus] = useState('idle');
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [events, setEvents] = useState([]);
    const [logs, setLogs] = useState([]);
    const [metrics, setMetrics] = useState({});
    
    // Fetch flow and execution data when component mounts
    useEffect(() => {
        // Fetch flow data
        dispatch({ type: 'FETCH_FLOW_REQUEST', payload: flowId });
        
        flowApi.getFlow(flowId)
            .then(response => {
                dispatch({
                    type: 'FETCH_FLOW_SUCCESS',
                    payload: response,
                });
                
                if (response.nodes && response.edges) {
                    setNodes(response.nodes);
                    setEdges(response.edges);
                }
            })
            .catch(error => {
                dispatch({
                    type: 'FETCH_FLOW_FAILURE',
                    payload: error.message,
                });
            });
            
        // If executionId is provided, fetch execution data
        if (executionId) {
            fetchExecutionData();
            
            // Connect to WebSocket for real-time updates
            webSocketService.connect(`flow-execution-${executionId}`)
                .then(() => {
                    console.log('Connected to WebSocket for flow execution updates');
                    
                    // Listen for execution events
                    webSocketService.addEventListener('execution_update', handleExecutionUpdate);
                    webSocketService.addEventListener('execution_event', handleExecutionEvent);
                    webSocketService.addEventListener('execution_log', handleExecutionLog);
                    webSocketService.addEventListener('execution_metrics', handleExecutionMetrics);
                    webSocketService.addEventListener('node_status_update', handleNodeStatusUpdate);
                })
                .catch(error => {
                    console.error('Error connecting to WebSocket:', error);
                });
                
            // Cleanup WebSocket connection on component unmount
            return () => {
                webSocketService.removeEventListener('execution_update', handleExecutionUpdate);
                webSocketService.removeEventListener('execution_event', handleExecutionEvent);
                webSocketService.removeEventListener('execution_log', handleExecutionLog);
                webSocketService.removeEventListener('execution_metrics', handleExecutionMetrics);
                webSocketService.removeEventListener('node_status_update', handleNodeStatusUpdate);
                webSocketService.disconnect();
            };
        }
    }, [dispatch, flowId, executionId]);
    
    // Fetch execution data
    const fetchExecutionData = () => {
        flowApi.getFlowExecutionStatus(executionId)
            .then(response => {
                setExecution(response);
                setExecutionStatus(response.status);
                
                // Fetch execution events
                flowApi.getFlowExecutionEvents(executionId)
                    .then(events => {
                        setEvents(events);
                    })
                    .catch(error => {
                        console.error('Error fetching execution events:', error);
                    });
                    
                // Fetch execution logs
                flowApi.getFlowExecutionLogs(executionId)
                    .then(logs => {
                        setLogs(logs);
                    })
                    .catch(error => {
                        console.error('Error fetching execution logs:', error);
                    });
                    
                // Fetch execution metrics
                flowApi.getFlowExecutionMetrics(executionId)
                    .then(metrics => {
                        setMetrics(metrics);
                    })
                    .catch(error => {
                        console.error('Error fetching execution metrics:', error);
                    });
                    
                // Update node statuses
                if (response.nodeStatuses) {
                    updateNodeStatuses(response.nodeStatuses);
                }
            })
            .catch(error => {
                console.error('Error fetching execution status:', error);
            });
    };
    
    // Update node statuses
    const updateNodeStatuses = (nodeStatuses) => {
        setNodes(prevNodes => {
            return prevNodes.map(node => {
                const status = nodeStatuses[node.id];
                if (status) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            status,
                        },
                    };
                }
                return node;
            });
        });
    };
    
    // WebSocket event handlers
    const handleExecutionUpdate = (data) => {
        setExecution(prevExecution => ({
            ...prevExecution,
            ...data,
        }));
        setExecutionStatus(data.status);
    };
    
    const handleExecutionEvent = (data) => {
        setEvents(prevEvents => [data, ...prevEvents]);
    };
    
    const handleExecutionLog = (data) => {
        setLogs(prevLogs => [data, ...prevLogs]);
    };
    
    const handleExecutionMetrics = (data) => {
        setMetrics(prevMetrics => ({
            ...prevMetrics,
            ...data,
        }));
    };
    
    const handleNodeStatusUpdate = (data) => {
        const { nodeId, status } = data;
        
        setNodes(prevNodes => {
            return prevNodes.map(node => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            status,
                        },
                    };
                }
                return node;
            });
        });
    };
    
    // Handle execution actions
    const handleStartExecution = () => {
        flowApi.executeFlow(flowId)
            .then(response => {
                navigate(`/flows/${flowId}/executions/${response.executionId}`);
            })
            .catch(error => {
                console.error('Error starting flow execution:', error);
            });
    };
    
    const handleStopExecution = () => {
        flowApi.stopFlowExecution(executionId)
            .then(response => {
                setExecutionStatus('stopped');
            })
            .catch(error => {
                console.error('Error stopping flow execution:', error);
            });
    };
    
    const handleRestartExecution = () => {
        flowApi.restartFlowExecution(executionId)
            .then(response => {
                setExecutionStatus('running');
            })
            .catch(error => {
                console.error('Error restarting flow execution:', error);
            });
    };
    
    if (loading && !selectedFlow) {
        return <div className="loading-indicator">Loading flow data...</div>;
    }
    
    if (error && !selectedFlow) {
        return (
            <div className="error-message">
                Error loading flow: {error}
                <Button onClick={() => navigate('/flows')}>
                    Back to Flows
                </Button>
            </div>
        );
    }
    
    if (!selectedFlow) {
        return (
            <div className="not-found-message">
                Flow not found
                <Button onClick={() => navigate('/flows')}>
                    Back to Flows
                </Button>
            </div>
        );
    }
    
    return (
        <div className="flow-monitor">
            <div className="monitor-header">
                <div className="header-content">
                    <h1>{selectedFlow.name}</h1>
                    
                    {executionId && (
                        <div className="execution-info">
                            <span className="execution-id">Execution: {executionId}</span>
                            <span className={`execution-status status-${executionStatus}`}>
                                {executionStatus}
                            </span>
                        </div>
                    )}
                </div>
                
                <div className="header-actions">
                    {!executionId && (
                        <Button
                            variant="primary"
                            onClick={handleStartExecution}
                        >
                            Start Execution
                        </Button>
                    )}
                    
                    {executionId && executionStatus === 'running' && (
                        <Button
                            variant="danger"
                            onClick={handleStopExecution}
                        >
                            Stop Execution
                        </Button>
                    )}
                    
                    {executionId && (executionStatus === 'completed' || executionStatus === 'failed' || executionStatus === 'stopped') && (
                        <Button
                            variant="primary"
                            onClick={handleRestartExecution}
                        >
                            Restart Execution
                        </Button>
                    )}
                    
                    <Link to={`/flows/${flowId}/edit`}>
                        <Button variant="secondary">
                            Edit Flow
                        </Button>
                    </Link>
                </div>
            </div>
            
            <Tabs
                activeTab={activeTab}
                onChange={setActiveTab}
                tabs={[
                    { id: 'visualization', label: 'Visualization' },
                    { id: 'events', label: 'Events' },
                    { id: 'logs', label: 'Logs' },
                    { id: 'metrics', label: 'Metrics' },
                ]}
            />
            
            <div className="tab-content">
                {activeTab === 'visualization' && (
                    <Card className="visualization-container">
                        <FlowVisualizer
                            initialNodes={nodes}
                            initialEdges={edges}
                            readOnly={true}
                        />
                    </Card>
                )}
                
                {activeTab === 'events' && (
                    <Card className="events-container">
                        <h2>Execution Events</h2>
                        
                        {events.length === 0 ? (
                            <p>No events to display</p>
                        ) : (
                            <div className="events-list">
                                {events.map((event, index) => (
                                    <div key={index} className={`event-item event-${event.type}`}>
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
                                        
                                        {event.nodeId && (
                                            <div className="event-node">
                                                <span className="event-node-label">Node:</span>
                                                <span className="event-node-value">{event.nodeId}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                )}
                
                {activeTab === 'logs' && (
                    <Card className="logs-container">
                        <h2>Execution Logs</h2>
                        
                        {logs.length === 0 ? (
                            <p>No logs to display</p>
                        ) : (
                            <div className="logs-list">
                                {logs.map((log, index) => (
                                    <div key={index} className={`log-item log-${log.level}`}>
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
                            </div>
                        )}
                    </Card>
                )}
                
                {activeTab === 'metrics' && (
                    <Card className="metrics-container">
                        <h2>Execution Metrics</h2>
                        
                        {Object.keys(metrics).length === 0 ? (
                            <p>No metrics to display</p>
                        ) : (
                            <div className="metrics-grid">
                                <div className="metric-card">
                                    <h3>Duration</h3>
                                    <div className="metric-value">
                                        {metrics.duration ? `${metrics.duration}s` : 'N/A'}
                                    </div>
                                </div>
                                
                                <div className="metric-card">
                                    <h3>Node Count</h3>
                                    <div className="metric-value">
                                        {metrics.nodeCount || 0}
                                    </div>
                                </div>
                                
                                <div className="metric-card">
                                    <h3>Edge Count</h3>
                                    <div className="metric-value">
                                        {metrics.edgeCount || 0}
                                    </div>
                                </div>
                                
                                <div className="metric-card">
                                    <h3>Event Count</h3>
                                    <div className="metric-value">
                                        {metrics.eventCount || 0}
                                    </div>
                                </div>
                                
                                <div className="metric-card">
                                    <h3>Error Count</h3>
                                    <div className="metric-value">
                                        {metrics.errorCount || 0}
                                    </div>
                                </div>
                                
                                <div className="metric-card">
                                    <h3>Success Rate</h3>
                                    <div className="metric-value">
                                        {metrics.successRate !== undefined ? `${metrics.successRate}%` : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {metrics.nodeMetrics && (
                            <div className="node-metrics">
                                <h3>Node Metrics</h3>
                                
                                <div className="node-metrics-list">
                                    {Object.entries(metrics.nodeMetrics).map(([nodeId, nodeMetrics]) => (
                                        <div key={nodeId} className="node-metrics-item">
                                            <h4>{nodeMetrics.label || nodeId}</h4>
                                            
                                            <div className="node-metrics-grid">
                                                <div className="node-metric">
                                                    <span className="metric-label">Duration:</span>
                                                    <span className="metric-value">
                                                        {nodeMetrics.duration ? `${nodeMetrics.duration}s` : 'N/A'}
                                                    </span>
                                                </div>
                                                
                                                <div className="node-metric">
                                                    <span className="metric-label">Status:</span>
                                                    <span className={`metric-value status-${nodeMetrics.status}`}>
                                                        {nodeMetrics.status || 'N/A'}
                                                    </span>
                                                </div>
                                                
                                                <div className="node-metric">
                                                    <span className="metric-label">Event Count:</span>
                                                    <span className="metric-value">
                                                        {nodeMetrics.eventCount || 0}
                                                    </span>
                                                </div>
                                                
                                                <div className="node-metric">
                                                    <span className="metric-label">Error Count:</span>
                                                    <span className="metric-value">
                                                        {nodeMetrics.errorCount || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
};

export default FlowMonitor;

