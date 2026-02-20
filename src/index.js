#!/usr/bin/env node
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from './server.js';
import { ZendeskClient } from './zendesk-client.js';
import express from 'express';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

const app = express();

// Map to track transports and servers by session ID
const sessions = {};

function getCredentials(req) {
  // Try headers first (set by Notion AI or other MCP clients)
  const subdomain = req.headers['x-zendesk-subdomain'] || process.env.ZENDESK_SUBDOMAIN;
  const email = req.headers['x-zendesk-email'] || process.env.ZENDESK_EMAIL;
  const apiToken = req.headers['x-zendesk-api-token'] || process.env.ZENDESK_API_TOKEN;

  if (!subdomain || !email || !apiToken) {
    return null;
  }

  return { subdomain, email, apiToken };
}

app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'];

  if (sessionId && sessions[sessionId]) {
    await sessions[sessionId].transport.handleRequest(req, res);
    return;
  }

  // New session - extract credentials from headers
  const credentials = getCredentials(req);
  if (!credentials) {
    res.status(401).json({
      error: 'Missing Zendesk credentials. Set headers: x-zendesk-subdomain, x-zendesk-email, x-zendesk-api-token'
    });
    return;
  }

  const id = randomUUID();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => id,
  });

  const client = new ZendeskClient(credentials);
  const server = createServer(client);

  transport.onclose = () => {
    if (sessions[id]) {
      delete sessions[id];
    }
  };

  await server.connect(transport);
  sessions[id] = { transport, server };

  await transport.handleRequest(req, res);
});

app.get('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'];
  if (sessionId && sessions[sessionId]) {
    await sessions[sessionId].transport.handleRequest(req, res);
    return;
  }
  res.status(400).json({ error: 'No active session. Send a POST to /mcp first.' });
});

app.delete('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'];
  if (sessionId && sessions[sessionId]) {
    await sessions[sessionId].transport.handleRequest(req, res);
    return;
  }
  res.status(400).json({ error: 'No active session.' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Zendesk MCP server running on port ${PORT}`);
});
