import { Agent, AgentStatus } from '../types';

export type AgentAction =
    | { type: 'SET', payload: Agent[] }
    | { type: 'UPDATE_STATUS', payload: { agentId: string; status: AgentStatus; taskId?: string } }
    | { type: 'ADD_TO_QUEUE', payload: { agentId: string; taskId: string } }
    | { type: 'PROCESS_QUEUE', payload: { agentId: string } };

export function agentsReducer(state: Agent[], action: AgentAction): Agent[] {
     switch (action.type) {
        case 'SET': return action.payload;
        case 'ADD_TO_QUEUE':
            return state.map(a => a.id === action.payload.agentId ? { ...a, taskQueue: [...a.taskQueue, action.payload.taskId] } : a);
        case 'UPDATE_STATUS':
             return state.map(a => a.id === action.payload.agentId ? { ...a, status: action.payload.status, currentTaskDirectiveId: action.payload.taskId } : a);
        case 'PROCESS_QUEUE': {
            const agent = state.find(a => a.id === action.payload.agentId);
            if (!agent || agent.taskQueue.length === 0) {
                 return state.map(a => a.id === action.payload.agentId ? { ...a, status: AgentStatus.Idle, currentTaskDirectiveId: undefined } : a);
            }
            const [nextTaskId, ...remainingQueue] = agent.taskQueue;
            return state.map(a => a.id === action.payload.agentId ? { ...a, status: AgentStatus.Executing, currentTaskDirectiveId: nextTaskId, taskQueue: remainingQueue } : a);
        }
        default: return state;
    }
}
