import React, { useState, useCallback, useMemo } from 'react';
import { MindMapNode, Directive, DirectiveCategory, DirectivePriority, ChronicleLogType } from '../../types';
import { ICONS } from '../../data/constants';

const PromoteNodeModal = React.memo(({ node, onPromote, onClose }: { node: MindMapNode; onPromote: (data: Omit<Directive, 'id' | 'status' | 'deploymentStatus'>, nodeId: string) => void; onClose: () => void; }) => {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<DirectiveCategory>(DirectiveCategory.Standard);
    const [priority, setPriority] = useState<DirectivePriority>(DirectivePriority.Medium);
    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        onPromote({ title: node.label, description, category, priority, apiKeyRequired: false, deployable: true }, node.id);
        onClose();
    }, [node, description, category, priority, onPromote, onClose]);
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2>Promote Node to Directive</h2>
                    <div className="form-group"><label>Directive Title</label><input type="text" value={node.label} readOnly /></div>
                    <div className="form-group"><label htmlFor="description">Description</label><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
                    <div className="form-group-row">
                        <div className="form-group"><label htmlFor="category">Category</label><select id="category" value={category} onChange={(e) => setCategory(e.target.value as DirectiveCategory)}><option value="standard">Standard</option><option value="priority">Priority</option><option value="visionary">Visionary</option></select></div>
                        <div className="form-group"><label htmlFor="priority">Priority</label><select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as DirectivePriority)}><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div>
                    </div>
                    <div className="modal-actions"><button type="button" onClick={onClose}>Cancel</button><button type="submit">Create Directive</button></div>
                </form>
            </div>
        </div>
    );
});

export const MindMapLab = React.memo(({ addDirective, nodes, setNodes, logEvent, selectedNodeId, onSetSelectedNodeId }: { addDirective: (data: Omit<Directive, 'id' | 'status' | 'deploymentStatus'>, nodeId: string) => void; nodes: MindMapNode[]; setNodes: React.Dispatch<React.SetStateAction<MindMapNode[]>>; logEvent: (type: ChronicleLogType, message: string) => void; selectedNodeId: string | null; onSetSelectedNodeId: (nodeId: string | null) => void; }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
    
    const handleNodeClick = useCallback((nodeId: string) => {
        onSetSelectedNodeId(nodeId);
    }, [onSetSelectedNodeId]);

    const handleAiIdeation = useCallback(async () => {
        if (!selectedNodeId) { logEvent(ChronicleLogType.SYSTEM, 'AI Ideation failed: No node selected.'); return; }
        const parentNode = nodes.find(n => n.id === selectedNodeId);
        if (!parentNode) return;
        setIsGenerating(true);
        logEvent(ChronicleLogType.AGENT, `AI Ideation started for node: "${parentNode.label}"`);
        try {
            const prompt = `Brainstorm 5 brief, actionable sub-ideas related to: "${parentNode.label}". Respond with a JSON object with a single key "ideas" which is an array of strings.`;
            
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    contents: prompt,
                    config: { responseMimeType: "application/json" }
                }),
            });
            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            
            const result = await response.json();
            let ideas = [];
            try {
                const resultJson = JSON.parse(result.text);
                if (resultJson && Array.isArray(resultJson.ideas)) ideas = resultJson.ideas;
                else { console.error("AI Ideation Error: Invalid response structure", resultJson); logEvent(ChronicleLogType.ANOMALY, `AI Ideation failed: Received an invalid response from the AI.`); }
            } catch (parseError) { console.error("JSON Parsing Error:", parseError, "Raw text:", result.text); logEvent(ChronicleLogType.ANOMALY, `AI Ideation failed: Could not parse AI response.`); }
            
            if (ideas.length > 0) {
                const newNodes = ideas.map((idea: string, i: number) => ({ id: `node-${Date.now()}-${i}`, label: idea, parentId: selectedNodeId, position: { x: parentNode.position.x + 200 * Math.cos(2 * Math.PI * i / ideas.length), y: parentNode.position.y + 200 * Math.sin(2 * Math.PI * i / ideas.length) } }));
                setNodes(prev => [...prev, ...newNodes]);
                logEvent(ChronicleLogType.AGENT, `AI Ideation successful: Generated ${ideas.length} new nodes.`);
            }
        } catch (error) { console.error("AI Ideation Error:", error); logEvent(ChronicleLogType.ANOMALY, `AI Ideation failed: An error occurred during API call.`); }
        finally { setIsGenerating(false); }
    }, [selectedNodeId, nodes, setNodes, logEvent]);

    const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId), [nodes, selectedNodeId]);

    return (
        <>
            {isPromoteModalOpen && selectedNode && <PromoteNodeModal node={selectedNode} onPromote={addDirective} onClose={() => setIsPromoteModalOpen(false)} />}
            <div className="mindmap-lab">
                <div className="mindmap-controls-container">
                    <h2 className="lab-header">Mind Map</h2>
                    <p className="mindmap-helper-text">Select a node to interact with an AI, ideate, or promote to a directive.</p>
                    <div className="mindmap-controls">
                        <button onClick={handleAiIdeation} disabled={!selectedNodeId || isGenerating || selectedNode?.isPromoted}>{isGenerating ? 'Generating...' : 'AI Ideate'}</button>
                        <button onClick={() => setIsPromoteModalOpen(true)} disabled={!selectedNodeId || selectedNode?.isPromoted}>Promote to Directive</button>
                    </div>
                </div>
                <div className="mindmap-canvas">
                    <svg viewBox="-500 -300 1000 600">
                        {nodes.filter(n => n.parentId).map(n => { const p = nodes.find(pn => pn.id === n.parentId!); return p ? <line key={`link-${n.id}`} x1={p.position.x} y1={p.position.y} x2={n.position.x} y2={n.position.y} className="mindmap-link" /> : null; })}
                        {nodes.map(node => (
                            <g key={node.id} transform={`translate(${node.position.x}, ${node.position.y})`} onClick={() => handleNodeClick(node.id)} style={{ cursor: 'pointer' }}>
                                <rect x="-90" y="-25" width="180" height="50" rx="10" className={`mindmap-node ${node.id === selectedNodeId ? 'selected' : ''} ${node.isPromoted ? 'promoted' : ''} ${node.aiService ? 'ai-service-node' : ''}`} />
                                <text textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14" style={{ pointerEvents: 'none' }}>{node.label}</text>
                                {node.isPromoted && <g transform="translate(75, -20)"><svg x="-8" y="-8" width="16" height="16" viewBox="0 0 24 24"><path d={ICONS.star} /></svg></g>}
                            </g>
                        ))}
                    </svg>
                </div>
            </div>
        </>
    );
});