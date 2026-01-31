# @tokenring-ai/polymarket

Polymarket prediction markets integration for Token Ring AI agents. This package provides a service for interacting with the Polymarket API and tools for AI agents to search markets, list events, and retrieve market data.

## Overview

The `@tokenring-ai/polymarket` package enables seamless integration with the Polymarket API for querying prediction markets and events. It is designed specifically for use within the Token Ring AI agent framework, allowing agents to access real-time prediction market data.

### Key Features

- **Polymarket Service**: Core service for direct API interactions with Polymarket
- **Agent Tools**: Four pre-built tools for AI workflows:
  - `polymarket_search`: Search markets, events, and profiles
  - `polymarket_listEvents`: List active prediction market events with filtering
  - `polymarket_getEvent`: Retrieve event details by slug
  - `polymarket_getMarket`: Retrieve market details by slug
- **TypeScript Support**: Full TypeScript definitions and type safety
- **Input Validation**: Zod schemas for robust input validation
- **Error Handling**: Built-in error handling for API operations
- **Configurable**: Support for custom API base URLs
- **Plugin Architecture**: Integrates seamlessly with Token Ring app ecosystem

## Installation

```bash
bun install @tokenring-ai/polymarket
```

## Chat Commands

This package does not define chat commands. The functionality is exposed through agent tools instead.

## Plugin Configuration

The plugin accepts a configuration object with optional Polymarket settings:

```typescript
interface PolymarketPluginConfig {
  polymarket?: {
    baseUrl?: string;  // Polymarket API base URL (default: https://gamma-api.polymarket.com)
  }
}
```

**Example configuration:**

```typescript
import TokenRingApp from "@tokenring-ai/app";
import polymarketPlugin from "@tokenring-ai/polymarket";

const app = new TokenRingApp();
app.install(polymarketPlugin, {
  polymarket: {
    baseUrl: "https://gamma-api.polymarket.com"  // Optional, defaults to Polymarket API
  }
});
```

## Tools

The package provides the following tools that can be used by Token Ring agents:

### polymarket_search

Search Polymarket for prediction markets, events, and profiles.

**Tool Input Schema:**

```typescript
z.object({
  query: z.string().min(1).describe("Search query"),
})
```

**Example usage:**

```typescript
const result = await agent.executeTool("polymarket_search", {
  query: "2024 election"
});
// Returns: { results: { events: [...], tags: [...], profiles: [...] } }
```

### polymarket_listEvents

List active prediction market events on Polymarket with filtering options.

**Tool Input Schema:**

```typescript
z.object({
  limit: z.number().int().positive().max(100).optional().describe("Number of results (default: 10)"),
  offset: z.number().int().min(0).optional().describe("Offset for pagination (default: 0)"),
  closed: z.boolean().optional().describe("Include closed markets (default: false)"),
  tag_id: z.number().int().optional().describe("Filter by tag ID"),
})
```

**Example usage:**

```typescript
const result = await agent.executeTool("polymarket_listEvents", {
  limit: 20,
  closed: false
});
// Returns: { events: [...] }
```

### polymarket_getEvent

Get a specific Polymarket event by its slug (from URL).

**Tool Input Schema:**

```typescript
z.object({
  slug: z.string().min(1).describe("Event slug from Polymarket URL"),
})
```

**Example usage:**

```typescript
const result = await agent.executeTool("polymarket_getEvent", {
  slug: "fed-decision-in-october"
});
// Returns: { event: { id, title, markets: [...], ... } }
```

### polymarket_getMarket

Get a specific Polymarket market by its slug (from URL).

**Tool Input Schema:**

```typescript
z.object({
  slug: z.string().min(1).describe("Market slug from Polymarket URL"),
})
```

**Example usage:**

```typescript
const result = await agent.executeTool("polymarket_getMarket", {
  slug: "will-ai-exceed-human-level-performance-by-2025"
});
// Returns: { market: { id, title, price, volume, ... } }
```

## Services

### PolymarketService

The core service class for Polymarket API interactions.

**Constructor:**

```typescript
constructor(config?: PolymarketConfig)
```

**Parameters:**

- `config.baseUrl` (string, optional): Base URL for Polymarket API (defaults to "https://gamma-api.polymarket.com")

**Methods:**

#### searchMarkets(query: string): Promise<any>

Search Polymarket for markets, events, and profiles.

**Parameters:**

- `query` (string): Search term (required)

**Returns:** Promise resolving to Polymarket API search response

