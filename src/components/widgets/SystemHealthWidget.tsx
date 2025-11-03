import React from 'react';
import { HubWidget } from '../common/HubWidget';

export const SystemHealthWidget = ({ systemHealth }: { systemHealth: number }) => (
    <HubWidget title="System Health">
        <p>Stability: {systemHealth.toFixed(1)}%</p>
        <div className="health-bar"><div style={{ width: `${systemHealth}%` }}></div></div>
    </HubWidget>
);
