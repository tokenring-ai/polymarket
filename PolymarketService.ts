import type {TokenRingService} from "@tokenring-ai/app/types";
import {HttpService} from "@tokenring-ai/utility/http/HttpService";
import type {ParsedPolymarketServiceConfig} from "./schema.ts";

export type PolymarketSearchOptions = {
  limit?: number;
  offset?: number;
  closed?: boolean;
  tag_id?: number;
};

export default class PolymarketService
  extends HttpService
  implements TokenRingService {
  readonly name = "PolymarketService";
  description = "Service for querying Polymarket prediction markets";
  defaultHeaders = {};

  protected baseUrl: string;

  constructor(readonly config: ParsedPolymarketServiceConfig) {
    super();
    this.baseUrl = config.baseUrl;
  }

  searchMarkets(query: string): Promise<any> {
    if (!query) throw new Error("query is required");

    const params = new URLSearchParams({q: query});
    return this.fetchJson(
      `/public-search?${params}`,
      {method: "GET"},
      "Polymarket search",
    );
  }

  listEvents(opts: PolymarketSearchOptions = {}): Promise<any> {
    const params = new URLSearchParams({
      limit: String(opts.limit || 10),
      offset: String(opts.offset || 0),
      closed: String(opts.closed ?? false),
    });
    if (opts.tag_id) params.set("tag_id", String(opts.tag_id));

    return this.fetchJson(
      `/events?${params}`,
      {method: "GET"},
      "Polymarket list events",
    );
  }

  getEventBySlug(slug: string): Promise<any> {
    if (!slug) throw new Error("slug is required");
    return this.fetchJson(
      `/events/slug/${slug}`,
      {method: "GET"},
      "Polymarket get event",
    );
  }

  getMarketBySlug(slug: string): Promise<any> {
    if (!slug) throw new Error("slug is required");
    return this.fetchJson(
      `/markets/slug/${slug}`,
      {method: "GET"},
      "Polymarket get market",
    );
  }
}
