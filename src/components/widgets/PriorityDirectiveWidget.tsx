import React, { useMemo } from 'react';
import { Directive } from '../../types';
import { HubWidget } from '../common/HubWidget';

export const PriorityDirectiveWidget = ({ directives }: { directives: Directive[] }) => {
    const priorityTitle = useMemo(() => directives.find(d => d.priority === 'High' && d.status === 'pending')?.title || 'No active priority.', [directives]);
    return <HubWidget title="Priority Directive"><p>{priorityTitle}</p></HubWidget>;
};
