import { z } from 'zod';

export const helpCenterTools = (client) => [
  {
    name: "list_articles",
    description: "List Help Center articles",
    schema: {
      page: z.number().optional().describe("Page number for pagination"),
      per_page: z.number().optional().describe("Number of articles per page (max 100)"),
      sort_by: z.string().optional().describe("Field to sort by"),
      sort_order: z.enum(["asc", "desc"]).optional().describe("Sort order")
    },
    handler: async ({ page, per_page, sort_by, sort_order }) => {
      try {
        const result = await client.listArticles({ page, per_page, sort_by, sort_order });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error listing articles: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "get_article",
    description: "Get a specific Help Center article by ID",
    schema: { id: z.number().describe("Article ID") },
    handler: async ({ id }) => {
      try {
        const result = await client.getArticle(id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error getting article: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "create_article",
    description: "Create a new Help Center article",
    schema: {
      title: z.string().describe("Article title"),
      body: z.string().describe("Article body content (HTML)"),
      section_id: z.number().describe("Section ID"),
      locale: z.string().optional().describe("Locale (e.g., 'en-us')"),
      draft: z.boolean().optional().describe("Whether the article is a draft"),
      permission_group_id: z.number().optional().describe("Permission group ID"),
      user_segment_id: z.number().optional().describe("User segment ID"),
      label_names: z.array(z.string()).optional().describe("Labels")
    },
    handler: async ({ title, body, section_id, locale, draft, permission_group_id, user_segment_id, label_names }) => {
      try {
        const result = await client.createArticle({ title, body, locale, draft, permission_group_id, user_segment_id, label_names }, section_id);
        return { content: [{ type: "text", text: `Article created successfully!\n\n${JSON.stringify(result, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error creating article: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "update_article",
    description: "Update an existing Help Center article",
    schema: {
      id: z.number().describe("Article ID to update"),
      title: z.string().optional().describe("Updated title"),
      body: z.string().optional().describe("Updated body (HTML)"),
      locale: z.string().optional().describe("Updated locale"),
      draft: z.boolean().optional().describe("Draft status"),
      permission_group_id: z.number().optional().describe("Updated permission group ID"),
      user_segment_id: z.number().optional().describe("Updated user segment ID"),
      label_names: z.array(z.string()).optional().describe("Updated labels")
    },
    handler: async ({ id, title, body, locale, draft, permission_group_id, user_segment_id, label_names }) => {
      try {
        const articleData = {};
        if (title !== undefined) articleData.title = title;
        if (body !== undefined) articleData.body = body;
        if (locale !== undefined) articleData.locale = locale;
        if (draft !== undefined) articleData.draft = draft;
        if (permission_group_id !== undefined) articleData.permission_group_id = permission_group_id;
        if (user_segment_id !== undefined) articleData.user_segment_id = user_segment_id;
        if (label_names !== undefined) articleData.label_names = label_names;
        const result = await client.updateArticle(id, articleData);
        return { content: [{ type: "text", text: `Article updated successfully!\n\n${JSON.stringify(result, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error updating article: ${error.message}` }], isError: true };
      }
    }
  },
  {
    name: "delete_article",
    description: "Delete a Help Center article",
    schema: { id: z.number().describe("Article ID to delete") },
    handler: async ({ id }) => {
      try {
        await client.deleteArticle(id);
        return { content: [{ type: "text", text: `Article ${id} deleted successfully!` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error deleting article: ${error.message}` }], isError: true };
      }
    }
  }
];
