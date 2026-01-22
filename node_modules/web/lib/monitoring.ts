export function logAgentUsage(toolName: string, tokens: number) {
  // Send to your analytics service
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    tool: toolName,
    tokens,
    cost: calculateCost(tokens)
  }));
}

function calculateCost(tokens: number): number {
  // DeepSeek pricing: $0.07 per 1M tokens (input)
  return (tokens / 1000000) * 0.07;
}
