import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChronicleLogType } from '../../types';

type TerminalLog = {
    timestamp: string;
    content: string;
    type: 'command' | 'response' | 'error';
};

export const BytebotLab = React.memo(({ logEvent }: { logEvent: (type: ChronicleLogType, message: string) => void }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [logs, setLogs] = useState<TerminalLog[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);
    
    const addLog = (content: string, type: TerminalLog['type']) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { timestamp, content, type }]);
    };

    const handleDispatch = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskName || !taskDescription || isLoading) return;
        
        setIsLoading(true);
        const commandString = `curl -X POST http://luxrig:9991/tasks -d '{"name": "${taskName}", "description": "${taskDescription.substring(0, 30)}..."}'`;
        addLog(commandString, 'command');
        logEvent(ChronicleLogType.AGENT, `Dispatching task to Bytebot: ${taskName}`);

        try {
            const response = await fetch('/api/bytebot/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: taskName, description: taskDescription }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Request failed with status ${response.status}`);
            }

            addLog(`SUCCESS: ${JSON.stringify(result)}`, 'response');
            logEvent(ChronicleLogType.AGENT, `Bytebot task "${taskName}" dispatched successfully. Response: ${JSON.stringify(result)}`);
            setTaskName('');
            setTaskDescription('');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            addLog(`ERROR: ${errorMessage}`, 'error');
            logEvent(ChronicleLogType.ANOMALY, `Bytebot task dispatch failed: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [taskName, taskDescription, isLoading, logEvent]);

    return (
        <div className="lab-container bytebot-lab">
            <h1 className="lab-header">Bytebot Ops</h1>
            <div className="bytebot-content">
                <form className="task-composer" onSubmit={handleDispatch}>
                    <h3>Task Composer</h3>
                    <div className="form-group">
                        <label htmlFor="task-name">Task Name</label>
                        <input id="task-name" type="text" value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="e.g., Generate Report" disabled={isLoading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="task-desc">Description / Prompt</label>
                        <textarea id="task-desc" value={taskDescription} onChange={e => setTaskDescription(e.target.value)} placeholder="e.g., Generate a Q3 financial report for Project Pegasus." disabled={isLoading} />
                    </div>
                    <button type="submit" disabled={isLoading || !taskName || !taskDescription}>
                        {isLoading ? 'Dispatching...' : 'Dispatch Task'}
                    </button>
                </form>
                <div className="terminal-feed">
                    <h3>Terminal Feed</h3>
                    <div className="terminal-window">
                        {logs.map((log, index) => (
                            <div key={index} className={`terminal-line terminal-${log.type}`}>
                                <span className="terminal-timestamp">{log.timestamp}</span>
                                <span className="terminal-prompt">{log.type === 'command' ? '$' : '>'}</span>
                                <pre>{log.content}</pre>
                            </div>
                        ))}
                        <div ref={terminalEndRef} />
                    </div>
                </div>
            </div>
        </div>
    );
});