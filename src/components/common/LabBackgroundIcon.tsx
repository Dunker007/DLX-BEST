import React from 'react';

export const LabBackgroundIcon = React.memo(({ iconPath }: { iconPath: string }) => (
    <div className="lab-background-icon"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path d={iconPath} fill="currentColor" /></svg></div>
));
