import { z } from 'zod';

export const automationsTools = (client) => [
  {
    name: "list_automations",
    description: "List automations in Zendesk",
    schema: { page: z.number().optional().describe("Page number for pagination"), per_page: z.number().optional().describe("Number of automations per page (max 100)") },
    handler: async ({ page, per_page }) => {
      try {
        const result = await client.listAutomations({ page, per_page });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error listing automations: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "get_automation",
    description: "Get a specific automation by ID",
    schema: { id: z.number().describe("Automation ID") },
    handler: async ({ id }) => {
      try {
        const result = await client.getAutomation(id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error getting automation: ${error.message}` }], isError: true };
      }
    }
  }
];
