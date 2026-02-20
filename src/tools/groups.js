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
  },
  {
    name: "create_group",
    description: "Create a new agent group",
    schema: { name: z.string().describe("Group name"), description: z.string().optional().describe("Group description") },
    handler: async ({ name, description }) => {
      try {
        const result = await client.createGroup({ name, description });
        return { content: [{ type: "text", text: `Group created successfully!\n\n${JSON.stringify(result, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error creating group: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "update_group",
    description: "Update an existing group",
    schema: { id: z.number().describe("Group ID to update"), name: z.string().optional().describe("Updated name"), description: z.string().optional().describe("Updated description") },
    handler: async ({ id, name, description }) => {
      try {
        const groupData = {};
        if (name !== undefined) groupData.name = name;
        if (description !== undefined) groupData.description = description;
        const result = await client.updateGroup(id, groupData);
        return { content: [{ type: "text", text: `Group updated successfully!\n\n${JSON.stringify(result, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error updating group: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "delete_group",
    description: "Delete a group",
    schema: { id: z.number().describe("Group ID to delete") },
    handler: async ({ id }) => {
      try {
        await client.deleteGroup(id);
        return { content: [{ type: "text", text: `Group ${id} deleted successfully!` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error deleting group: ${error.message}` }], isError: true };
      }
    }
  }
];
