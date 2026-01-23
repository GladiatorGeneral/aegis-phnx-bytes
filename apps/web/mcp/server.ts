/**
 * Construction Agent MCP Server
 * 
 * NOTE: This project now uses a PROMPT-BASED MCP Architecture instead of 
 * tool-based connections. See:
 * - /lib/construction-agent/mcp-specification.md (Full specification)
 * - /lib/construction-agent/prompts/mcp-prompts.ts (Prompt library)
 * - /lib/construction-agent/prompts/rlm-controller.ts (System prompt)
 * 
 * This server file is kept for backwards compatibility with external MCP clients
 * (like Claude Desktop) that may want to use traditional tool-based integration.
 * 
 * The primary interface is now the /api/construction-agent endpoint which uses
 * the Three-Tier Hierarchical MCP Architecture:
 * - TIER 1: Strategic (Frameworks, Governance, Standards)
 * - TIER 2: Tactical (Methodologies, Processes, Analysis)
 * - TIER 3: Operational (Calculations, Tasks, Execution)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import prompt-based utilities
import { 
  calculateEVM, 
  calculateMarkup,
  PROMPTS,
  TIER1_FRAMEWORKS,
  TIER1_GOVERNANCE,
  TIER2_METHODOLOGIES,
} from "../lib/construction-agent/prompts/mcp-prompts";

// Create the MCP Server
const server = new McpServer({
  name: "aegis-phnx-construction-agent",
  version: "2.0.0",
});

// ============================================================================
// TIER 3: OPERATIONAL TOOLS (Direct Calculations)
// ============================================================================

// EVM Calculator Tool
server.tool(
  "calculate-evm",
  "Calculate Earned Value Management metrics (CPI, SPI, EAC, etc.) from project data. Inputs: bac (Budget at Completion), pv (Planned Value), ev (Earned Value), ac (Actual Cost).",
  async (args: Record<string, unknown>) => {
    const bac = Number(args.bac) || 0;
    const pv = Number(args.pv) || 0;
    const ev = Number(args.ev) || 0;
    const ac = Number(args.ac) || 0;
    const result = calculateEVM(bac, pv, ev, ac);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Markup Calculator Tool
server.tool(
  "calculate-markup",
  "Calculate change order markup. Inputs: labor, materials, equipment, subcontractorCost, overheadRate (%), profitRate (%), subMarkupRate (%).",
  async (args: Record<string, unknown>) => {
    const labor = Number(args.labor) || 0;
    const materials = Number(args.materials) || 0;
    const equipment = Number(args.equipment) || 0;
    const subcontractorCost = Number(args.subcontractorCost) || 0;
    const overheadRate = Number(args.overheadRate) || 0;
    const profitRate = Number(args.profitRate) || 0;
    const subMarkupRate = Number(args.subMarkupRate) || 0;
    const result = calculateMarkup(labor, materials, equipment, subcontractorCost, overheadRate, profitRate, subMarkupRate);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ============================================================================
// KNOWLEDGE RESOURCES (Read-Only Reference Data)
// ============================================================================

// Get Framework Info
server.tool(
  "get-framework",
  "Get information about a construction framework. Input: framework (EVM, CPM, or RISK).",
  async (args: Record<string, unknown>) => {
    const framework = String(args.framework || "");
    const frameworks: Record<string, unknown> = {
      EVM: TIER1_FRAMEWORKS.EARNED_VALUE_MANAGEMENT,
      CPM: TIER1_FRAMEWORKS.CRITICAL_PATH_METHOD,
      RISK: TIER1_FRAMEWORKS.RISK_MANAGEMENT,
    };
    const result = frameworks[framework] || { error: "Framework not found. Use: EVM, CPM, or RISK" };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Get Governance Standard
server.tool(
  "get-governance-standard",
  "Get information about a governance standard. Input: standard (AIA, OSHA, or LEED).",
  async (args: Record<string, unknown>) => {
    const standard = String(args.standard || "");
    const standards: Record<string, unknown> = {
      AIA: TIER1_GOVERNANCE.AIA_CONTRACTS,
      OSHA: TIER1_GOVERNANCE.OSHA_CONSTRUCTION,
      LEED: TIER1_GOVERNANCE.LEED,
    };
    const result = standards[standard] || { error: "Standard not found. Use: AIA, OSHA, or LEED" };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Get Methodology
server.tool(
  "get-methodology",
  "Get information about a tactical methodology. Input: methodology (CHANGE_ORDER, COST_FORECAST, DELAY_ANALYSIS, PREQUALIFICATION).",
  async (args: Record<string, unknown>) => {
    const methodology = String(args.methodology || "");
    const methodologies: Record<string, unknown> = {
      CHANGE_ORDER: TIER2_METHODOLOGIES.CHANGE_ORDER_EVALUATION,
      COST_FORECAST: TIER2_METHODOLOGIES.COST_FORECASTING,
      DELAY_ANALYSIS: TIER2_METHODOLOGIES.DELAY_ANALYSIS,
      PREQUALIFICATION: TIER2_METHODOLOGIES.SUBCONTRACTOR_PREQUALIFICATION,
    };
    const result = methodologies[methodology] || { error: "Methodology not found" };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Get Prompt Template
server.tool(
  "get-prompt-template",
  "Get a prompt template. Inputs: tier (TIER1, TIER2, TIER3, EXECUTIVE), promptName (the specific prompt).",
  async (args: Record<string, unknown>) => {
    const tier = String(args.tier || "");
    const promptName = String(args.promptName || "");
    
    const tierPrompts = PROMPTS[tier as keyof typeof PROMPTS];
    if (!tierPrompts) {
      return { 
        content: [{ 
          type: "text" as const, 
          text: `Tier not found. Available tiers: ${Object.keys(PROMPTS).join(", ")}` 
        }] 
      };
    }
    
    const prompt = (tierPrompts as Record<string, string>)[promptName];
    if (!prompt) {
      return { 
        content: [{ 
          type: "text" as const, 
          text: `Prompt not found. Available prompts in ${tier}: ${Object.keys(tierPrompts).join(", ")}` 
        }] 
      };
    }
    
    return { content: [{ type: "text" as const, text: prompt }] };
  }
);

// ============================================================================
// MCP SPECIFICATION RESOURCE
// ============================================================================

server.tool(
  "get-mcp-specification",
  "Get the full MCP specification document for the Construction AI Agent.",
  async () => {
    const overview = {
      architecture: "Three-Tier Hierarchical MCP",
      tiers: {
        tier1: {
          name: "Strategic",
          focus: "Frameworks, Governance, Standards",
          examples: ["EVM", "CPM", "Risk Management", "AIA Contracts", "OSHA", "LEED"],
        },
        tier2: {
          name: "Tactical",
          focus: "Methodologies, Processes, Analysis",
          examples: ["Change Order Evaluation", "Cost Forecasting", "Delay Analysis", "Subcontractor Prequalification"],
        },
        tier3: {
          name: "Operational",
          focus: "Calculations, Tasks, Execution",
          examples: ["EVM Calculator", "Markup Calculator", "Retention Calculator", "Productivity Calculator"],
        },
      },
      availableTools: [
        "calculate-evm",
        "calculate-markup",
        "get-framework",
        "get-governance-standard",
        "get-methodology",
        "get-prompt-template",
      ],
    };
    
    return {
      content: [{ type: "text" as const, text: JSON.stringify(overview, null, 2) }],
    };
  }
);

// Start the server using Stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Construction Agent MCP Server v2.0 running on stdio");
  console.error("Using Three-Tier Hierarchical MCP Architecture");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
