import React, { useState, useCallback } from 'react';
import { Logo } from './common/Logo';

export const LandingPage = React.memo(({ onAccessGranted }: { onAccessGranted: () => void }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = useCallback(async () => {
        setIsLoading(true);
        setError('');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                onAccessGranted();
            } else {
                setError('ACCESS DENIED');
                setPassword('');
            }
        } catch (err) {
            if ((err as Error).name === 'AbortError') {
                setError('Authentication service timed out. Is the backend proxy running?');
            } else {
                setError('Connection to authentication service failed.');
            }
        } finally {
            clearTimeout(timeoutId);
            setIsLoading(false);
        }
    }, [password, onAccessGranted]);

    return (
        <div className="landing-container">
            <div className="landing-content">
                <Logo />
                <h1>DLX COMMAND CENTER</h1>
                <h2>LUX 2.0 // TURBO HUD</h2>
                <div className="password-form">
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()} 
                        placeholder="ENTER ACCESS KEY" 
                        disabled={isLoading}
                    />
                    <button onClick={handleLogin} disabled={isLoading}>
                        {isLoading ? '...' : '>'}
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
});
