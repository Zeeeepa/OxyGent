import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Layout components
import Layout from './components/Layout';

// Page components
import Dashboard from './modules/system/Dashboard';
import AgentList from './modules/agents/AgentList';
import AgentCreation from './modules/agents/AgentCreation';
import AgentConfiguration from './modules/agents/AgentConfiguration';
import AgentMonitoring from './modules/agents/AgentMonitoring';
import ToolList from './modules/tools/ToolList';
import ToolRegistration from './modules/tools/ToolRegistration';
import ToolConfiguration from './modules/tools/ToolConfiguration';
import ToolTesting from './modules/tools/ToolTesting';
import WorkflowList from './modules/workflows/WorkflowList';
import WorkflowDesigner from './modules/workflows/WorkflowDesigner';
import WorkflowMonitoring from './modules/workflows/WorkflowMonitoring';
import SystemConfiguration from './modules/system/SystemConfiguration';
import PerformanceMonitoring from './modules/system/PerformanceMonitoring';
import OrchestrationDashboard from './modules/orchestration/OrchestrationDashboard';
import OrchestrationCreation from './modules/orchestration/OrchestrationCreation';
import OrchestrationDetail from './modules/orchestration/OrchestrationDetail';

// Actions
import { fetchAgentOrganization, fetchSystemInfo } from './services/api';

/**
 * Main App component that handles routing and initial data loading
 */
const App = () => {
    const dispatch = useDispatch();

    // Load initial data when the app starts
    useEffect(() => {
        // Fetch agent organization structure
        dispatch(fetchAgentOrganization());
        
        // Fetch system information
        dispatch(fetchSystemInfo());
    }, [dispatch]);

    return (
        <Layout>
            <Routes>
                {/* Dashboard */}
                <Route path="/" element={<Dashboard />} />
                
                {/* Agent routes */}
                <Route path="/agents" element={<AgentList />} />
                <Route path="/agents/create" element={<AgentCreation />} />
                <Route path="/agents/:agentId" element={<AgentConfiguration />} />
                <Route path="/agents/:agentId/monitor" element={<AgentMonitoring />} />
                
                {/* Tool routes */}
                <Route path="/tools" element={<ToolList />} />
                <Route path="/tools/create" element={<ToolRegistration />} />
                <Route path="/tools/:toolId" element={<ToolConfiguration />} />
                <Route path="/tools/:toolId/test" element={<ToolTesting />} />
                
                {/* Workflow routes */}
                <Route path="/workflows" element={<WorkflowList />} />
                <Route path="/workflows/create" element={<WorkflowDesigner />} />
                <Route path="/workflows/:workflowId" element={<WorkflowDesigner />} />
                <Route path="/workflows/:workflowId/monitor" element={<WorkflowMonitoring />} />
                
                {/* Orchestration routes */}
                <Route path="/orchestrations" element={<OrchestrationDashboard />} />
                <Route path="/orchestrations/create" element={<OrchestrationCreation />} />
                <Route path="/orchestrations/:orchestrationId" element={<OrchestrationDetail />} />
                
                {/* System routes */}
                <Route path="/system/configuration" element={<SystemConfiguration />} />
                <Route path="/system/monitoring" element={<PerformanceMonitoring />} />
            </Routes>
        </Layout>
    );
};

export default App;

