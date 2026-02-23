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
  }
];
