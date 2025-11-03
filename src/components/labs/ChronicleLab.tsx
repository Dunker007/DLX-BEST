import React, { useEffect, useRef } from 'react';
import { ChronicleLog } from '../../types';

export const ChronicleLab = React.memo(({ logs }: { logs: ChronicleLog[] }) => {
    const logsEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);
    return (
        <div className="lab-container chronicle-lab"><h1 className="lab-header">The Living Chronicle</h1><div className="chronicle-log-list">{logs.map((log, index) => (<div key={index} className="chronicle-log-item"><span className="log-timestamp">{log.timestamp}</span><span className={`log-type-badge log-type-${log.type.toLowerCase()}`}>{log.type}</span><span className="log-message">{log.message}</span></div>))}<div ref={logsEndRef} /></div></div>
    );
});
