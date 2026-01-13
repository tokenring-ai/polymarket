import {TokenRingPlugin} from "@tokenring-ai/app";
import {ChatService} from "@tokenring-ai/chat";
import {z} from "zod";
import packageJSON from './package.json' with {type: 'json'};

import tools from "./tools.ts";
import PolymarketService, {PolymarketConfigSchema} from "./PolymarketService.ts";

const packageConfigSchema = z.object({
  polymarket: PolymarketConfigSchema.optional()
});

export default {
  name: packageJSON.name,
  version: packageJSON.version,
  description: packageJSON.description,
  install(app, config) {
    if (config.polymarket) {
      app.waitForService(ChatService, chatService =>
        chatService.addTools(packageJSON.name, tools)
      );
      app.addServices(new PolymarketService(config.polymarket));
    }
  },
  config: packageConfigSchema
} satisfies TokenRingPlugin<typeof packageConfigSchema>;
