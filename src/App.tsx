import React, { useState, useEffect, useCallback, useMemo, useReducer } from 'react';
import { LabId, Directive, Agent, KnowledgeFile, MindMapNode, CodeReviewItem, ChronicleLog, ComplianceAlert, ChronicleLogType, DeploymentStatus, AgentStatus, DirectiveStatus, DirectiveTask } from './types';
import { initialLabs } from './data/constants';
import { initialSystemMatrixData, initialAgents, initialKnowledgeBaseFiles, initialMindMapNodes, initialCodeReviewItems } from './data/initialData';
import { directivesReducer } from './state/directivesReducer';
import { agentsReducer } from './state/agentsReducer';
import { Sidebar } from './components/Sidebar';
import { LabBackgroundIcon } from './components/common/LabBackgroundIcon';
import { OperatorHub } from './components/labs/OperatorHub';
import { AuraLiveLab } from './components/labs/AuraLiveLab';
import { StrategyCommandLab } from './components/labs/StrategyCommandLab';
import { MonitoringLab } from './components/labs/MonitoringLab';
import { DeploymentLab } from './components/labs/DeploymentLab';
import { ChronicleLab } from './components/labs/ChronicleLab';
import { CryptoLab } from './components/labs/CryptoLab';
import { KnowledgeBaseLab } from './components/labs/KnowledgeBaseLab';
import { BytebotLab } from './components/labs/BytebotLab';
import { DesktopLab } from './components/labs/DesktopLab';
import { OrchestratorLab } from './components/labs/OrchestratorLab';

