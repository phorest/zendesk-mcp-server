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

const ZENDESK_SUBDOMAIN = 'phorest';

function getCredentials(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null;
  }

  const decoded = Buffer.from(authHeader.slice(6), 'base64').toString();
  const [email, apiToken] = decoded.split(':');

  if (!email || !apiToken) {
    return null;
  }

  return { subdomain: ZENDESK_SUBDOMAIN, email, apiToken };
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
      error: 'Missing credentials. Send Authorization: Basic base64(email:api-token)'
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
