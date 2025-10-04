'use strict';

/**
 * Configuration loader for the Notes backend.
 * - Reads environment variables via process.env
 * - Provides safe defaults to avoid breaking preview environments
 * - Does not start/alter server port/host behavior
 *
 * Environment variables:
 *  - PORT: optional server port (server.js still controls binding; default remains 3000)
 *  - DB_URL: optional connection URL for an external DB (e.g., MongoDB)
 *  - DB_NAME: optional database name
 *  - DB_COLLECTION: optional collection/table name for notes
 *  - NODE_ENV: standard env, defaults to 'development'
 */

// Load .env if present (no-op if file doesn't exist). This preserves preview defaults.
try {
  require('dotenv').config();
} catch (_) {
  // dotenv not installed or other non-fatal error; ignore to keep runtime resilient
}

/**
 * PUBLIC_INTERFACE
 * getConfig
 * Returns the unified application configuration derived from environment variables.
 * Safe defaults ensure the app runs without an external DB and do not change preview port mappings.
 */
function getConfig() {
  const {
    PORT, // read but do not enforce; server.js already has safe default
    DB_URL = '',
    DB_NAME = '',
    DB_COLLECTION = '',
    NODE_ENV = 'development',
  } = process.env;

  // Storage mode: if DB_URL present, prefer 'db'; otherwise 'memory'
  const storageMode = DB_URL ? 'db' : 'memory';

  return {
    env: NODE_ENV,
    // Surface the port value for observability/config docs only; server.js controls binding default (3000).
    server: {
      port: PORT ? Number(PORT) : undefined,
    },
    storage: {
      mode: storageMode,
      dbUrl: DB_URL,
      dbName: DB_NAME || 'notes_app',
      notesCollection: DB_COLLECTION || 'notes',
    },
  };
}

module.exports = {
  getConfig,
};
