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
  },
  {
    name: "create_view",
    description: "Create a new view",
    schema: {
      title: z.string().describe("View title"),
      description: z.string().optional().describe("View description"),
      conditions: z.object({
        all: z.array(z.object({ field: z.string(), operator: z.string(), value: z.any() })).optional(),
        any: z.array(z.object({ field: z.string(), operator: z.string(), value: z.any() })).optional()
      }).describe("Conditions for the view")
    },
    handler: async ({ title, description, conditions }) => {
      try {
        const result = await client.createView({ title, description, conditions });
        return { content: [{ type: "text", text: `View created successfully!\n\n${JSON.stringify(result, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error creating view: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "update_view",
    description: "Update an existing view",
    schema: {
      id: z.number().describe("View ID to update"),
      title: z.string().optional().describe("Updated title"),
      description: z.string().optional().describe("Updated description"),
      conditions: z.object({
        all: z.array(z.object({ field: z.string(), operator: z.string(), value: z.any() })).optional(),
        any: z.array(z.object({ field: z.string(), operator: z.string(), value: z.any() })).optional()
      }).optional().describe("Updated conditions")
    },
    handler: async ({ id, title, description, conditions }) => {
      try {
        const viewData = {};
        if (title !== undefined) viewData.title = title;
        if (description !== undefined) viewData.description = description;
        if (conditions !== undefined) viewData.conditions = conditions;
        const result = await client.updateView(id, viewData);
        return { content: [{ type: "text", text: `View updated successfully!\n\n${JSON.stringify(result, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error updating view: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "delete_view",
    description: "Delete a view",
    schema: { id: z.number().describe("View ID to delete") },
    handler: async ({ id }) => {
      try {
        await client.deleteView(id);
        return { content: [{ type: "text", text: `View ${id} deleted successfully!` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error deleting view: ${error.message}` }], isError: true };
      }
    }
  }
];
