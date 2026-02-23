import { z } from 'zod';

export const usersTools = (client) => [
  {
    name: "list_users",
    description: "List users in Zendesk",
    schema: {
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of users per page (max 100)"),
      role: z.enum(["end-user", "agent", "admin"]).optional().describe("Filter users by role")
    },
    handler: async ({ page, per_page, role }) => {
      try {
        const result = await client.listUsers({ page, per_page, role });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error listing users: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "get_user",
    description: "Get a specific user by ID",
    schema: { id: z.number().describe("User ID") },
    handler: async ({ id }) => {
      try {
        const result = await client.getUser(id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error getting user: ${error.message}` }], isError: true };
      }
    }
  }
];
