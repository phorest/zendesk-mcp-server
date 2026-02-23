import { z } from 'zod';

export const organizationsTools = (client) => [
  {
    name: "list_organizations",
    description: "List organizations in Zendesk",
    schema: { page: z.number().optional().describe("Page number for pagination"), per_page: z.number().optional().describe("Number of organizations per page (max 100)") },
    handler: async ({ page, per_page }) => {
      try {
        const result = await client.listOrganizations({ page, per_page });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error listing organizations: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "get_organization",
    description: "Get a specific organization by ID",
    schema: { id: z.number().describe("Organization ID") },
    handler: async ({ id }) => {
      try {
        const result = await client.getOrganization(id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error getting organization: ${error.message}` }], isError: true };
      }
    }
  }
];