#### listEvents(options?: PolymarketSearchOptions): Promise<any>

List prediction market events with filtering.

**Parameters:**

- `options` (PolymarketSearchOptions, optional):
  - `limit` (number): Maximum number of results (default: 10)
  - `offset` (number): Pagination offset (default: 0)
  - `closed` (boolean): Include closed markets (default: false)
  - `tag_id` (number): Filter by tag ID

**Returns:** Promise resolving to array of events

#### getEventBySlug(slug: string): Promise<any>

Retrieve event details by slug.

**Parameters:**

- `slug` (string): Event slug from Polymarket URL (required)

**Returns:** Promise resolving to event object

#### getMarketBySlug(slug: string): Promise<any>

Retrieve market details by slug.

**Parameters:**

- `slug` (string): Market slug from Polymarket URL (required)

**Returns:** Promise resolving to market object

**Example usage:**

```typescript
import PolymarketService from "@tokenring-ai/polymarket";

const polymarket = new PolymarketService({
  baseUrl: "https://gamma-api.polymarket.com"
});

// Search for markets
const searchResults = await polymarket.searchMarkets("AI regulation");

// List active events
const events = await polymarket.listEvents({
  limit: 10,
  closed: false
});

// Get specific event
const event = await polymarket.getEventBySlug("ai-regulation-2024");

// Get specific market
const market = await polymarket.getMarketBySlug("will-ai-exceed-human-level-performance-by-2025");
```

## Providers

### PolymarketService Provider

The `PolymarketService` is a TokenRingService that can be required by agents using the `requireServiceByType` method.

**Provider Type:**

```typescript
import PolymarketService from "@tokenring-ai/polymarket";

// In an agent context
const polymarket = agent.requireServiceByType(PolymarketService);
```

**Usage in tools:**

```typescript
import Agent from "@tokenring-ai/agent/Agent";
import {z} from "zod";
import PolymarketService from "../PolymarketService.ts";

async function execute({query}: z.infer<typeof inputSchema>, agent: Agent): Promise<any> {
  const polymarket = agent.requireServiceByType(PolymarketService);
  const results = await polymarket.searchMarkets(query);
  return {results};
}
```

## RPC Endpoints

This package does not define RPC endpoints.

## State Management

This package does not implement state persistence or restoration.

## Package Structure

```
pkg/polymarket/
├── index.ts                 # Main entry point and plugin export
├── PolymarketService.ts     # Core Polymarket API service
├── plugin.ts                # Token Ring plugin integration
├── tools.ts                 # Tool exports
├── schema.ts                # Configuration schema
├── tools/
│   ├── search.ts            # Polymarket search tool
│   ├── listEvents.ts        # List events tool
│   ├── getEvent.ts          # Get event by slug tool
│   └── getMarket.ts         # Get market by slug tool
├── package.json             # Package metadata and dependencies
├── vitest.config.ts         # Vitest configuration
└── README.md                # This documentation
```

## Testing

Run the test suite:

```bash
bun run test
```

**Test commands:**

- `bun run test` - Run all tests
- `bun run test:watch` - Run tests in watch mode
- `bun run test:coverage` - Run tests with coverage report

## Configuration

### Base URL Configuration

You can configure the service to use different API endpoints:

```typescript
import PolymarketService from "@tokenring-ai/polymarket";

// Production API (default)
const polymarket = new PolymarketService();

// Custom endpoint
const customPolymarket = new PolymarketService({
  baseUrl: "https://custom-api.example.com"
});
```

### Configuration Schema

The configuration is defined using Zod schemas:

```typescript
import {z} from "zod";

export const PolymarketConfigSchema = z.object({
  baseUrl: z.string().default("https://gamma-api.polymarket.com")
});

export type ParsedPolymarketServiceConfig = z.output<typeof PolymarketConfigSchema>;
```

## Error Handling

The service includes comprehensive error handling:

- **Invalid inputs**: Throws descriptive errors for missing required parameters
- **API failures**: Handles HTTP errors and non-OK responses
- **Network issues**: Uses retry logic for transient failures
- **JSON parsing**: Validates and sanitizes API responses

**Error examples:**

```typescript
// Empty query throws error
await polymarket.searchMarkets("");  // Error: "query is required"

// Empty slug throws error
await polymarket.getEventBySlug("");  // Error: "slug is required"

// Empty slug for market throws error
await polymarket.getMarketBySlug("");  // Error: "slug is required"
```