export const App = () => {
    const [activeLab, setActiveLab] = useState<LabId>(LabId.Hub);
    
    const [directives, dispatchDirectives] = useReducer(directivesReducer, initialSystemMatrixData);
    const [agents, dispatchAgents] = useReducer(agentsReducer, initialAgents);
    
    const [knowledgeFiles] = useState<KnowledgeFile[]>(initialKnowledgeBaseFiles);
    const [mindMapNodes, setMindMapNodes] = useState<MindMapNode[]>(initialMindMapNodes);
    const [codeReviewItems, setCodeReviewItems] = useState<CodeReviewItem[]>(initialCodeReviewItems);
    const [chronicleLogs, setChronicleLogs] = useState<ChronicleLog[]>([]);
    const [systemHealth, setSystemHealth] = useState(99.8);
    const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>([]);
    
    const logEvent = useCallback((type: ChronicleLogType, message: string) => {
        setChronicleLogs(prev => [{ timestamp: new Date().toLocaleTimeString(), type, message }, ...prev].slice(0, 100));
    }, []);

    useEffect(() => { 
        logEvent(ChronicleLogType.SYSTEM, 'Operator authenticated. Command Center online.'); 
    }, [logEvent]);

    useEffect(() => {
        const healthInterval = setInterval(() => {
            setSystemHealth(prevHealth => {
                const newHealth = Math.max(70, Math.min(100, prevHealth + (Math.random() - 0.45) * 2));
                if (prevHealth > 85 && newHealth <= 85) logEvent(ChronicleLogType.ANOMALY, `System health critical: ${newHealth.toFixed(1)}%. System Guardian investigating.`);
                if (prevHealth <= 85 && newHealth > 85) logEvent(ChronicleLogType.SYSTEM, `System health restored to ${newHealth.toFixed(1)}%. Anomaly resolved.`);
                return newHealth;
            });
        }, 5000);
        return () => clearInterval(healthInterval);
    }, [logEvent]);

    const handleAcknowledgeAlert = useCallback((alertId: string) => {
        setComplianceAlerts(prev => prev.filter(a => a.id !== alertId));
        logEvent(ChronicleLogType.SYSTEM, `Compliance alert ${alertId} acknowledged by operator.`);
    }, [logEvent]);
    
    useEffect(() => {
        const complianceScanInterval = setInterval(() => {
            const FORBIDDEN_KEYWORDS = ['proprietary', 'classified', 'confidential', 'secret', 'internal only'];
            setComplianceAlerts(currentAlerts => {
                const newAlerts: ComplianceAlert[] = [];
                knowledgeFiles.forEach(file => {
                    FORBIDDEN_KEYWORDS.forEach(keyword => {
                        if (file.name.toLowerCase().includes(keyword)) {
                            const alertId = `kb-${file.id}-${keyword}`;
                            if (!currentAlerts.some(a => a.id === alertId)) {
                                const alert: ComplianceAlert = { id: alertId, location: `KB: ${file.name}`, issue: `Potential exposure of "${keyword}" data.`, timestamp: new Date().toLocaleTimeString() };
                                newAlerts.push(alert);
                            }
                        }
                    });
                });
                directives.forEach(directive => {
                    if (directive.deploymentStatus === 'deployed') {
                        FORBIDDEN_KEYWORDS.forEach(keyword => {
                            if (directive.description.toLowerCase().includes(keyword)) {
                                 const alertId = `staging-${directive.id}-${keyword}`;
                                 if (!currentAlerts.some(a => a.id === alertId)) {
                                    const alert: ComplianceAlert = { id: alertId, location: `Staging: ${directive.title}`, issue: `Potentially non-compliant term "${keyword}" in deployed project.`, timestamp: new Date().toLocaleTimeString() };
                                    newAlerts.push(alert);
                                }
                            }
                        });
                    }
                });
                if (newAlerts.length > 0) {
                     newAlerts.forEach(alert => { logEvent(ChronicleLogType.ANOMALY, `Compliance Alert: ${alert.issue} found in ${alert.location}`); });
                    return [...currentAlerts, ...newAlerts];
                }
                return currentAlerts;
            });
        }, 12000); 
        return () => clearInterval(complianceScanInterval);
    }, [knowledgeFiles, directives, logEvent]);


    const addDirective = useCallback((data: Omit<Directive, 'id' | 'status' | 'deploymentStatus'>, nodeId: string) => {
        // Simulate AI generating tasks for the new directive
        const generatedTasks: DirectiveTask[] = [
            { id: `${Date.now()}-1`, name: "Research and Planning", status: 'pending' },
            { id: `${Date.now()}-2`, name: "Component Prototyping", status: 'pending' },
            { id: `${Date.now()}-3`, name: "Code Assembly", status: 'pending' },
            { id: `${Date.now()}-4`, name: "Final Review", status: 'pending' },
        ];
        const newDirective: Directive = { ...data, id: `dir-${Date.now()}`, status: DirectiveStatus.Pending, deploymentStatus: DeploymentStatus.None, tasks: generatedTasks };
        dispatchDirectives({ type: 'ADD', payload: newDirective });
        setMindMapNodes(prev => prev.map(n => n.id === nodeId ? { ...n, isPromoted: true, directiveId: newDirective.id } : n));
        logEvent(ChronicleLogType.DIRECTIVE, `New directive created: "${newDirective.title}" with ${generatedTasks.length} tasks.`);
    }, [logEvent]);

    const handleUpdateTask = useCallback((directiveId: string, taskId: string, updates: Partial<DirectiveTask>) => {
        const directive = directives.find(d => d.id === directiveId);
        if (!directive || !directive.tasks) return;

        const newTasks = directive.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
        
        // If an agent is assigned, simulate work
        if (updates.assignedAgentId && updates.status === 'in_progress') {
            const agent = agents.find(a => a.id === updates.assignedAgentId);
            if (agent) {
                dispatchAgents({ type: 'UPDATE_STATUS', payload: { agentId: agent.id, status: AgentStatus.Executing, taskId: directiveId } });
                logEvent(ChronicleLogType.AGENT, `${agent.name} started task "${directive.tasks.find(t=>t.id === taskId)?.name}" for directive "${directive.title}".`);
                setTimeout(() => {
                    handleUpdateTask(directiveId, taskId, { status: 'completed' });
                }, 3000 + Math.random() * 2000); // Simulate task duration
            }
        }
        
        // If a task is completed, free up the agent
        if (updates.status === 'completed') {
            const task = directive.tasks.find(t => t.id === taskId);
            if (task?.assignedAgentId) {
                dispatchAgents({ type: 'UPDATE_STATUS', payload: { agentId: task.assignedAgentId, status: AgentStatus.Idle } });
                logEvent(ChronicleLogType.AGENT, `Task "${task.name}" completed.`);
            }
        }

        const allTasksCompleted = newTasks.every(t => t.status === 'completed');
        let newDeploymentStatus = directive.deploymentStatus;
        if (allTasksCompleted && directive.deploymentStatus !== DeploymentStatus.InReview) {
            newDeploymentStatus = DeploymentStatus.InReview;
            setCodeReviewItems(prev => [{ id: `pr-${directiveId}`, title: `feat: Implement "${directive.title}"`, author: 'Orchestrator Agent', status: 'Open', directiveId }, ...prev]);
            logEvent(ChronicleLogType.DIRECTIVE, `All tasks for "${directive.title}" completed. Now awaiting deployment approval.`);
        }

        dispatchDirectives({ type: 'UPDATE', payload: { id: directiveId, tasks: newTasks, deploymentStatus: newDeploymentStatus } });
    }, [directives, agents, logEvent]);

    const handleApproveDeployment = useCallback((reviewId: string, directiveId?: string) => {
        if (!directiveId) return;
        const directive = directives.find(d => d.id === directiveId);
        if (!directive) return;

        setCodeReviewItems(prev => prev.map(pr => pr.id === reviewId ? { ...pr, status: 'Merged' } : pr));
        logEvent(ChronicleLogType.DIRECTIVE, `PR approved. Deploying: "${directive.title}"`);
        
        // Simulate deployment
        dispatchDirectives({ type: 'UPDATE', payload: { id: directiveId, deploymentStatus: DeploymentStatus.InProgress } });
        setTimeout(() => {
            dispatchDirectives({ type: 'UPDATE', payload: { id: directiveId, deploymentStatus: DeploymentStatus.Deployed } });
            logEvent(ChronicleLogType.SYSTEM, `Deployment successful for "${directive.title}"`);
        }, 3000);
    }, [directives, logEvent]);
    
    const handleLabChange = useCallback((labId: LabId) => { setActiveLab(labId); }, []);

    const activeLabData = useMemo(() => initialLabs.find(lab => lab.id === activeLab), [activeLab]);
    const directivesInReview = useMemo(() => directives.filter(d => d.deploymentStatus === DeploymentStatus.InReview || d.deploymentStatus === DeploymentStatus.InProgress || d.deploymentStatus === DeploymentStatus.Deployed), [directives]);

    const renderLab = () => {
        switch (activeLab) {
            case LabId.Hub: return <OperatorHub directives={directives} agents={agents} systemHealth={systemHealth} activeLab={activeLab} codeReviewItems={codeReviewItems} complianceAlerts={complianceAlerts} onAcknowledgeAlert={handleAcknowledgeAlert} />;
            case LabId.AuraLive: return <AuraLiveLab logEvent={logEvent} />;
            case LabId.Bytebot: return <BytebotLab logEvent={logEvent} />;
            case LabId.Desktop: return <DesktopLab logEvent={logEvent} />;
            case LabId.Strategy: return <StrategyCommandLab nodes={mindMapNodes} setNodes={setMindMapNodes} addDirective={addDirective} logEvent={logEvent} />;
            case LabId.Orchestrator: return <OrchestratorLab directives={directives} agents={agents} onUpdateTask={handleUpdateTask} />;
            case LabId.Deployment: return <DeploymentLab directivesForDeployment={directivesInReview} codeReviewItems={codeReviewItems} onApprove={handleApproveDeployment} />;
            case LabId.Monitoring: return <MonitoringLab />;
            case LabId.Chronicle: return <ChronicleLab logs={chronicleLogs} />;
            case LabId.Crypto: return <CryptoLab />;
            case LabId.KnowledgeBase: return <KnowledgeBaseLab files={knowledgeFiles} />;
            default: return null;
        }
    }

    return (
        <div className="app-container phoenix-theme">
            <Sidebar activeLab={activeLab} onLabChange={handleLabChange} />
            <main className="main-content">
                <header className="main-header"><h1>{activeLabData?.name}</h1></header>
                <div className="lab-content">
                    {renderLab()}
                </div>
                {activeLabData && <LabBackgroundIcon iconPath={activeLabData.icon} />}
            </main>
        </div>
    );
};