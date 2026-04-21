import type Agent from "@tokenring-ai/agent/Agent";
import type { TokenRingToolDefinition, TokenRingToolResult } from "@tokenring-ai/chat/schema";
import { z } from "zod";
import PolymarketService from "../PolymarketService.ts";

const name = "polymarket_listEvents";
const displayName = "Polymarket/listEvents";

async function execute({ limit, offset, closed, tag_id }: z.output<typeof inputSchema>, agent: Agent): Promise<TokenRingToolResult> {
  const polymarket = agent.requireServiceByType(PolymarketService);

  agent.infoMessage(`[polymarketListEvents] Fetching events`);
  const events = await polymarket.listEvents({ limit, offset, closed, tag_id });
  return JSON.stringify(events);
}

const description = "List active prediction market events on Polymarket.";

const inputSchema = z.object({
  limit: z.number().int().positive().max(100).exactOptional().describe("Number of results (default: 10)"),
  offset: z.number().int().min(0).exactOptional().describe("Offset for pagination (default: 0)"),
  closed: z.boolean().exactOptional().describe("Include closed markets (default: false)"),
  tag_id: z.number().int().exactOptional().describe("Filter by tag ID"),
});

export default {
  name,
  displayName,
  description,
  inputSchema,
  execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
