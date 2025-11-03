import React from 'react';

export const Logo = React.memo(() => (
    <div className="logo-container">
        <svg viewBox="0 0 100 100" className="logo-svg">
            <defs><linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{ stopColor: 'var(--accent-cyan)', stopOpacity: 1 }} /><stop offset="100%" style={{ stopColor: 'var(--accent-magenta)', stopOpacity: 1 }} /></linearGradient></defs>
            <path d="M50 2 L90 25 L90 75 L50 98 L10 75 L10 25 Z" fill="none" stroke="url(#logoGradient)" strokeWidth="4" />
            <path d="M50 20 L72 32 L72 68 L50 80 L28 68 L28 32 Z" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" />
            <circle cx="50" cy="50" r="8" fill="var(--accent-magenta)" />
        </svg>
    </div>
));
