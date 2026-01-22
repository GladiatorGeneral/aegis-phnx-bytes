# Construction AI Agency - Project Roadmap

This project follows a staged sprint approach to build a scalable, hybrid AI architecture for the construction industry.

## Phase 0: Foundation & Setup (Sprint 0 - Weeks 1-2)
*Goal: Establish the core application, data pipeline, and single-tenant proof-of-concept.*

**🛠️ Core Infrastructure**
- [x] Set up Next.js project structure (in `apps/web`).
- [ ] Configure Vercel Postgres with RLS.
- [ ] Implement authentication (Auth.js/NextAuth).
- [x] Create base API route structure (`/api/construction-agent/`).
- [x] Set up external LLM API clients (OpenAI/DeepSeek configured via Vercel AI SDK).
- [x] Design and implement core database schemas: `projects`, `documents`, `agents_sessions`, `analysis_results`.

**🔧 Knowledge Base Pipeline (Simple RAG)**
- [ ] Build document ingestion service (Vercel Blob/Upload).
- [x] Implement text chunking/embedding logic (`lib/construction-agent/rag/`).
- [x] Set up vector search (Pinecone implemented).
- [x] Build simple retrieval function.

## Phase 1: Specialist Agent #1 - Cost Forecaster (Sprint 1-2 - Weeks 3-6)
*Goal: Deliver the first working agent that answers core cost questions.*

**🤖 Agent Programming & Logic**
- [x] **Implement `AgentRouter` class**: Classify and route user questions.
- [x] **Build `BaseAgent` abstract class**: Enforce Chain-of-Thought, retrieval, and execution patterns.
- [ ] **Develop `CostForecastingAgent`**:
    - [x] Core Logic: Parse question -> Retrieve financial data -> Calculate CV/SV/EAC -> EVM logic.
    - [ ] Prompt Engineering: "Senior cost controller" persona.
    - [ ] Output: Structured JSON with confidence and risks.

**🔗 Knowledge Base Enhancements**
- [ ] Create `CostKnowledgeConnector`: Index financial documents with metadata.
- [ ] Seed with sample construction financial data.

**🎯 Frontend & Integration**
- [ ] Build agent chat interface (Streaming UI).
- [ ] Create results dashboard.
- [ ] Implement session logging.

## Phase 2: Specialist Agent #2 - Schedule Analyst (Sprint 3-4 - Weeks 7-10)
*Goal: Add schedule analysis capability and basic risk expansion.*

- [ ] Develop `ScheduleAnalysisAgent` (Critical path, float, delay detection).
- [ ] Extend DB with `project_tasks`, `dependencies`, `risks`.
- [ ] Implement basic graph modeling in PostgreSQL.
- [ ] Build `GraphQueryService`.
- [ ] Evaluate migration to Qdrant/Milvus for hybrid search.

## Phase 3: Specialist Agent #3 - Resource & Risk Forecaster (Sprint 5-6 - Weeks 11-14)
*Goal: Add predictive resource modeling and full risk loop.*

- [ ] Develop `ResourceRiskAgent` (Resource leveling, Monte Carlo simulation).
- [ ] Implement Cross-Domain Risk Scanning.
- [ ] Graph Database Integration (Neo4j/NebulaGraph).
- [ ] Build `GraphRAGService`.

## Phase 4: Integration & Scale (Sprint 7-8 - Weeks 15-18+)
*Goal: Multi-agent orchestration and VAKG architecture.*

- [ ] Build `AgentOrchestrator`.
- [ ] Implement `RiskMatrixGenerator`.
- [ ] Implement `FeedbackProcessor` & Learning Loop.
- [ ] Prototype `VectorGraphHybridIndex` (VAKG).
