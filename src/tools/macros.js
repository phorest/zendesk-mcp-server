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
  },
  {
    name: "create_macro",
    description: "Create a new macro",
    schema: {
      title: z.string().describe("Macro title"),
      description: z.string().optional().describe("Macro description"),
      actions: z.array(z.object({ field: z.string(), value: z.any() })).describe("Actions to perform")
    },
    handler: async ({ title, description, actions }) => {
      try {
        const result = await client.createMacro({ title, description, actions });
        return { content: [{ type: "text", text: `Macro created successfully!\n\n${JSON.stringify(result, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error creating macro: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "update_macro",
    description: "Update an existing macro",
    schema: {
      id: z.number().describe("Macro ID to update"),
      title: z.string().optional().describe("Updated title"),
      description: z.string().optional().describe("Updated description"),
      actions: z.array(z.object({ field: z.string(), value: z.any() })).optional().describe("Updated actions")
    },
    handler: async ({ id, title, description, actions }) => {
      try {
        const macroData = {};
        if (title !== undefined) macroData.title = title;
        if (description !== undefined) macroData.description = description;
        if (actions !== undefined) macroData.actions = actions;
        const result = await client.updateMacro(id, macroData);
        return { content: [{ type: "text", text: `Macro updated successfully!\n\n${JSON.stringify(result, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error updating macro: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "delete_macro",
    description: "Delete a macro",
    schema: { id: z.number().describe("Macro ID to delete") },
    handler: async ({ id }) => {
      try {
        await client.deleteMacro(id);
        return { content: [{ type: "text", text: `Macro ${id} deleted successfully!` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error deleting macro: ${error.message}` }], isError: true };
      }
    }
  }
];
