import { Directive } from '../types';

export type DirectiveAction =
    | { type: 'SET', payload: Directive[] }
    | { type: 'ADD', payload: Directive }
    | { type: 'UPDATE', payload: Partial<Directive> & { id: string } };

export function directivesReducer(state: Directive[], action: DirectiveAction): Directive[] {
    switch (action.type) {
        case 'SET': return action.payload;
        case 'ADD': return [action.payload, ...state];
        case 'UPDATE': return state.map(d => d.id === action.payload.id ? { ...d, ...action.payload } : d);
        default: return state;
    }
}
