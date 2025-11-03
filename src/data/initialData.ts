import { Directive, Agent, KnowledgeFile, MindMapNode, CodeReviewItem, DirectiveCategory, DirectivePriority, DirectiveStatus, DeploymentStatus, AgentStatus } from '../types';

export const initialSystemMatrixData: Directive[] = [
  { 
    id: 'genesis-engine', 
    title: 'The "Genesis Engine" Initiative', 
    description: 'Develop a workflow for an "Orchestrator Agent" to autonomously generate, review, and deploy projects to Staging based on a simple brief.', 
    category: DirectiveCategory.Visionary, 
    priority: DirectivePriority.High, 
    status: DirectiveStatus.Pending, 
    apiKeyRequired: true, 
    deployable: true, 
    deploymentStatus: DeploymentStatus.None,
    tasks: [
      { id: 'ge-1', name: 'Define Orchestrator Agent specs', status: 'pending' },
      { id: 'ge-2', name: 'Prototype agent communication protocol', status: 'pending' },
      { id: 'ge-3', name: 'Develop deployment script hooks', status: 'pending' },
    ]
  },
  { 
    id: 'agent-choreography', 
    title: '"Agent Choreography" Upgrade', 
    description: 'Implement an event-driven system for agents to perform complex, multi-step tasks autonomously, triggered by events from other labs.', 
    category: DirectiveCategory.Priority, 
    priority: DirectivePriority.High, 
    status: DirectiveStatus.Pending, 
    deploymentStatus: DeploymentStatus.None,
    tasks: [
      { id: 'ac-1', name: 'Design event schema for inter-lab communication', status: 'pending' },
      { id: 'ac-2', name: 'Implement pub/sub message bus', status: 'pending' },
      { id: 'ac-3', name: 'Test with 3+ agents performing a sequence', status: 'pending' },
    ]
  },
  { 
    id: 'living-chronicle', 
    title: '"The Living Chronicle" (Auto-Documentation)', 
    description: 'Create a new "Chronicle" lab for the system to auto-document its actions in real-time, creating a transparent, self-aware history.', 
    category: DirectiveCategory.Standard, 
    priority: DirectivePriority.Medium, 
    status: DirectiveStatus.Completed, 
    deploymentStatus: DeploymentStatus.None,
    tasks: [
      { id: 'lc-1', name: 'Create logging interface', status: 'completed' },
      { id: 'lc-2', name: 'Integrate logging hooks into all labs', status: 'completed' },
    ]
  },
  { 
    id: 'aura-live-voice', 
    title: 'Aura Live Voice Interface (Streaming Upgrade)', 
    description: 'Upgrade Aura to a low-latency, streaming voice experience using a Gemini Live API simulation for real-time, two-way conversational audio.', 
    category: DirectiveCategory.Priority, 
    priority: DirectivePriority.High, 
    status: DirectiveStatus.Completed, 
    apiKeyRequired: true, 
    deployable: true, 
    deploymentStatus: DeploymentStatus.None,
    tasks: [
        { id: 'al-1', name: 'Integrate Gemini Live API', status: 'completed' },
        { id: 'al-2', name: 'Build real-time transcription UI', status: 'completed' },
        { id: 'al-3', name: 'Optimize audio buffer handling', status: 'completed' },
    ]
  },
  { 
    id: 'self-healing', 
    title: 'Automated Self-Healing', 
    description: 'Empower the System Guardian to autonomously execute pre-defined routines to counteract and resolve predicted system anomalies before they occur.', 
    category: DirectiveCategory.Priority, 
    priority: DirectivePriority.High, 
    status: DirectiveStatus.Pending, 
    deploymentStatus: DeploymentStatus.None,
    tasks: [
        { id: 'sh-1', name: 'Develop anomaly detection model', status: 'pending' },
        { id: 'sh-2', name: 'Create library of self-healing scripts', status: 'pending' },
    ]
  },
  { 
    id: 'mindmap-ai-ideation', 
    title: 'Mind Map AI Ideation Upgrade', 
    description: 'Integrate Gemini into the Mind Map to automatically generate clusters of related sub-ideas from a selected node, accelerating creative planning.', 
    category: DirectiveCategory.Standard, 
    priority: DirectivePriority.Medium, 
    status: DirectiveStatus.Completed, 
    deploymentStatus: DeploymentStatus.None, 
    apiKeyRequired: true,
    tasks: [
        { id: 'mi-1', name: 'Connect Gemini API to Mind Map', status: 'completed' },
        { id: 'mi-2', name: 'Implement node generation logic', status: 'completed' },
    ]
  },
];

