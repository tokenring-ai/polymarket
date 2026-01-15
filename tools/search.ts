import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import PolymarketService from "../PolymarketService.ts";

const name = "polymarket_search";

async function execute(
  {query}: z.output<typeof inputSchema>,
  agent: Agent,
): Promise<{results?: any}> {
  const polymarket = agent.requireServiceByType(PolymarketService);

  if (!query) {
    throw new Error(`[${name}] query is required`);
  }

  agent.infoMessage(`[polymarketSearch] Searching: ${query}`);
  const results = await polymarket.searchMarkets(query);
  return {results};
}

const description = "Search Polymarket for prediction markets, events, and profiles.";

const inputSchema = z.object({
  query: z.string().min(1).describe("Search query"),
});

export default {
  name, description, inputSchema, execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
