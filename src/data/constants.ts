import { Lab, LabId, Widget, WidgetId } from '../types';

export const ICONS: { [key: string]: string } = {
  hub: "M12 9.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5 2.5z m0 8.5c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z m0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z",
  aura_live: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M12 6c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
  bytebot: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.5 15.5H7c-.28 0-.5-.22-.5-.5v-2c0-.28.22-.5.5-.5h1.5c.28 0 .5.22.5.5v2c0 .28-.22.5-.5.5zm5.5 0h-1.5c-.28 0-.5-.22-.5-.5v-2c0-.28.22-.5.5-.5H14c.28 0 .5.22.5.5v2c0 .28-.22.5-.5.5zm-2.5-5.5c-.83 0-1.5-.67-1.5-1.5S10.67 7 11.5 7s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
  desktop: "M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z",
  strategy: "M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zm0-15v4h12V5H9z",
  monitoring: "M16 10c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z m-4 6H4v-2h8c1.1 0 2 .9 2 2s-.9 2-2 2z m8-8h-6c-1.1 0-2 .9-2 2s.9 2 2 2h6V8z m0 6h-8c-1.1 0-2 .9-2 2s.9 2 2 2h8v-2z",
  orchestrator: "M13.89 8.7L12 10.59 10.11 8.7l-1.42 1.42L10.59 12l-1.9 1.89 1.42 1.42L12 13.41l1.89 1.9 1.42-1.42L13.41 12l1.9-1.89z M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
  deployment: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z M7 8h10v2H7z m0 4h10v2H7z",
  crypto: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.45 16.55L12 15.28l-1.45 1.27c-.81.71-2.11.23-2.11-.83V14h7v1.72c0 1.06-1.3 1.54-2.11.83z M18 12h-2v-.5c0-.83-.67-1.5-1.5-1.5S13 10.67 13 11.5V12H7v-1.5c0-2.48 2.02-4.5 4.5-4.5s4.5 2.02 4.5 4.5V12z",
  kb: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  chronicle: "M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zm0-10v2h14V7H7z",
};

export const initialLabs: Lab[] = [
  { id: LabId.Hub, name: 'Operator Hub', icon: ICONS.hub },
  { id: LabId.AuraLive, name: 'Aura Live', icon: ICONS.aura_live },
  { id: LabId.Bytebot, name: 'Bytebot Ops', icon: ICONS.bytebot },
  { id: LabId.Desktop, name: 'Desktop', icon: ICONS.desktop },
  { id: LabId.Strategy, name: 'Strategy Command', icon: ICONS.strategy },
  { id: LabId.Orchestrator, name: 'Orchestrator', icon: ICONS.orchestrator },
  { id: LabId.Deployment, name: 'Deployment', icon: ICONS.deployment },
  { id: LabId.Monitoring, name: 'Monitoring', icon: ICONS.monitoring },
  { id: LabId.Chronicle, name: 'The Chronicle', icon: ICONS.chronicle },
  { id: LabId.Crypto, name: 'Crypto Lab', icon: ICONS.crypto },
  { id: LabId.KnowledgeBase, name: 'Knowledge Base', icon: ICONS.kb },
];

export const HUB_WIDGETS: Widget[] = [
    { id: WidgetId.PriorityDirective, name: 'Priority Directive', description: 'Displays the most urgent pending directive.', default: true },
    { id: WidgetId.SystemHealth, name: 'System Health', description: 'Shows real-time system stability metrics.', default: true },
    { id: WidgetId.AgentStatus, name: 'Agent Status', description: 'Overview of idle and executing agents.', default: true },
    { id: WidgetId.DirectivesOverview, name: 'Directives Overview', description: 'A summary of pending and completed directives.', default: true },
    { id: WidgetId.ComplianceAlerts, name: 'Compliance Monitor', description: 'Displays active compliance alerts from the Grok-1 agent.', default: true },
    { id: WidgetId.AgentBriefing, name: 'Agent Briefing', description: 'Contextual insights and suggestions from the Knowledge Agent.', default: true },
    { id: WidgetId.SystemArchitecture, name: 'System Architecture', description: 'Displays the current operational architecture of the command center.', default: false },
    { id: WidgetId.APIStatus, name: 'AI Service Status', description: 'Displays real-time connection status and latency for integrated AI services.', default: true },
];