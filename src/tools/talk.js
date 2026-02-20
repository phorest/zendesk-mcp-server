import { z } from 'zod';

export const talkTools = (client) => [
  {
    name: "get_talk_stats",
    description: "Get Zendesk Talk statistics",
    schema: {},
    handler: async () => {
      try {
        const result = await client.getTalkStats();
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error getting Talk stats: ${error.message}` }], isError: true };
      }
    }
  }
];