## Examples

### Basic Search and List Events

```typescript
import PolymarketService from "@tokenring-ai/polymarket";

const polymarket = new PolymarketService();

// Search for markets
const searchResults = await polymarket.searchMarkets("presidential election");
console.log("Search results:", searchResults.events);

// List active events
const events = await polymarket.listEvents({
  limit: 5,
  closed: false
});
console.log("Active events:", events);
```

### Agent Workflow Example

```typescript
// In a Token Ring agent
async function analyzeMarket(topic: string) {
  // Search for relevant markets
  const searchResult = await agent.executeTool("polymarket_search", {
    query: topic
  });

  // Get details on the first event
  if (searchResult.results?.events?.length > 0) {
    const topEvent = searchResult.results.events[0];
    const eventDetails = await agent.executeTool("polymarket_getEvent", {
      slug: topEvent.slug
    });

    return {
      title: eventDetails.event.title,
      markets: eventDetails.event.markets,
      volume: eventDetails.event.volume
    };
  }

  throw new Error("No relevant markets found");
}
```

### Pagination Example

```typescript
import PolymarketService from "@tokenring-ai/polymarket";

const polymarket = new PolymarketService();

// Fetch first page
const page1 = await polymarket.listEvents({
  limit: 10,
  offset: 0,
  closed: false
});

// Fetch second page
const page2 = await polymarket.listEvents({
  limit: 10,
  offset: 10,
  closed: false
});
```

### Tag Filtering Example

```typescript
import PolymarketService from "@tokenring-ai/polymarket";

const polymarket = new PolymarketService();

// Fetch events filtered by a specific tag
const techEvents = await polymarket.listEvents({
  limit: 10,
  tag_id: 12345,
  closed: false
});

// Fetch markets filtered by a specific tag
const techMarkets = await polymarket.searchMarkets({
  query: "AI",
  tag_id: 12345
});
```

### Getting Market Details

```typescript
import PolymarketService from "@tokenring-ai/polymarket";

const polymarket = new PolymarketService();

// Get market by slug
const market = await polymarket.getMarketBySlug("will-ai-exceed-human-level-performance-by-2025");

console.log("Market Title:", market.title);
console.log("Current Price:", market.price);
console.log("Yes Share Volume:", market.yes_share_volume);
console.log("No Share Volume:", market.no_share_volume);
console.log("Total Volume:", market.total_share_volume);
```

## Best Practices

### API Usage

- **Query Specificity**: Use specific queries for better search results
- **Pagination**: Use offset and limit for large result sets (max 100 per request)
- **Filtering**: Use tag_id and closed filters to narrow results
- **Slug Format**: Extract slugs from Polymarket URLs for accurate lookups

### Market Analysis

- **Compare Markets**: Use search to find related markets for comparison
- **Track Events**: Use listEvents to monitor events over time
- **Analyze Data**: Use getEvent and getMarket for detailed analysis
- **Volume Analysis**: Check yes_share_volume and no_share_volume for market depth

### Performance Considerations

- **Caching**: Cache API responses when appropriate
- **Rate Limiting**: Respect API limits for production applications
- **Batch Operations**: Use listEvents for multiple events instead of individual calls
- **Error Recovery**: Implement retry logic for transient failures

## Troubleshooting

### API Errors

**Problem**: API requests fail with HTTP errors

**Solution**:
- Verify the baseUrl is correct
- Check network connectivity to Polymarket API
- Ensure API is not temporarily down
- Check for rate limiting

### Search Results

**Problem**: Search returns no results

**Solution**:
- Try different search queries
- Check that markets exist for the query
- Verify the search syntax is correct
- Try listing events to see available markets

### Event/Market Not Found

**Problem**: getEvent or getMarket returns error

**Solution**:
- Verify the slug is correct (check from search results)
- Ensure the event/market exists and is not closed
- Check that the slug matches the API format
- Use search to find the correct slug

### Rate Limiting

**Problem**: API returns 429 Too Many Requests

**Solution**:
- Implement retry logic with exponential backoff
- Add delays between requests
- Monitor API rate limits
- Consider caching responses

### Configuration Issues

**Problem**: API requests fail with incorrect configuration

**Solution**:
- Verify baseUrl is set correctly
- Check that the URL uses HTTPS
- Ensure the base URL ends with a trailing slash
- Test the URL in a browser or curl

## License

MIT License - see [LICENSE](./LICENSE) file for details.
