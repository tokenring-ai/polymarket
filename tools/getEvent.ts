import type Agent from "@tokenring-ai/agent/Agent";
import type {TokenRingToolDefinition, TokenRingToolResult} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import PolymarketService from "../PolymarketService.ts";

const name = "polymarket_getEvent";
const displayName = "Polymarket/getEvent";

async function execute(
  {slug}: z.output<typeof inputSchema>,
  agent: Agent,
): Promise<TokenRingToolResult> {
  const polymarket = agent.requireServiceByType(PolymarketService);

  if (!slug) {
    throw new Error(`[${name}] slug is required`);
  }

  agent.infoMessage(`[polymarketGetEvent] Fetching event: ${slug}`);
  const event = await polymarket.getEventBySlug(slug);
  return JSON.stringify(event);
}

const description = "Get a specific Polymarket event by its slug (from URL).";

const inputSchema = z.object({
  slug: z.string().min(1).describe("Event slug from Polymarket URL"),
});

export default {
  name,
  displayName,
  description,
  inputSchema,
  execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
