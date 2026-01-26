export interface AgentContext {
  sessionId: string;
  agentId: string;
  retrievedContext?: RetrievalContext[];
  codeContext?: CodeContext;
  securityContext: SecurityContext;
}

export interface RetrievalContext {
  content: string;
  source: string;
  similarity: number;
  metadata: Record<string, any>;
}

export interface SecurityContext {
  apiKeyHash: string;
  rateLimitRemaining: number;
  permissions: string[];
  auditLogId: string;
}

export interface CodeContext {
  repository?: string;
  filePath?: string;
  language?: string;
  dependencies?: string[];
}

export interface DocumentChunk {
  content: string;
  source: string;
  type: 'code' | 'documentation' | 'conversation' | 'dependency';
  metadata?: Record<string, any>;
}
