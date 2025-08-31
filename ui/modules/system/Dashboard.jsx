import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

// Components
import Card from '../../components/Card';
import Button from '../../components/Button';

// Actions
import { systemApi } from '../../services/api';

/**
 * Dashboard component that displays an overview of the system
 */
const Dashboard = () => {
    const dispatch = useDispatch();
    
    const agents = useSelector(state => state.agents.items);
    const tools = useSelector(state => state.tools.items);
    const workflows = useSelector(state => state.workflows.items);
    const systemInfo = useSelector(state => state.system.info);
    const systemMetrics = useSelector(state => state.system.metrics);
    const loading = useSelector(state => state.system.loading);
    const error = useSelector(state => state.system.error);
    
    // Fetch system metrics on component mount and every 30 seconds
    useEffect(() => {
        const fetchMetrics = () => {
            dispatch({ type: 'FETCH_SYSTEM_METRICS_REQUEST' });
            
            systemApi.getSystemMetrics()
                .then(response => {
                    dispatch({
                        type: 'FETCH_SYSTEM_METRICS_SUCCESS',
                        payload: response,
                    });
                })
                .catch(error => {
                    dispatch({
                        type: 'FETCH_SYSTEM_METRICS_FAILURE',
                        payload: error.message,
                    });
                });
        };
        
        // Initial fetch
        fetchMetrics();
        
        // Set up interval for periodic updates
        const intervalId = setInterval(fetchMetrics, 30000);
        
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [dispatch]);
    
    return (
        <div className="dashboard">
            <div className="page-header">
                <h1>Dashboard</h1>
            </div>
            
            {/* System Overview */}
            <div className="dashboard-section">
                <h2 className="section-title">System Overview</h2>
                
                <div className="dashboard-cards">
                    <Card title="Agents" className="dashboard-card">
                        <div className="dashboard-stat">
                            <div className="stat-value">{agents?.length || 0}</div>
                            <div className="stat-label">Total Agents</div>
                        </div>
                        <div className="dashboard-stat-footer">
                            <Link to="/agents">
                                <Button variant="outline" size="small">
                                    View Agents
                                </Button>
                            </Link>
                            <Link to="/agents/create">
                                <Button variant="primary" size="small">
                                    Create Agent
                                </Button>
                            </Link>
                        </div>
                    </Card>
                    
                    <Card title="Tools" className="dashboard-card">
                        <div className="dashboard-stat">
                            <div className="stat-value">{tools?.length || 0}</div>
                            <div className="stat-label">Total Tools</div>
                        </div>
                        <div className="dashboard-stat-footer">
                            <Link to="/tools">
                                <Button variant="outline" size="small">
                                    View Tools
                                </Button>
                            </Link>
                            <Link to="/tools/create">
                                <Button variant="primary" size="small">
                                    Register Tool
                                </Button>
                            </Link>
                        </div>
                    </Card>
                    
                    <Card title="Workflows" className="dashboard-card">
                        <div className="dashboard-stat">
                            <div className="stat-value">{workflows?.length || 0}</div>
                            <div className="stat-label">Total Workflows</div>
                        </div>
                        <div className="dashboard-stat-footer">
                            <Link to="/workflows">
                                <Button variant="outline" size="small">
                                    View Workflows
                                </Button>
                            </Link>
                            <Link to="/workflows/create">
                                <Button variant="primary" size="small">
                                    Create Workflow
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
            
            {/* System Metrics */}
            <div className="dashboard-section">
                <h2 className="section-title">System Metrics</h2>
                
                <Card loading={loading}>
                    {error ? (
                        <div className="error-message">
                            <p>Error loading system metrics: {error}</p>
                            <Button 
                                variant="primary" 
                                onClick={() => dispatch({ type: 'FETCH_SYSTEM_METRICS_REQUEST' })}
                            >
                                Retry
                            </Button>
                        </div>
                    ) : systemMetrics ? (
                        <div className="metrics-grid">
                            <div className="metric-card">
                                <div className="metric-title">CPU Usage</div>
                                <div className="metric-value">{systemMetrics.cpu_usage}%</div>
                                <div className="metric-chart">
                                    <div 
                                        className="metric-bar"
                                        style={{ width: `${systemMetrics.cpu_usage}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            <div className="metric-card">
                                <div className="metric-title">Memory Usage</div>
                                <div className="metric-value">{systemMetrics.memory_usage}%</div>
                                <div className="metric-chart">
                                    <div 
                                        className="metric-bar"
                                        style={{ width: `${systemMetrics.memory_usage}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            <div className="metric-card">
                                <div className="metric-title">Disk Usage</div>
                                <div className="metric-value">{systemMetrics.disk_usage}%</div>
                                <div className="metric-chart">
                                    <div 
                                        className="metric-bar"
                                        style={{ width: `${systemMetrics.disk_usage}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            <div className="metric-card">
                                <div className="metric-title">Network I/O</div>
                                <div className="metric-value">
                                    {systemMetrics.network_in} / {systemMetrics.network_out}
                                </div>
                            </div>
                            
                            <div className="metric-card">
                                <div className="metric-title">Active Tasks</div>
                                <div className="metric-value">{systemMetrics.active_tasks}</div>
                            </div>
                            
                            <div className="metric-card">
                                <div className="metric-title">Completed Tasks</div>
                                <div className="metric-value">{systemMetrics.completed_tasks}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No system metrics available.</p>
                        </div>
                    )}
                </Card>
            </div>
            
            {/* Recent Activity */}
            <div className="dashboard-section">
                <h2 className="section-title">Recent Activity</h2>
                
                <Card>
                    {systemMetrics?.recent_activity?.length > 0 ? (
                        <div className="activity-list">
                            {systemMetrics.recent_activity.map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <div className="activity-icon">
                                        {activity.type === 'agent_created' ? '🤖' : 
                                         activity.type === 'tool_registered' ? '🔧' : 
                                         activity.type === 'workflow_created' ? '🔄' : 
                                         activity.type === 'task_completed' ? '✅' : '📝'}
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-message">{activity.message}</div>
                                        <div className="activity-time">{activity.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No recent activity.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;

