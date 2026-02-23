import { z } from 'zod';

export const macrosTools = (client) => [
  {
    name: "list_macros",
    description: "List macros in Zendesk",
    schema: { page: z.number().optional().describe("Page number for pagination"), per_page: z.number().optional().describe("Number of macros per page (max 100)") },
    handler: async ({ page, per_page }) => {
      try {
        const result = await client.listMacros({ page, per_page });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error listing macros: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "get_macro",
    description: "Get a specific macro by ID",
    schema: { id: z.number().describe("Macro ID") },
    handler: async ({ id }) => {
      try {
        const result = await client.getMacro(id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error getting macro: ${error.message}` }], isError: true };
      }
    }
  }
];
