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
  },
  {
    name: "create_organization",
    description: "Create a new organization",
    schema: {
      name: z.string().describe("Organization name"),
      domain_names: z.array(z.string()).optional().describe("Domain names"),
      details: z.string().optional().describe("Details"),
      notes: z.string().optional().describe("Notes"),
      tags: z.array(z.string()).optional().describe("Tags")
    },
    handler: async ({ name, domain_names, details, notes, tags }) => {
      try {
        const result = await client.createOrganization({ name, domain_names, details, notes, tags });
        return { content: [{ type: "text", text: `Organization created successfully!\n\n${JSON.stringify(result, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error creating organization: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "update_organization",
    description: "Update an existing organization",
    schema: {
      id: z.number().describe("Organization ID to update"),
      name: z.string().optional().describe("Updated name"),
      domain_names: z.array(z.string()).optional().describe("Updated domain names"),
      details: z.string().optional().describe("Updated details"),
      notes: z.string().optional().describe("Updated notes"),
      tags: z.array(z.string()).optional().describe("Updated tags")
    },
    handler: async ({ id, name, domain_names, details, notes, tags }) => {
      try {
        const orgData = {};
        if (name !== undefined) orgData.name = name;
        if (domain_names !== undefined) orgData.domain_names = domain_names;
        if (details !== undefined) orgData.details = details;
        if (notes !== undefined) orgData.notes = notes;
        if (tags !== undefined) orgData.tags = tags;
        const result = await client.updateOrganization(id, orgData);
        return { content: [{ type: "text", text: `Organization updated successfully!\n\n${JSON.stringify(result, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error updating organization: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "delete_organization",
    description: "Delete an organization",
    schema: { id: z.number().describe("Organization ID to delete") },
    handler: async ({ id }) => {
      try {
        await client.deleteOrganization(id);
        return { content: [{ type: "text", text: `Organization ${id} deleted successfully!` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error deleting organization: ${error.message}` }], isError: true };
      }
    }
  }
];
