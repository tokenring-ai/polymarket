import type Agent from "@tokenring-ai/agent/Agent";
import type { TokenRingToolDefinition, TokenRingToolResult } from "@tokenring-ai/chat/schema";
import { ToolCallError } from "@tokenring-ai/chat/util/tokenRingTool";
import { z } from "zod";
import PolymarketService from "../PolymarketService.ts";

const name = "polymarket_search";
const displayName = "Polymarket/search";

async function execute({ query }: z.output<typeof inputSchema>, agent: Agent): Promise<TokenRingToolResult> {
  const polymarket = agent.requireServiceByType(PolymarketService);

  if (!query) {
    throw new ToolCallError(name, `query is required`);
  }

  agent.infoMessage(`[polymarketSearch] Searching: ${query}`);
  const results = await polymarket.searchMarkets(query);
  return JSON.stringify(results);
}

const description = "Search Polymarket for prediction markets, events, and profiles.";

const inputSchema = z.object({
  query: z.string().min(1).describe("Search query"),
});

export default {
  name,
  displayName,
  description,
  inputSchema,
  execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
