import React, { useMemo } from 'react';
import { Agent, Directive } from '../../types';

export const AgentForgeLab = React.memo(({ agents, directives }: { agents: Agent[], directives: Directive[] }) => {
    const directiveMap = useMemo(() => new Map(directives.map(d => [d.id, d.title])), [directives]);
    return (
        <div className="lab-container agent-forge"><h1 className="lab-header">Agent Forge</h1><div className="matrix-table-container"><table className="matrix-table"><thead><tr><th>Agent Name</th><th>Status</th><th>Current Task</th><th>Queue</th><th>Objective</th></tr></thead><tbody>{agents.map(agent => (<tr key={agent.id}><td>{agent.name}</td><td><span className={`agent-status-badge status-${agent.status.toLowerCase()}`}>{agent.status}</span></td><td>{agent.currentTaskDirectiveId ? directiveMap.get(agent.currentTaskDirectiveId) || 'Unknown Task' : '—'}</td><td>{agent.taskQueue?.length || 0}</td><td>{agent.objective}</td></tr>))}</tbody></table></div></div>
    );
});
