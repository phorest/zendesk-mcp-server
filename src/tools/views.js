import { z } from 'zod';

export const viewsTools = (client) => [
  {
    name: "list_views",
    description: "List views in Zendesk",
    schema: { page: z.number().optional().describe("Page number for pagination"), per_page: z.number().optional().describe("Number of views per page (max 100)") },
    handler: async ({ page, per_page }) => {
      try {
        const result = await client.listViews({ page, per_page });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error listing views: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "get_view",
    description: "Get a specific view by ID",
    schema: { id: z.number().describe("View ID") },
    handler: async ({ id }) => {
      try {
        const result = await client.getView(id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error getting view: ${error.message}` }], isError: true };
      }
    }
  }
];
