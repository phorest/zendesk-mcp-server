import { z } from 'zod';

export const chatTools = (client) => [
  {
    name: "list_chats",
    description: "List Zendesk Chat conversations",
    schema: { page: z.number().optional().describe("Page number for pagination"), per_page: z.number().optional().describe("Number of chats per page (max 100)") },
    handler: async ({ page, per_page }) => {
      try {
        const result = await client.listChats({ page, per_page });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error listing chats: ${error.message}` }], isError: true };
      }
    }
  }
];
