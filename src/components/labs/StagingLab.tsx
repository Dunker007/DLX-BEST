import React, { useState, useEffect } from 'react';
import { Directive, DeploymentStatus } from '../../types';

export const StagingLab = React.memo(({ deployedDirective }: { deployedDirective: Directive | null }) => {
    const [logs, setLogs] = useState<string[]>([]);
    useEffect(() => {
        if (!deployedDirective) { setLogs([]); return; }
        const { deploymentStatus, title } = deployedDirective;
        const time = new Date().toLocaleTimeString();
        if (deploymentStatus === DeploymentStatus.InProgress || deploymentStatus === DeploymentStatus.InReview) {
            const newLogs = [`[${time}] Genesis Engine initiated for: ${title}`, `[${time}] Allocating resources...`, `[${time}] GUI Architect & Code Assembler agents engaged.`];
            if (deploymentStatus === DeploymentStatus.InReview) newLogs.push(`[${time}] Build complete. Awaiting operator approval in Code Review.`);
            setLogs(newLogs);
        } else if (deploymentStatus === DeploymentStatus.Deployed) {
            setLogs(prev => [...prev.slice(-5), `[${time}] Approval received. Starting deployment...`, `[${time}] Pushing to production environment...`, `[${time}] Deployment successful. Application is now live.`]);
        }
    }, [deployedDirective]);
    if (!deployedDirective) return <div className="lab-container"><h1 className="lab-header">Staging</h1><div className="staging-placeholder"><p>No project deployed.</p></div></div>
    return (
        <div className="lab-container staging-lab">
            <h1 className="lab-header">Staging: {deployedDirective.title}</h1>
            <div className="staging-content">
                <div className="staging-preview">
                    {deployedDirective.deploymentStatus === 'deployed' ? (<div className="mock-app"><header className="mock-app-header"><h2>{deployedDirective.title}</h2></header><div className="mock-app-body"><p>{deployedDirective.description}</p><div className="mock-ui-elements"><button>Engage</button><div className="mock-chart"></div></div></div></div>)
                    : (<div className="staging-placeholder"><p>Deployment Status: {deployedDirective.deploymentStatus.replace('_', ' ')}</p><div className="spinner"></div></div>)}
                </div>
                <div className="deployment-logs"><h3>Deployment Logs</h3><div className="logs-window">{logs.map((log, i) => <p key={i}>{log}</p>)}</div></div>
            </div>
        </div>
    );
});
