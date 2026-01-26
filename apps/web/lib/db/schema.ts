import { pgTable, text, timestamp, uuid, decimal, jsonb, boolean, integer, primaryKey } from 'drizzle-orm/pg-core';

// --- Core Tenants & Users (Multi-tenancy) ---
export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id),
  email: text('email').unique().notNull(),
  role: text('role').default('member'), // admin, manager, member
  createdAt: timestamp('created_at').defaultNow(),
});

// --- Construction Domain Models ---

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id),
  name: text('name').notNull(),
  code: text('code').unique(), // PROJ-001
  status: text('status').default('planning'), // planning, active, completed
  budget: decimal('budget', { precision: 12, scale: 2 }),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  metadata: jsonb('metadata'), // flexible storage for extra fields
  createdAt: timestamp('created_at').defaultNow(),
});

export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id),
  name: text('name').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(), // invoice, contract, plan
  vectorId: text('vector_id'), // Link to Pinecone
  extractedData: jsonb('extracted_data'), // Cache the AI analysis result
  createdAt: timestamp('created_at').defaultNow(),
});

export const changeOrders = pgTable('change_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id),
  description: text('description').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  priority: text('priority').default('medium'),
  status: text('status').default('open'), // open, approved, rejected
  detectedFrom: text('detected_from'), // store source (email, chat)
  createdAt: timestamp('created_at').defaultNow(),
});

// --- Agent Memory & Learnings ---

export const agentSessions = pgTable('agent_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  projectId: uuid('project_id').references(() => projects.id),
  agentName: text('agent_name').notNull(), // CostForecaster, etc.
  title: text('title'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const agentMessages = pgTable('agent_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').references(() => agentSessions.id),
  role: text('role').notNull(), // user, assistant, system
  content: text('content').notNull(),
  toolCalls: jsonb('tool_calls'), // Store what tools were used
  createdAt: timestamp('created_at').defaultNow(),
});

export const risks = pgTable('risks', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category'), // safety, financial, schedule
  severity: text('severity').default('medium'),
  status: text('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

// --- PhnxAura Security & RAG Models (New Addition) ---

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  timestamp: timestamp('timestamp').defaultNow(),
  agentId: text('agent_id').notNull(),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  outcome: text('outcome').notNull(),
  ipHash: text('ip_hash').notNull(),
  userAgent: text('user_agent').notNull(),
  metadata: jsonb('metadata'),
  riskScore: integer('risk_score').default(0),
});

export const knowledgeBase = pgTable('knowledge_base', {
  id: uuid('id').defaultRandom().primaryKey(),
  namespace: text('namespace').notNull(),
  source: text('source').notNull(),
  contentHash: text('content_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Renamed to avoid conflict with existing agentSessions
export const phnxAgentSessions = pgTable('phnx_agent_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  apiKeyHash: text('api_key_hash').notNull(),
  startTime: timestamp('start_time').defaultNow(),
  endTime: timestamp('end_time'),
  totalRequests: integer('total_requests').default(0),
  costIncurred: decimal('cost_incurred', { precision: 12, scale: 4 }).default('0'),
  status: text('status').default('ACTIVE'), // ACTIVE, COMPLETED, EXPIRED
});
