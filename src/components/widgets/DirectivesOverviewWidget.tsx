import React, { useMemo } from 'react';
import { Directive } from '../../types';
import { HubWidget } from '../common/HubWidget';

export const DirectivesOverviewWidget = ({ directives }: { directives: Directive[] }) => {
    const pendingCount = useMemo(() => directives.filter(d => d.status === 'pending').length, [directives]);
    const completedCount = useMemo(() => directives.filter(d => d.status === 'completed').length, [directives]);
    return <HubWidget title="Directives Overview"><p>{pendingCount} Pending</p><p>{completedCount} Completed</p></HubWidget>;
};
