import { z } from "zod";

export const PolymarketConfigSchema = z.object({
  baseUrl: z.string().default("https://gamma-api.polymarket.com"),
});
export type ParsedPolymarketServiceConfig = z.output<typeof PolymarketConfigSchema>;
