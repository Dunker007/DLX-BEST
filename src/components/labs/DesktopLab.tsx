import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChronicleLogType } from '../../types';

interface DesktopElement {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
}

interface DesktopState {
    screenshot: string; // base64 encoded image
    elements: DesktopElement[];
    width: number;
    height: number;
}

export const DesktopLab = ({ logEvent }: { logEvent: (type: ChronicleLogType, message: string) => void }) => {
    const [desktopState, setDesktopState] = useState<DesktopState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [textToType, setTextToType] = useState('');
    const screenshotRef = useRef<HTMLImageElement>(null);

    const fetchDesktopState = useCallback(async () => {
        try {
            const response = await fetch('/api/bytebot/desktop');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch desktop state: ${response.statusText}`);
            }
            const data = await response.json();
            setDesktopState(data);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to connect to Bytebot Desktop: ${errorMessage}`);
            logEvent(ChronicleLogType.ANOMALY, `Bytebot Desktop connection failed: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [logEvent]);

    useEffect(() => {
        fetchDesktopState();
        const interval = setInterval(fetchDesktopState, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [fetchDesktopState]);

    const handleMouseClick = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
        if (!screenshotRef.current || !desktopState) return;

        const rect = screenshotRef.current.getBoundingClientRect();
        const nativeWidth = desktopState.width;
        const nativeHeight = desktopState.height;

        const scaleX = nativeWidth / rect.width;
        const scaleY = nativeHeight / rect.height;

        const x = Math.round((e.clientX - rect.left) * scaleX);
        const y = Math.round((e.clientY - rect.top) * scaleY);

        logEvent(ChronicleLogType.AGENT, `Bytebot Desktop: Clicking at (${x}, ${y})`);
        try {
            await fetch('/api/bytebot/desktop/mouse/click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ x, y, button: 'left' }),
            });
            // Refresh state immediately after interaction
            setTimeout(fetchDesktopState, 500);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            logEvent(ChronicleLogType.ANOMALY, `Bytebot Desktop click failed: ${errorMessage}`);
        }
    }, [desktopState, logEvent, fetchDesktopState]);
    
    const handleType = async () => {
        if (!textToType) return;
        logEvent(ChronicleLogType.AGENT, `Bytebot Desktop: Typing "${textToType}"`);
        try {
            await fetch('/api/bytebot/desktop/keyboard/type', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToType }),
            });
            setTextToType('');
            // Refresh state immediately after interaction
            setTimeout(fetchDesktopState, 500);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            logEvent(ChronicleLogType.ANOMALY, `Bytebot Desktop type failed: ${errorMessage}`);
        }
    };
    
    const handleElementClick = (element: DesktopElement) => {
        if (!desktopState) return;
        const x = Math.round(element.x + element.width / 2);
        const y = Math.round(element.y + element.height / 2);
        
        logEvent(ChronicleLogType.AGENT, `Bytebot Desktop: Clicking element "${element.text}" at (${x}, ${y})`);
        try {
            fetch('/api/bytebot/desktop/mouse/click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ x, y, button: 'left' }),
            });
            setTimeout(fetchDesktopState, 500);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            logEvent(ChronicleLogType.ANOMALY, `Bytebot Desktop element click failed: ${errorMessage}`);
        }
    }

    return (
        <div className="lab-container desktop-lab">
            <div className="desktop-main-view">
                <h1 className="lab-header">Bytebot Desktop Environment</h1>
                <div className="desktop-viewer">
                    {isLoading && <div className="spinner"></div>}
                    {error && <div className="desktop-viewer-placeholder"><p className="terminal-error">{error}</p></div>}
                    {!isLoading && !error && desktopState && (
                        <div className="desktop-screenshot-container" onClick={handleMouseClick}>
                            <img
                                ref={screenshotRef}
                                src={`data:image/png;base64,${desktopState.screenshot}`}
                                alt="Bytebot Desktop"
                                className="desktop-screenshot"
                            />
                            {desktopState.elements.map((el, i) => (
                                <div
                                    key={i}
                                    className="desktop-element-overlay"
                                    style={{
                                        left: `${(el.x / desktopState.width) * 100}%`,
                                        top: `${(el.y / desktopState.height) * 100}%`,
                                        width: `${(el.width / desktopState.width) * 100}%`,
                                        height: `${(el.height / desktopState.height) * 100}%`,
                                    }}
                                    title={el.text}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleElementClick(el);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="desktop-sidebar">
                <div className="desktop-controls">
                    <h3>Direct Control</h3>
                     <div className="form-group">
                        <label htmlFor="type-text">Type Text</label>
                        <input
                            id="type-text"
                            type="text"
                            value={textToType}
                            onChange={(e) => setTextToType(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleType()}
                            placeholder="Enter text to type..."
                        />
                    </div>
                    <button onClick={handleType} disabled={!textToType}>Type</button>
                </div>
                <div className="desktop-status">
                    <h3>Desktop Status</h3>
                    <div className="status-line"><strong>Status:</strong> <span>{error ? 'Offline' : 'Online'}</span></div>
                    <div className="status-line"><strong>Resolution:</strong> <span>{desktopState ? `${desktopState.width}x${desktopState.height}` : 'N/A'}</span></div>
                    <div className="status-line"><strong>Elements Found:</strong> <span>{desktopState?.elements?.length ?? 'N/A'}</span></div>
                </div>
            </div>
        </div>
    );
};
