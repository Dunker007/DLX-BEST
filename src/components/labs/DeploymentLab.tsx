import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Directive, DeploymentStatus, CodeReviewItem } from '../../types';

export const DeploymentLab = React.memo(({ directivesForDeployment, codeReviewItems, onApprove }: { directivesForDeployment: Directive[], codeReviewItems: CodeReviewItem[], onApprove: (id: string, directiveId?: string) => void; }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const activeDirective = useMemo(() => {
        return directivesForDeployment.find(d => d.deploymentStatus === DeploymentStatus.InProgress || d.deploymentStatus === DeploymentStatus.InReview) || directivesForDeployment.find(d => d.deploymentStatus === DeploymentStatus.Deployed) || null;
    }, [directivesForDeployment]);
    
    const openReviews = useMemo(() => {
        if (!activeDirective) return [];
        return codeReviewItems.filter(r => r.directiveId === activeDirective.id && r.status === 'Open');
    }, [codeReviewItems, activeDirective]);

    useEffect(() => {
        if (!activeDirective) { 
            setLogs([]); 
            return; 
        }
        const { deploymentStatus, title } = activeDirective;
        const time = () => new Date().toLocaleTimeString();
        let newLogs: string[] = [];

        if (deploymentStatus === DeploymentStatus.InReview) {
            newLogs = [`[${time()}] Build complete for: ${title}`, `[${time()}] Awaiting operator approval...`];
        } else if (deploymentStatus === DeploymentStatus.InProgress) {
            newLogs = [...logs, `[${time()}] Approval received. Starting deployment...`, `[${time()}] Pushing to production environment...`];
        } else if (deploymentStatus === DeploymentStatus.Deployed) {
            newLogs = [...logs.slice(-5), `[${time()}] Deployment successful. Application is now live.`];
        }
        setLogs(newLogs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeDirective?.deploymentStatus, activeDirective?.id]);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="lab-container deployment-lab">
            <h1 className="lab-header">Deployment Terminal</h1>
            <div className="deployment-grid">
                <div className="deployment-panel">
                    <h3>Code Review & Approval</h3>
                    {activeDirective && openReviews.length > 0 ? (
                         <ul className="review-list">
                            {openReviews.map(item => (
                                <li key={item.id} className={`review-item status-${item.status.toLowerCase()}`}>
                                    <span className="review-status">{item.status}</span>
                                    <div>
                                        <div className="review-title">{item.title}</div>
                                        <div className="review-author">by {item.author}</div>
                                    </div>
                                    <button 
                                        className="approve-button" 
                                        onClick={() => onApprove(item.id, item.directiveId)}
                                        disabled={activeDirective.deploymentStatus !== DeploymentStatus.InReview}
                                    >
                                        Approve
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="deployment-placeholder">
                            <p>No items awaiting review.</p>
                        </div>
                    )}
                </div>
                <div className="deployment-panel">
                    <h3>Live Preview & Logs</h3>
                    {activeDirective ? (
                        <>
                            {activeDirective.deploymentStatus === 'deployed' ? (
                                <div className="mock-app">
                                    <header className="mock-app-header"><h2>{activeDirective.title}</h2></header>
                                    <div className="mock-app-body"><p>{activeDirective.description}</p><div className="mock-ui-elements"><button>Engage</button><div className="mock-chart"></div></div></div>
                                </div>
                            ) : (
                                <div className="deployment-placeholder">
                                    <p>Deployment Status: {activeDirective.deploymentStatus.replace('_', ' ')}</p>
                                    {activeDirective.deploymentStatus === 'in_progress' && <div className="spinner"></div>}
                                </div>
                            )}
                            <div className="logs-window" style={{ height: '150px', marginTop: '1rem' }}>
                                {logs.map((log, i) => <p key={i}>{log}</p>)}
                                <div ref={logsEndRef}/>
                            </div>
                        </>
                    ) : (
                        <div className="deployment-placeholder">
                            <p>No active deployment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});