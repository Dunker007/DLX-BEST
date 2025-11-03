import React, { useState, useCallback, useMemo } from 'react';
import { Directive, Agent, LabId, CodeReviewItem, ComplianceAlert, WidgetId } from '../../types';
import { HUB_WIDGETS } from '../../data/constants';
import { PriorityDirectiveWidget } from '../widgets/PriorityDirectiveWidget';
import { SystemHealthWidget } from '../widgets/SystemHealthWidget';
import { AgentStatusWidget } from '../widgets/AgentStatusWidget';
import { DirectivesOverviewWidget } from '../widgets/DirectivesOverviewWidget';
import { AgentBriefingWidget } from '../widgets/AgentBriefingWidget';
import { SystemArchitectureWidget } from '../widgets/SystemArchitectureWidget';
import { ComplianceAlertsWidget } from '../widgets/ComplianceAlertsWidget';
import APIStatusWidget from '../widgets/APIStatusWidget';

const WidgetMarketplaceModal = React.memo(({ activeWidgets, onToggle, onClose }: { activeWidgets: Set<WidgetId>; onToggle: (id: WidgetId) => void; onClose: () => void; }) => (
    <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Widget Marketplace</h2>
            <p className="modal-subtitle">Customize your Operator Hub by selecting the widgets you want to display.</p>
            <div className="widget-list">
                {HUB_WIDGETS.map(widget => (
                    <div key={widget.id} className="widget-item">
                        <input type="checkbox" id={`widget-toggle-${widget.id}`} checked={activeWidgets.has(widget.id)} onChange={() => onToggle(widget.id)} />
                        <label htmlFor={`widget-toggle-${widget.id}`}><strong>{widget.name}</strong><span>{widget.description}</span></label>
                    </div>
                ))}
            </div>
            <div className="modal-actions"><button onClick={onClose}>Close</button></div>
        </div>
    </div>
));

export const OperatorHub = React.memo((props: { directives: Directive[], agents: Agent[], systemHealth: number, activeLab: LabId, codeReviewItems: CodeReviewItem[], complianceAlerts: ComplianceAlert[], onAcknowledgeAlert: (id: string) => void }) => {
    const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
    const [activeWidgets, setActiveWidgets] = useState<Set<WidgetId>>(() => new Set(HUB_WIDGETS.filter(w => w.default).map(w => w.id)));
    const toggleWidget = useCallback((id: WidgetId) => {
        setActiveWidgets(prev => { const newSet = new Set(prev); newSet.has(id) ? newSet.delete(id) : newSet.add(id); return newSet; });
    }, []);
    const widgetMap: Record<WidgetId, React.ReactNode> = useMemo(() => ({
        [WidgetId.PriorityDirective]: <PriorityDirectiveWidget directives={props.directives} />,
        [WidgetId.SystemHealth]: <SystemHealthWidget systemHealth={props.systemHealth} />,
        [WidgetId.AgentStatus]: <AgentStatusWidget agents={props.agents} />,
        [WidgetId.DirectivesOverview]: <DirectivesOverviewWidget directives={props.directives} />,
        [WidgetId.AgentBriefing]: <AgentBriefingWidget activeLab={props.activeLab} directives={props.directives} codeReviewItems={props.codeReviewItems} />,
        [WidgetId.SystemArchitecture]: <SystemArchitectureWidget />,
        [WidgetId.ComplianceAlerts]: <ComplianceAlertsWidget alerts={props.complianceAlerts} onAcknowledge={props.onAcknowledgeAlert} />,
        [WidgetId.APIStatus]: <APIStatusWidget />,
    }), [props.directives, props.agents, props.systemHealth, props.activeLab, props.codeReviewItems, props.complianceAlerts, props.onAcknowledgeAlert]);
    return (
        <>
            {isMarketplaceOpen && <WidgetMarketplaceModal activeWidgets={activeWidgets} onToggle={toggleWidget} onClose={() => setIsMarketplaceOpen(false)} />}
            <div className="lab-container operator-hub">
                <div className="lab-header-controls"><h1 className="lab-header">Operator Hub</h1><button className="customize-hub-button" onClick={() => setIsMarketplaceOpen(true)}>Customize Hub</button></div>
                <div className="hub-grid">{HUB_WIDGETS.filter(w => activeWidgets.has(w.id)).map(widget => <React.Fragment key={widget.id}>{widgetMap[widget.id]}</React.Fragment>)}</div>
            </div>
        </>
    );
});