import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Tools
import { changeOrderLoggerTool } from "../lib/construction-agent/tools/change-order-logger";
import { documentProcessorTool } from "../lib/construction-agent/tools/document-processor";
import { financeAnalyzerTool } from "../lib/construction-agent/tools/finance-analyzer";
import { regulationMonitorTool } from "../lib/construction-agent/tools/regulation-monitor";
import { rlmAnalysisTool } from "../lib/construction-agent/agents/rlm-agent";

// Create the MCP Server
const server = new McpServer({
  name: "aegis-phnx-construction-agent",
  version: "1.0.0",
});

const tools = {
  "log-change-order": changeOrderLoggerTool,
  "process-document": documentProcessorTool,
  "analyze-finance": financeAnalyzerTool,
  "monitor-regulations": regulationMonitorTool,
  "recursive-contract-analysis": rlmAnalysisTool,
};

// Register each tool with the MCP server
for (const [name, tool] of Object.entries(tools)) {
  server.tool(
    name,
    tool.description || "",
    // @ts-ignore - The AI SDK parameters schema is compatible with MCP
    tool.parameters, 
    async (args) => {
      // @ts-ignore - The AI SDK execute signature allows args
      const result = await tool.execute(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}

// Start the server using Stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Construction Agent MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main loop:", error);
  process.exit(1);
});