export const initialAgents: Agent[] = [
    { id: 'aura-main', name: 'Aura (Core)', objective: 'Primary operator interface for high-level command and control.', status: AgentStatus.Idle, taskQueue: [] },
    { id: 'sys-guardian', name: 'System Guardian', objective: 'Monitor system stability, predict anomalies, and manage agent performance.', status: AgentStatus.SystemGuardian, taskQueue: [] },
    { id: 'compliance-wizard', name: 'Compliance Wizard (Grok-1)', objective: 'Continuously scan Knowledge Base and Staging for TOS & legal compliance issues.', status: AgentStatus.Executing, taskQueue: [] },
    { id: 'knowledge-retrieval', name: 'Knowledge Agent', objective: 'Perform semantic searches on the Vector DB to provide context-aware information.', status: AgentStatus.Idle, taskQueue: [] },
    { id: 'crypto-analyst', name: 'Crypto Analyst', objective: 'Monitor and analyze real-time cryptocurrency market data for anomalies.', status: AgentStatus.Executing, taskQueue: [] },
    { id: 'gui-architect', name: 'GUI Architect', objective: 'Design and prototype React components based on specifications.', status: AgentStatus.Idle, taskQueue: [] },
    { id: 'code-assembler', name: 'Code Assembler', objective: 'Assemble and structure application code based on components.', status: AgentStatus.Idle, taskQueue: [] },
];

export const initialKnowledgeBaseFiles: KnowledgeFile[] = [
  { id: 'kb-1', name: 'ClientBrief_ProjectX.docx', type: 'DOC', embeddingStatus: 'Indexed' },
  { id: 'kb-2', name: 'MarketResearch_Q3.pdf', type: 'PDF', embeddingStatus: 'Indexed' },
  { id: 'kb-3', name: 'Financials_2024.xlsx', type: 'SHEET', embeddingStatus: 'Embedding...' },
  { id: 'kb-4', name: 'Project_Pegasus_proprietary.pdf', type: 'PDF', embeddingStatus: 'Indexed' },
];

export const initialMindMapNodes: MindMapNode[] = [
    { id: 'root', label: 'DLX Command Center', parentId: null, position: { x: 0, y: 0 } },
    { id: 'vision', label: 'Vision & Scope', parentId: 'root', position: { x: 200, y: -100 } },
    { id: 'architecture', label: 'System Architecture', parentId: 'root', position: { x: 200, y: 100 } },
    { id: 'mindmap-ai-ideation-node', label: 'Mind Map AI Ideation', parentId: 'vision', position: {x: 400, y: -150}, isPromoted: true, directiveId: 'mindmap-ai-ideation' },
    { id: 'comms', label: 'AI Communications', parentId: 'architecture', position: {x: 400, y: 100} },
    { id: 'bot-gemini', label: 'Query Gemini', parentId: 'comms', position: { x: 600, y: 0 }, aiService: 'gemini' },
    { id: 'bot-grok', label: 'Query Grok', parentId: 'comms', position: { x: 600, y: 100 }, aiService: 'grok' },
    { id: 'bot-copilot', label: 'Automate with Copilot', parentId: 'comms', position: { x: 600, y: 200 }, aiService: 'copilot' }
];

export const initialCodeReviewItems: CodeReviewItem[] = [ { id: 'pr-3', title: 'docs: Update knowledge base ingestion pipeline', author: 'Knowledge Agent', status: 'Merged' }, ];
export const initialCryptoData: {[key: string]: {price: number, change: number}} = { 'BTC': { price: 68450.21, change: 1.25 }, 'ETH': { price: 3550.75, change: -0.55 }, 'GLX': { price: 150.80, change: 5.89 }, };