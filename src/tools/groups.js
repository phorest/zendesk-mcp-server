import { z } from 'zod';

export const groupsTools = (client) => [
  {
    name: "list_groups",
    description: "List agent groups in Zendesk",
    schema: { page: z.number().optional().describe("Page number for pagination"), per_page: z.number().optional().describe("Number of groups per page (max 100)") },
    handler: async ({ page, per_page }) => {
      try {
        const result = await client.listGroups({ page, per_page });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error listing groups: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "get_group",
    description: "Get a specific group by ID",
    schema: { id: z.number().describe("Group ID") },
    handler: async ({ id }) => {
      try {
        const result = await client.getGroup(id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error getting group: ${error.message}` }], isError: true };
      }
    }
  }
];
