import type { TokenRingService } from "@tokenring-ai/app/types";
import { HTTPRetriever } from "@tokenring-ai/utility/http/HTTPRetriever";
import type { JSONValue } from "@tokenring-ai/utility/json/safeParse";
import { JSONValueSchema } from "@tokenring-ai/utility/json/schema";
import type { ParsedPolymarketServiceConfig } from "./schema.ts";

export type PolymarketSearchOptions = {
  limit?: number | undefined;
  offset?: number | undefined;
  closed?: boolean | undefined;
  tag_id?: number | undefined;
};

export default class PolymarketService implements TokenRingService {
  readonly name = "PolymarketService";
  description = "Service for querying Polymarket prediction markets";

  private readonly retriever: HTTPRetriever;

  constructor(readonly config: ParsedPolymarketServiceConfig) {
    this.retriever = new HTTPRetriever({
      baseUrl: config.baseUrl,
      headers: {},
      timeout: 10_000,
    });
  }

  searchMarkets(query: string): Promise<JSONValue> {
    if (!query) throw new Error("query is required");

    const params = new URLSearchParams({ q: query });
    return this.retriever.fetchValidatedJson({
      url: `/public-search?${params}`,
      opts: { method: "GET" },
      schema: JSONValueSchema,
      context: "Polymarket search",
    });
  }

  listEvents(opts: PolymarketSearchOptions = {}): Promise<JSONValue> {
    const params = new URLSearchParams({
      limit: String(opts.limit || 10),
      offset: String(opts.offset || 0),
      closed: String(opts.closed ?? false),
    });
    if (opts.tag_id) params.set("tag_id", String(opts.tag_id));

    return this.retriever.fetchValidatedJson({
      url: `/events?${params}`,
      opts: { method: "GET" },
      schema: JSONValueSchema,
      context: "Polymarket list events",
    });
  }

  getEventBySlug(slug: string): Promise<JSONValue> {
    if (!slug) throw new Error("slug is required");
    return this.retriever.fetchValidatedJson({
      url: `/events/slug/${slug}`,
      opts: { method: "GET" },
      schema: JSONValueSchema,
      context: "Polymarket get event",
    });
  }

  getMarketBySlug(slug: string): Promise<JSONValue> {
    if (!slug) throw new Error("slug is required");
    return this.retriever.fetchValidatedJson({
      url: `/markets/slug/${slug}`,
      opts: { method: "GET" },
      schema: JSONValueSchema,
      context: "Polymarket get market",
    });
  }
}
