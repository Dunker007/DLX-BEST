import React from 'react';
import { ComplianceAlert } from '../../types';
import { HubWidget } from '../common/HubWidget';

export const ComplianceAlertsWidget = React.memo(({ alerts, onAcknowledge }: { alerts: ComplianceAlert[]; onAcknowledge: (id: string) => void; }) => (
    <HubWidget title="Grok-1 Compliance Monitor" className="compliance-alerts-widget">
        {alerts.length === 0 ? (
            <div className="no-alerts">
                <p className="status-ok">System Compliant</p>
                <span>No TOS or legal issues detected.</span>
            </div>
        ) : (
            <ul className="alert-list">
                {alerts.map(alert => (
                    <li key={alert.id} className="alert-item">
                        <div className="alert-details">
                            <strong>{alert.location}</strong>
                            <span>{alert.issue}</span>
                        </div>
                        <button onClick={() => onAcknowledge(alert.id)}>Acknowledge</button>
                    </li>
                ))}
            </ul>
        )}
    </HubWidget>
));
