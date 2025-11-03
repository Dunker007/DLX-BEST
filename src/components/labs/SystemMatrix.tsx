import React, { useState, useEffect } from 'react';
import { Directive, DirectiveStatus, DirectivePriority } from '../../types';

const DirectiveRow = React.memo(({ directive, isExpanded, onExpand, onStatusToggle, onPriorityChange, onSave, onEscalate, onDeploy }: { directive: Directive; isExpanded: boolean; onExpand: () => void; onStatusToggle: (newStatus: DirectiveStatus) => void; onPriorityChange: (p: DirectivePriority) => void; onSave: (desc: string) => void; onEscalate: () => void; onDeploy: (e: React.MouseEvent) => void; }) => {
    const [editingDescription, setEditingDescription] = useState(directive.description);
    useEffect(() => { setEditingDescription(directive.description); }, [directive.description, isExpanded]);
    const handleSaveClick = (e: React.MouseEvent) => { e.stopPropagation(); onSave(editingDescription); };
    const handleEscalateClick = (e: React.MouseEvent) => { e.stopPropagation(); onEscalate(); };
    const handleStatusClick = (e: React.MouseEvent) => { e.stopPropagation(); onStatusToggle(directive.status === 'pending' ? DirectiveStatus.Completed : DirectiveStatus.Pending); }
    return (
        <>
            <tr className="directive-row" onClick={onExpand}>
                <td style={{ textAlign: 'center' }}><span className={`status-indicator status-${directive.status}`} onClick={handleStatusClick} title={`Mark as ${directive.status === 'pending' ? 'completed' : 'pending'}`}></span></td>
                <td><span className={`category-badge category-${directive.category}`}>{directive.category}</span></td>
                <td><select className={`priority-select priority-${directive.priority.toLowerCase()}`} value={directive.priority} onClick={(e) => e.stopPropagation()} onChange={(e) => onPriorityChange(e.target.value as DirectivePriority)}><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></td>
                <td className={`directive-title ${directive.status === 'completed' ? 'completed' : ''}`}>{directive.title}{directive.apiKeyRequired && <span className="api-required-indicator" title="API Key Required">⚡</span>}</td>
                <td className={`directive-description ${directive.status === 'completed' ? 'completed' : ''}`}>{directive.description}</td>
            </tr>
            {isExpanded && (<tr className="expanded-row"><td colSpan={5}><div className="description-box"><h4>Revise Directive Description</h4><textarea value={editingDescription} onChange={(e) => setEditingDescription(e.target.value)} onClick={(e) => e.stopPropagation()} /><div className="description-box-actions">{directive.deployable && <button className="deploy-button" onClick={onDeploy} disabled={directive.deploymentStatus !== 'none'}> {directive.deploymentStatus === 'none' ? 'Deploy' : `Status: ${directive.deploymentStatus.replace('_', ' ')}`} </button>}<button onClick={handleSaveClick}>Save Changes</button><button onClick={(e) => { e.stopPropagation(); onExpand(); }}>Cancel</button><button className="escalate-button" onClick={handleEscalateClick}>Escalate to High</button></div></div></td></tr>)}
        </>
    );
});

export const SystemMatrix = React.memo(({ directives, onUpdate, onDeploy }: { directives: Directive[], onUpdate: (update: Partial<Directive> & { id: string }) => void, onDeploy: (id: string) => void }) => {
    const [expandedDirectiveId, setExpandedDirectiveId] = useState<string | null>(null);
    if (directives.length === 0) return <div className="system-matrix"><h2 className="lab-header">System Matrix</h2><p>All directives completed. Awaiting new objectives.</p></div>;
    return (
        <div className="system-matrix">
            <h2 className="lab-header">System Matrix</h2>
            <div className="matrix-table-container">
                <table className="matrix-table">
                    <colgroup><col style={{ width: '8%' }} /><col style={{ width: '12%' }} /><col style={{ width: '12%' }} /><col style={{ width: '28%' }} /><col style={{ width: '40%' }} /></colgroup>
                    <thead><tr><th>Status</th><th>Category</th><th>Priority</th><th>Directive</th><th>Description</th></tr></thead>
                    <tbody>
                        {directives.map(d => (
                            <DirectiveRow key={d.id} directive={d} isExpanded={expandedDirectiveId === d.id}
                                onExpand={() => setExpandedDirectiveId(id => id === d.id ? null : d.id)}
                                onStatusToggle={(newStatus) => onUpdate({ id: d.id, status: newStatus })}
                                onPriorityChange={(p) => onUpdate({ id: d.id, priority: p })}
                                onSave={(desc) => { onUpdate({ id: d.id, description: desc }); setExpandedDirectiveId(null); }}
                                onEscalate={() => { onUpdate({ id: d.id, priority: DirectivePriority.High }); setExpandedDirectiveId(null); }}
                                onDeploy={(e) => { e.stopPropagation(); onDeploy(d.id); }}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});
