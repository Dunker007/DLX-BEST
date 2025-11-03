import React from 'react';
import { HubWidget } from '../common/HubWidget';

export const SystemArchitectureWidget = () => (
    <HubWidget title="System Architecture" className="system-architecture-widget">
        <p className="arch-type">Client-Side (DV-First)</p>
        <p className="arch-status">Backend ('luxrig'): <span className="status-ok">Not Required</span></p>
    </HubWidget>
);
