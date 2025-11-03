import React, { useState, useEffect } from 'react';
import { HubWidget } from '../common/HubWidget';
import { AIService } from '../../types';

interface ServiceStatus {
    name: string;
    status: 'Online' | 'Degraded' | 'Offline';
    latency: number;
}

const serviceMap: Record<AIService, string> = {
    gemini: 'Gemini',
    grok: 'Grok',
    copilot: 'Copilot'
};

const APIStatusWidget = () => {
    const [statuses, setStatuses] = useState<Record<AIService, ServiceStatus>>({
        gemini: { name: 'Gemini', status: 'Online', latency: 0 },
        grok: { name: 'Grok', status: 'Online', latency: 0 },
        copilot: { name: 'Copilot', status: 'Online', latency: 0 },
    });

    useEffect(() => {
        const pingServices = () => {
            const services: AIService[] = ['gemini', 'grok', 'copilot'];
            services.forEach(service => {
                const random = Math.random();
                let status: ServiceStatus['status'] = 'Online';
                let latency = Math.floor(Math.random() * (150 - 50 + 1) + 50); // 50-150ms

                if (random > 0.95) {
                    status = 'Offline';
                    latency = -1;
                } else if (random > 0.85) {
                    status = 'Degraded';
                    latency = Math.floor(Math.random() * (500 - 200 + 1) + 200); // 200-500ms
                }

                setStatuses(prev => ({
                    ...prev,
                    [service]: { name: serviceMap[service], status, latency }
                }));
            });
        };
        
        pingServices();
        const interval = setInterval(pingServices, 3000);

        return () => clearInterval(interval);
    }, []);
    
    const getStatusColor = (status: ServiceStatus['status']) => {
        if (status === 'Online') return 'var(--accent-green)';
        if (status === 'Degraded') return '#f39c12';
        return 'var(--accent-red)';
    };

    return (
        <HubWidget title="AI Service Status">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* FIX: Explicitly typed the 'service' parameter to resolve type inference issues with Object.values. */}
                {Object.values(statuses).map((service: ServiceStatus) => (
                    <li key={service.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{service.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <span style={{ color: getStatusColor(service.status), fontWeight: 'bold' }}>{service.status}</span>
                           <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', width: '50px', textAlign: 'right' }}>
                               {service.latency >= 0 ? `${service.latency}ms` : 'N/A'}
                           </span>
                        </div>
                    </li>
                ))}
            </ul>
        </HubWidget>
    );
};

export default APIStatusWidget;
