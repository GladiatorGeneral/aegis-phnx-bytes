# Aegis Phoenix Bytes 🏗️🤖

**A generic, high-performance Construction AI Agency platform.**

Aegis Phoenix Bytes is a sophisticated AI-powered system designed to automate complex workflows in the construction industry. It leverages **Recursive Language Models (RLMs)**, **Model Context Protocol (MCP)**, and the **Vercel AI SDK** to provide deep analysis of contracts, financial forecasting, and regulatory monitoring.

## 🚀 Features

### 🧠 Core Intelligence
- **Recursive Contract Analysis (RLM)**: A specialized agent that decomposes 200+ page contracts into massive executable plans, identifying cross-document risks and financial liabilities.
- **Monte Carlo Profit Simulation**: Runs thousands of financial scenarios ("What if steel goes up 15%?") to forecast project viability.
- **RAG Knowledge Base**: Context-aware retrieval for past project data and regulations.

### 🛠️ Specialized Tools
- **Change Order Logger**: Automatically parses emails/chats to log structure change orders.
- **Finance Analyzer**: Real-time cash flow projection and budget tracking.
- **Regulation Monitor**: Checks compliance against local zoning and safety codes.
- **Document Processor**: OCR and semantic analysis of blueprints and PDFs.

### 🔌 Connectivity
- **MCP Server**: Exposes internal tools to external AI clients like **Claude Desktop**, allowing developers to "chat" with the project database and file system.
- **Next.js Dashboard**: A client-facing web application for executives to view dashboards and generate reports.

## 📂 Project Structure

This project is a **Monorepo** managed by Turbo.

```
.
├── apps/
│   └── web/                 # Next.js App (Dashboard + API + MCP Server)
│       ├── lib/
│       │   └── construction-agent/
│       │       ├── agents/  # RLM and specialized agents
│       │       ├── tools/   # Zod-defined tools (Finance, Docs, etc.)
│       │       └── rag/     # Vector DB logic
│       └── mcp/             # MCP Server entry point
├── packages/
│   ├── core/                # Shared types and business logic
│   └── ui/                  # Shared UI components
└── README.md
```

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- Postgres Database (or Vercel Postgres)
- OpenAI / DeepSeek API Keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GladiatorGeneral/aegis-phnx-bytes.git
   cd aegis-phnx-bytes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in `apps/web/` with your keys:
   ```env
   OPENAI_API_KEY=sk-...
   POSTGRES_URL=...
   PINECONE_API_KEY=...
   ```

### Running the Application

**Start the Web Dashboard:**
```bash
npm run dev --workspace=apps/web
```
Visit `http://localhost:3000`

**Start the MCP Server (for Claude Desktop):**
```bash
npm run mcp --workspace=apps/web
```

## 🤖 Model Context Protocol (MCP) Setup

To let **Claude Desktop** or other MCP clients use your construction tools:

1. Edit your Claude config file:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Mac/Linux**: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add the Aegis server:
   ```json
   {
     "mcpServers": {
       "aegis-agent": {
         "command": "cmd.exe",
         "args": [
           "/c",
           "npx",
           "-y",
           "tsx",
           "E:\\AbsolutePath\\To\\Projects\\aegis-phnx-bytes\\apps\\web\\mcp\\server.ts"
         ]
       }
     }
   }
   ```

3. Restart Claude Desktop. You will now see a 🔌 icon indicating the tool is connected.

## 🧪 Testing the RLM Agent

Once connected via MCP, try a complex query:

> "Analyze the attached contract PDF. Run a profit simulation assuming a 10% increase in labor costs and a 2-week schedule delay. Summarize the risks."

The **RLM Controller** will:
1. Decompose the request.
2. Read the document.
3. Call the `profit-simulation` tool.
4. Synthesize the findings into a report.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **AI Orchestration**: Vercel AI SDK
- **Protocol**: Model Context Protocol (MCP)
- **Database**: PostgreSQL (Drizzle ORM)
- **Vector DB**: Pinecone
- **Styling**: Tailwind CSS
