import React, { useState, useEffect } from 'react';
import { HubWidget } from '../common/HubWidget';

export const MonitoringLab = React.memo(() => {
    const [cpu, setCpu] = useState([65, 59, 80, 81, 56, 55, 40]);
    useEffect(() => { const i = setInterval(() => setCpu(p => [...p.slice(1), Math.max(0, Math.min(100, p[p.length - 1] + (Math.random() - 0.5) * 10))]), 1500); return () => clearInterval(i); }, []);
    const LineChart = ({ data, color }: { data: number[], color: string }) => <svg viewBox="0 0 400 100" className="chart-svg"><polyline fill="none" stroke={color} strokeWidth="3" points={data.map((p, i) => `${i * (400 / (data.length - 1))},${100 - p}`).join(' ')} /></svg>;
    return (
        <div className="lab-container monitoring-lab"><h1 className="lab-header">System Monitoring</h1><div className="monitoring-grid"><HubWidget title="CPU Utilization (%)"><LineChart data={cpu} color="var(--accent-cyan)" /></HubWidget><HubWidget title="Memory Usage (%)"><LineChart data={cpu.map(d => 100 - d)} color="var(--accent-magenta)" /></HubWidget><HubWidget title="Network I/O (MB/s)"><p className="large-metric">{(Math.random() * 100).toFixed(2)}</p></HubWidget><HubWidget title="Agent Threads"><p className="large-metric">8 / 16</p></HubWidget></div></div>
    );
});
