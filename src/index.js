#!/usr/bin/env node
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from './server.js';
import express from 'express';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

const app = express();

// Map to track transports and servers by session ID
const sessions = {};

app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'];

  if (sessionId && sessions[sessionId]) {
    await sessions[sessionId].transport.handleRequest(req, res);
    return;
  }

  // New session - generate ID upfront so we can store before handleRequest
  const id = randomUUID();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => id,
  });

  const server = createServer();

  transport.onclose = () => {
    if (sessions[id]) {
      delete sessions[id];
    }
  };

  await server.connect(transport);

  // Store session before handling request (handleRequest may keep connection open for SSE)
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
