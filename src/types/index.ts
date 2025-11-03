export enum LabId { Hub = 'hub', AuraLive = 'aura_live', Bytebot = 'bytebot', Strategy = 'strategy', Orchestrator = 'orchestrator', Deployment = 'deployment', Monitoring = 'monitoring', Crypto = 'crypto', KnowledgeBase = 'kb', Chronicle = 'chronicle', Desktop = 'desktop' };
export enum DirectiveCategory { Priority = 'priority', Standard = 'standard', Visionary = 'visionary' };
export enum DirectivePriority { High = 'High', Medium = 'Medium', Low = 'Low' };
export enum DirectiveStatus { Pending = 'pending', Completed = 'completed' };
export enum DeploymentStatus { None = 'none', InProgress = 'in_progress', InReview = 'in_review', Deployed = 'deployed' };
export enum AgentStatus { Idle = 'Idle', Executing = 'Executing', Training = 'Training', Error = 'Error', SystemGuardian = 'SystemGuardian' };
export enum ChronicleLogType { SYSTEM = 'SYSTEM', DIRECTIVE = 'DIRECTIVE', AGENT = 'AGENT', ANOMALY = 'ANOMALY' };
export enum WidgetId { PriorityDirective = 'priority_directive', SystemHealth = 'system_health', AgentStatus = 'agent_status', DirectivesOverview = 'directives_overview', AgentBriefing = 'agent_briefing', SystemArchitecture = 'system_architecture', ComplianceAlerts = 'compliance_alerts', APIStatus = 'api_status' };
export type AIService = 'gemini' | 'grok' | 'copilot';

export interface DirectiveTask {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedAgentId?: string;
}
export interface Lab { id: LabId; name: string; icon: string; }
export interface Directive { id: string; title: string; description: string; category: DirectiveCategory; priority: DirectivePriority; status: DirectiveStatus; apiKeyRequired?: boolean; deployable?: boolean; deploymentStatus?: DeploymentStatus; tasks?: DirectiveTask[]; }
export interface Agent { id: string; name: string; objective: string; status: AgentStatus; currentTaskDirectiveId?: string; taskQueue: string[]; }
export interface KnowledgeFile { id: string; name: string; type: 'DOC' | 'PDF' | 'SHEET' | 'SLIDE'; embeddingStatus?: 'Pending' | 'Embedding...' | 'Indexed'; }
export interface TranscriptLine { speaker: 'user' | 'aura'; text: string; isPartial?: boolean; }
export interface MindMapNode { id: string; label: string; parentId: string | null; position: { x: number; y: number }; isPromoted?: boolean; directiveId?: string; aiService?: AIService; }
export interface CodeReviewItem { id: string; title: string; author: string; status: 'Open' | 'Merged' | 'Closed'; directiveId?: string; }
export interface ChronicleLog { timestamp: string; type: ChronicleLogType; message: string; }
export interface Widget { id: WidgetId; name: string; description: string; default: boolean; }
export interface ComplianceAlert { id: string; location: string; issue: string; timestamp: string; }