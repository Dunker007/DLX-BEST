import React, { useState, useMemo } from 'react';
import { Directive, MindMapNode, ChronicleLogType } from '../../types';
import { MindMapLab } from './MindMapLab';
import { AICommsPanel } from './AICommsPanel';

export const StrategyCommandLab = React.memo((props: { nodes: MindMapNode[]; setNodes: React.Dispatch<React.SetStateAction<MindMapNode[]>>; addDirective: (data: Omit<Directive, 'id' | 'status' | 'deploymentStatus'>, nodeId: string) => void; logEvent: (type: ChronicleLogType, message: string) => void; }) => {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const selectedNode = useMemo(() => props.nodes.find(n => n.id === selectedNodeId), [props.nodes, selectedNodeId]);

    return (
        <div className="lab-container strategy-command-lab">
            <MindMapLab
                addDirective={props.addDirective}
                nodes={props.nodes}
                setNodes={props.setNodes}
                logEvent={props.logEvent}
                selectedNodeId={selectedNodeId}
                onSetSelectedNodeId={setSelectedNodeId}
            />
            {selectedNode && selectedNode.aiService && (
                <AICommsPanel 
                    node={selectedNode}
                    logEvent={props.logEvent}
                    onClose={() => setSelectedNodeId(null)}
                />
            )}
        </div>
    );
});