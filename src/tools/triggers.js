import { z } from 'zod';

export const triggersTools = (client) => [
  {
    name: "list_triggers",
    description: "List triggers in Zendesk",
    schema: { page: z.number().optional().describe("Page number for pagination"), per_page: z.number().optional().describe("Number of triggers per page (max 100)") },
    handler: async ({ page, per_page }) => {
      try {
        const result = await client.listTriggers({ page, per_page });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error listing triggers: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "get_trigger",
    description: "Get a specific trigger by ID",
    schema: { id: z.number().describe("Trigger ID") },
    handler: async ({ id }) => {
      try {
        const result = await client.getTrigger(id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error getting trigger: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "create_trigger",
    description: "Create a new trigger",
    schema: {
      title: z.string().describe("Trigger title"),
      description: z.string().optional().describe("Trigger description"),
      conditions: z.object({
        all: z.array(z.object({ field: z.string(), operator: z.string(), value: z.any() })).optional(),
        any: z.array(z.object({ field: z.string(), operator: z.string(), value: z.any() })).optional()
      }).describe("Conditions"),
      actions: z.array(z.object({ field: z.string(), value: z.any() })).describe("Actions to perform")
    },
    handler: async ({ title, description, conditions, actions }) => {
      try {
        const result = await client.createTrigger({ title, description, conditions, actions });
        return { content: [{ type: "text", text: `Trigger created successfully!\n\n${JSON.stringify(result, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error creating trigger: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "update_trigger",
    description: "Update an existing trigger",
    schema: {
      id: z.number().describe("Trigger ID to update"),
      title: z.string().optional().describe("Updated title"),
      description: z.string().optional().describe("Updated description"),
      conditions: z.object({
        all: z.array(z.object({ field: z.string(), operator: z.string(), value: z.any() })).optional(),
        any: z.array(z.object({ field: z.string(), operator: z.string(), value: z.any() })).optional()
      }).optional().describe("Updated conditions"),
      actions: z.array(z.object({ field: z.string(), value: z.any() })).optional().describe("Updated actions")
    },
    handler: async ({ id, title, description, conditions, actions }) => {
      try {
        const triggerData = {};
        if (title !== undefined) triggerData.title = title;
        if (description !== undefined) triggerData.description = description;
        if (conditions !== undefined) triggerData.conditions = conditions;
        if (actions !== undefined) triggerData.actions = actions;
        const result = await client.updateTrigger(id, triggerData);
        return { content: [{ type: "text", text: `Trigger updated successfully!\n\n${JSON.stringify(result, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error updating trigger: ${error.message}` }], isError: true };
      }
    }
  }
];
