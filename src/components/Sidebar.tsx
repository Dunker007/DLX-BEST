import React from 'react';
import { LabId } from '../types';
import { initialLabs } from '../data/constants';
import { Logo } from './common/Logo';

interface SidebarProps {
    activeLab: LabId;
    onLabChange: (labId: LabId) => void;
}

export const Sidebar = React.memo(({ activeLab, onLabChange }: SidebarProps) => (
    <nav className="sidebar">
        <Logo />
        <div className="api-toggle active" title="System Link: Active">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.68l-3.53-3.53a.75.75 0 00-1.06 1.06L17.31 3.2a8.25 8.25 0 00-13.09 9.85l-1.43 2.48a.75.75 0 101.3  .75l1.43-2.48A8.25 8.25 0 0020.84 4.68zM12 18a6.75 6.75 0 110-13.5 6.75 6.75 0 010 13.5z" /></svg>
        </div>
        <ul>
            {initialLabs.map(lab => (
                <li key={lab.id} className={activeLab === lab.id ? 'active' : ''} onClick={() => onLabChange(lab.id)}>
                    <svg viewBox="0 0 24 24"><path d={lab.icon} /></svg>
                    <span>{lab.name}</span>
                </li>
            ))}
        </ul>
        <div className="sidebar-footer">
            <p>DeAI CREATOR ECOSYSTEM</p>
            <p>DV-FIRST ARCHITECTURE</p>
        </div>
    </nav>
));