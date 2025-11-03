import React from 'react';

export const HubWidget = React.memo(({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string; }) => (
    <div className={`hub-widget ${className}`}>
        <h3>{title}</h3>
        {children}
    </div>
));
