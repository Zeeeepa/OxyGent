import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

/**
 * Sidebar component that displays the main navigation menu
 */
const Sidebar = () => {
    const [expanded, setExpanded] = useState(true);
    const agentCount = useSelector(state => state.agents.items.length);
    const toolCount = useSelector(state => state.tools.items.length);
    const workflowCount = useSelector(state => state.workflows.items.length);
    const orchestrationCount = useSelector(state => state.orchestration ? state.orchestration.items.length : 0);
    
    // Toggle sidebar expansion
    const toggleSidebar = () => {
        setExpanded(!expanded);
    };
    
    return (
        <aside className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                {expanded ? '\u25c0' : '\u25b6'}
            </div>
            
            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {/* Dashboard */}
                    <li className="nav-item">
                        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="nav-icon">📊</span>
                            {expanded && <span className="nav-text">Dashboard</span>}
                        </NavLink>
                    </li>
                    
                    {/* Agents */}
                    <li className="nav-item">
                        <NavLink to="/agents" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="nav-icon">🤖</span>
                            {expanded && (
                                <span className="nav-text">
                                    Agents
                                    {agentCount > 0 && (
                                        <span className="nav-badge">{agentCount}</span>
                                    )}
                                </span>
                            )}
                        </NavLink>
                    </li>
                    
                    {/* Tools */}
                    <li className="nav-item">
                        <NavLink to="/tools" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="nav-icon">🔧</span>
                            {expanded && (
                                <span className="nav-text">
                                    Tools
                                    {toolCount > 0 && (
                                        <span className="nav-badge">{toolCount}</span>
                                    )}
                                </span>
                            )}
                        </NavLink>
                    </li>
                    
                    {/* Workflows */}
                    <li className="nav-item">
                        <NavLink to="/workflows" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="nav-icon">📝</span>
                            {expanded && (
                                <span className="nav-text">
                                    Workflows
                                    {workflowCount > 0 && (
                                        <span className="nav-badge">{workflowCount}</span>
                                    )}
                                </span>
                            )}
                        </NavLink>
                    </li>
                    
                    {/* Orchestration */}
                    <li className="nav-item">
                        <NavLink to="/orchestrations" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="nav-icon">🎭</span>
                            {expanded && (
                                <span className="nav-text">
                                    Orchestration
                                    {orchestrationCount > 0 && (
                                        <span className="nav-badge">{orchestrationCount}</span>
                                    )}
                                </span>
                            )}
                        </NavLink>
                    </li>
                    
                    {/* System */}
                    <li className="nav-section">
                        {expanded && <span className="nav-section-title">System</span>}
                    </li>
                    
                    <li className="nav-item">
                        <NavLink to="/system/configuration" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="nav-icon">⚙️</span>
                            {expanded && <span className="nav-text">Configuration</span>}
                        </NavLink>
                    </li>
                    
                    <li className="nav-item">
                        <NavLink to="/system/monitoring" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="nav-icon">📈</span>
                            {expanded && <span className="nav-text">Monitoring</span>}
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;

