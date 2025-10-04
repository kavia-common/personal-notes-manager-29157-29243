'use strict';

/**
 * Configuration loader for the Notes backend.
 * - Reads environment variables via process.env
 * - Provides safe defaults to avoid breaking preview environments
 * - Does not start/alter server port/host behavior
 *
 * Environment variables:
 *  - DB_URL: optional connection URL for an external DB (e.g., MongoDB)
 *  - DB_NAME: optional database name
 *  - DB_COLLECTION: optional collection/table name for notes
 *  - NODE_ENV: standard env, defaults to 'development'
 */

require('dotenv').config(); // Load .env if present (no-op if not)

/**
 * PUBLIC_INTERFACE
 * getConfig
 * Returns the unified application configuration derived from environment variables.
 * Safe defaults ensure the app runs without an external DB.
 */
function getConfig() {
  const {
    DB_URL = '',
    DB_NAME = '',
    DB_COLLECTION = '',
    NODE_ENV = 'development',
  } = process.env;

  // Storage mode: if DB_URL present, prefer 'db'; otherwise 'memory'
  const storageMode = DB_URL ? 'db' : 'memory';

  return {
    env: NODE_ENV,
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
