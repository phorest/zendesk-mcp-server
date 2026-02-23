import { z } from 'zod';

export const triggersTools = (client) => [
  {
    name: "list_triggers",
    description: "List triggers in Zendesk",
    schema: { page: z.number().optional().describe("Page number for pagination"), per_page: z.number().optional().describe("Number of triggers per page (max 100)") },
    handler: async ({ page, per_page }) => {
      try {
        const result = await client.listTriggers({ page, per_page });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error listing triggers: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "get_trigger",
    description: "Get a specific trigger by ID",
    schema: { id: z.number().describe("Trigger ID") },
    handler: async ({ id }) => {
      try {
        const result = await client.getTrigger(id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error getting trigger: ${error.message}` }], isError: true };
      }
    }
  }
];
