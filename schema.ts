import type { ConfigFieldMeta } from "@tokenring-ai/app/config/metadata";
import { z } from "zod";

export const PolymarketConfigSchema = z
  .object({
    baseUrl: z
      .string()
      .default("https://gamma-api.polymarket.com")
      .meta({ advanced: true, description: "Polymarket API base URL (defaults to the public prediction markets API)" } satisfies ConfigFieldMeta),
  })
  .meta({ label: "Polymarket", description: "Polymarket prediction market lookups (public API, no credentials required)" } satisfies ConfigFieldMeta);
export type ParsedPolymarketServiceConfig = z.output<typeof PolymarketConfigSchema>;
