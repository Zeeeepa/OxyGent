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
    
    // Toggle sidebar expansion
    const toggleSidebar = () => {
        setExpanded(!expanded);
    };
    
    return (
        <aside className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                {expanded ? '◀' : '▶'}
            </div>
            
            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {/* Dashboard */}
                    <li className="nav-item">
                        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="nav-icon">📊</span>
                            <span className="nav-text">Dashboard</span>
                        </NavLink>
                    </li>
                    
                    {/* Agents */}
                    <li className="nav-item">
                        <NavLink to="/agents" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="nav-icon">🤖</span>
                            <span className="nav-text">Agents</span>
                            {agentCount > 0 && (
                                <span className="nav-badge">{agentCount}</span>
                            )}
                        </NavLink>
                    </li>
                    
                    {/* Tools */}
                    <li className="nav-item">
                        <NavLink to="/tools" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="nav-icon">🔧</span>
                            <span className="nav-text">Tools</span>
                            {toolCount > 0 && (
                                <span className="nav-badge">{toolCount}</span>
                            )}
                        </NavLink>
                    </li>
                    
                    {/* Workflows */}
                    <li className="nav-item">
                        <NavLink to="/workflows" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="nav-icon">🔄</span>
                            <span className="nav-text">Workflows</span>
                            {workflowCount > 0 && (
                                <span className="nav-badge">{workflowCount}</span>
                            )}
                        </NavLink>
                    </li>
                    
                    {/* System */}
                    <li className="nav-item nav-item-expandable">
                        <div className="nav-item-header">
                            <span className="nav-icon">⚙️</span>
                            <span className="nav-text">System</span>
                        </div>
                        <ul className="nav-sublist">
                            <li className="nav-subitem">
                                <NavLink to="/system/configuration" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <span className="nav-text">Configuration</span>
                                </NavLink>
                            </li>
                            <li className="nav-subitem">
                                <NavLink to="/system/monitoring" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <span className="nav-text">Monitoring</span>
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
            
            <div className="sidebar-footer">
                <a href="http://oxygent.jd.com" target="_blank" rel="noopener noreferrer" className="docs-link">
                    <span className="nav-icon">📚</span>
                    <span className="nav-text">Documentation</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;

