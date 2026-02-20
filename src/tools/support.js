import { z } from 'zod';

export const supportTools = (client) => [
  {
    name: "support_info",
    description: "Get information about Zendesk Support configuration",
    schema: {},
    handler: async () => {
      try {
        return { content: [{ type: "text", text: "Zendesk Support information would be displayed here. This is a placeholder for future implementation." }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error getting support info: ${error.message}` }], isError: true };
      }
    }
  }
];
