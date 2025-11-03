import React, { useState, useMemo } from 'react';
// FIX: Imported `DirectiveStatus` to resolve reference error.
import { Directive, Agent, DirectiveTask, DirectivePriority, DirectiveStatus } from '../../types';

const ExecutionPlan = ({ directive, agents, onUpdateTask }: { directive: Directive, agents: Agent[], onUpdateTask: (directiveId: string, taskId: string, updates: Partial<DirectiveTask>) => void }) => {
    const handleAssignAgent = (taskId: string, agentId: string) => {
        if (agentId === "unassigned") {
            onUpdateTask(directive.id, taskId, { assignedAgentId: undefined, status: 'pending' });
        } else {
            onUpdateTask(directive.id, taskId, { assignedAgentId: agentId, status: 'in_progress' });
        }
    };
    
    return (
        <div className="execution-plan-panel">
            <div className="execution-plan-header">
                <h3>{directive.title}</h3>
                <p>{directive.description}</p>
            </div>
            <ul className="task-list">
                {directive.tasks?.map(task => (
                    <li key={task.id} className="task-item">
                        <span className={`task-status-dot task-status-${task.status.replace('_', '')}`} />
                        <span className="task-name">{task.name}</span>
                        <select 
                            className="agent-select" 
                            value={task.assignedAgentId || "unassigned"} 
                            onChange={(e) => handleAssignAgent(task.id, e.target.value)}
                            disabled={task.status === 'completed' || task.status === 'in_progress'}
                        >
                            <option value="unassigned">Unassigned</option>
                            {agents.filter(a => a.status === 'Idle').map(agent => (
                                <option key={agent.id} value={agent.id}>{agent.name}</option>
                            ))}
                        </select>
                    </li>
                ))}
            </ul>
            <div className="execution-log-container">
                <h4>Execution Log</h4>
                <div className="execution-log">
                    <p>[{new Date().toLocaleTimeString()}] Orchestrator initialized for directive.</p>
                    {directive.tasks?.filter(t => t.assignedAgentId).map(t => (
                        <p key={t.id}>[{new Date().toLocaleTimeString()}] Task "{t.name}" assigned to Agent {agents.find(a=>a.id === t.assignedAgentId)?.name}. Status: {t.status}.</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

// FIX: Wrapped component in React.memo to resolve TS error with the 'key' prop and for consistency.
const DirectiveListItem = React.memo(({ directive, isSelected, onClick }: { directive: Directive; isSelected: boolean; onClick: () => void; }) => {
    const progress = useMemo(() => {
        if (!directive.tasks || directive.tasks.length === 0) return 100;
        const completed = directive.tasks.filter(t => t.status === 'completed').length;
        return (completed / directive.tasks.length) * 100;
    }, [directive.tasks]);

    return (
        <li className={`directive-list-item ${isSelected ? 'selected' : ''}`} onClick={onClick}>
            <div className="directive-list-item-header">
                <span className="directive-list-item-title">{directive.title}</span>
                <span className={`priority-badge priority-${directive.priority.toLowerCase()}`}>{directive.priority}</span>
            </div>
            <div className="directive-progress-bar">
                <div style={{ width: `${progress}%` }}></div>
            </div>
        </li>
    );
});

export const OrchestratorLab = ({ directives, agents, onUpdateTask }: { directives: Directive[], agents: Agent[], onUpdateTask: (directiveId: string, taskId: string, updates: Partial<DirectiveTask>) => void }) => {
    const [selectedDirectiveId, setSelectedDirectiveId] = useState<string | null>(null);

    const pendingDirectives = useMemo(() => directives.filter(d => d.status === DirectiveStatus.Pending && d.deployable), [directives]);
    const selectedDirective = useMemo(() => directives.find(d => d.id === selectedDirectiveId), [directives, selectedDirectiveId]);

    return (
        <div className="lab-container orchestrator-lab">
            <div className="directive-list-panel">
                <h2 className="lab-header">Directive Queue</h2>
                <ul className="directive-list">
                    {pendingDirectives.map(d => (
                        <DirectiveListItem 
                            key={d.id} 
                            directive={d}
                            isSelected={selectedDirectiveId === d.id}
                            onClick={() => setSelectedDirectiveId(d.id)}
                        />
                    ))}
                </ul>
            </div>
            {selectedDirective ? (
                <ExecutionPlan directive={selectedDirective} agents={agents} onUpdateTask={onUpdateTask} />
            ) : (
                <div className="execution-plan-placeholder">
                    <p>Select a directive to view its execution plan.</p>
                </div>
            )}
        </div>
    );
};
