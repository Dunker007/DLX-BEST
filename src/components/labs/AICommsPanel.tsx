import React, { useState, useCallback, useEffect } from 'react';
import { MindMapNode, ChronicleLogType } from '../../types';

type AIResponse = {
    text: string;
    sources?: { uri: string; title: string }[];
};

export const AICommsPanel = React.memo(({ node, logEvent, onClose }: { node: MindMapNode; logEvent: (type: ChronicleLogType, message: string) => void; onClose: () => void; }) => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState<AIResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [useSearch, setUseSearch] = useState(false);

    const handleSend = useCallback(async () => {
        if (!prompt || !node.aiService) return;
        setIsLoading(true);
        setResponse(null);
        logEvent(ChronicleLogType.AGENT, `Query sent to ${node.aiService} via node "${node.label}": "${prompt}"`);

        try {
            const body: any = {};
            if (node.aiService === 'gemini') {
                body.contents = prompt;
                body.useSearch = useSearch;
            } else {
                body.prompt = prompt;
            }

            const res = await fetch(`/api/${node.aiService}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `Request failed with status ${res.status}`);
            }

            const result: AIResponse = await res.json();
            setResponse(result);
            logEvent(ChronicleLogType.AGENT, `Response received from ${node.aiService}.`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setResponse({ text: `Error: ${errorMessage}` });
            logEvent(ChronicleLogType.ANOMALY, `Error communicating with ${node.aiService}: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, node, logEvent, useSearch]);
    
    useEffect(() => {
      setPrompt('');
      setResponse(null);
      setUseSearch(false);
    }, [node]);

    return (
        <div className={`ai-comms-panel ai-service-${node.aiService}`}>
            <div className="comms-header">
                <h3>AI Comms: {node.label}</h3>
                <button className="close-comms-panel" onClick={onClose}>×</button>
            </div>
            <div className="comms-body">
                <div className="comms-response-area">
                    {isLoading && <div className="spinner"></div>}
                    {response && (
                        <>
                            <pre>{response.text}</pre>
                            {response.sources && response.sources.length > 0 && (
                                <div className="comms-sources">
                                    <h4>Sources:</h4>
                                    <ul>
                                        {response.sources.map((source, index) => (
                                            <li key={index}>
                                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="source-link">
                                                    {source.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                    {!isLoading && !response && <p className="placeholder-text">Awaiting prompt for {node.aiService}...</p>}
                </div>
                <div className="comms-input-area">
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={`Send a prompt to ${node.aiService}...`} disabled={isLoading} />
                    {node.aiService === 'gemini' && (
                        <div className="search-grounding-toggle">
                            <input
                                type="checkbox"
                                id="search-grounding"
                                checked={useSearch}
                                onChange={(e) => setUseSearch(e.target.checked)}
                                disabled={isLoading}
                            />
                            <label htmlFor="search-grounding">Ground with Google Search</label>
                        </div>
                    )}
                    <button onClick={handleSend} disabled={isLoading || !prompt}>Send</button>
                </div>
            </div>
        </div>
    );
});