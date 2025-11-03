import React, { useMemo } from 'react';
import { Agent, AgentStatus } from '../../types';
import { HubWidget } from '../common/HubWidget';

export const AgentStatusWidget = ({ agents }: { agents: Agent[] }) => {
    const idleCount = useMemo(() => agents.filter(a => a.status === AgentStatus.Idle).length, [agents]);
    const executingCount = useMemo(() => agents.filter(a => a.status === AgentStatus.Executing).length, [agents]);
    return <HubWidget title="Agent Status"><p>{idleCount} Agents Idle</p><p>{executingCount} Executing</p></HubWidget>;
};
