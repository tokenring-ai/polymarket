import {TokenRingPlugin} from "@tokenring-ai/app";
import {ChatService} from "@tokenring-ai/chat";
import {z} from "zod";
import packageJSON from "./package.json" with {type: "json"};
import PolymarketService from "./PolymarketService.ts";
import {PolymarketConfigSchema} from "./schema.ts";

import tools from "./tools.ts";

const packageConfigSchema = z.object({
  polymarket: PolymarketConfigSchema.prefault({})
});

export default {
  name: packageJSON.name,
  version: packageJSON.version,
  description: packageJSON.description,
  install(app, config) {
    app.waitForService(ChatService, chatService =>
      chatService.addTools(tools)
    );
    app.addServices(new PolymarketService(config.polymarket));
  },
  config: packageConfigSchema
} satisfies TokenRingPlugin<typeof packageConfigSchema>;
