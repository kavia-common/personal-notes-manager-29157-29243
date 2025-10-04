'use strict';

const crypto = require('crypto');

/**
 * Minimal DB client that supports two modes:
 *  - 'memory': in-memory Map keyed by id
 *  - 'db': placeholder external DB client using provided connection values
 *
 * The interface implemented here is intentionally minimal and focused on
 * what the notes repository needs: basic CRUD operations.
 *
 * Design:
 *  - Memory store uses a Map<string, Note>
 *  - DB mode is a thin placeholder with the same API shape so it can be
 *    expanded later without changing repository code.
 */

/**
 * Generate a UUID v4 in environments where crypto.randomUUID may not be available.
 */
function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  // Fallback v4
  return ([1e7]+-1e3+-4e3+-8e3+-1e11)
    .replace(/[018]/g, c =>
      (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
    );
}

/**
 * PUBLIC_INTERFACE
 * createDbClient
 * Factory that returns a storage client implementing:
 *  - list()
 *  - getById(id)
 *  - insert(entity) -> returns inserted entity (with id)
 *  - update(id, changes) -> returns updated entity
 *  - remove(id) -> returns boolean (true if deleted)
 *
 * @param {{ mode: 'memory' | 'db', dbUrl?: string, dbName?: string, notesCollection?: string }} config
 * @returns {Object} storage client with async methods
 */
function createDbClient(config) {
  const mode = (config && config.mode) || 'memory';

  if (mode === 'db') {
    // Placeholder DB-backed implementation. The code is structured to be easily
    // enhanced later (e.g., with MongoDB driver). For now, it falls back to memory
    // while preserving the external API and not crashing when DB vars are set.
    console.warn('[db] External DB mode selected, but no real DB driver is configured. Falling back to in-memory for now.');
  }

  // In-memory implementation
  const store = new Map(); // id -> entity

  return {
    async list() {
      return Array.from(store.values());
    },

    async getById(id) {
      if (!id || typeof id !== 'string') return null;
      return store.get(id) || null;
    },

    async insert(entity) {
      // Ensure id exists
      const id = entity.id && typeof entity.id === 'string' ? entity.id : uuid();
      const now = new Date().toISOString();
      const toSave = {
        ...entity,
        id,
        createdAt: entity.createdAt || now,
        updatedAt: entity.updatedAt || now,
      };
      store.set(id, toSave);
      return toSave;
    },

    async update(id, changes) {
      if (!id || typeof id !== 'string') return null;
      const existing = store.get(id);
      if (!existing) return null;

      const updated = {
        ...existing,
        ...changes,
        id: existing.id, // never change id
        createdAt: existing.createdAt, // preserve createdAt
        updatedAt: new Date().toISOString(),
      };
      store.set(id, updated);
      return updated;
    },

    async remove(id) {
      if (!id || typeof id !== 'string') return false;
      return store.delete(id);
    },
  };
}

module.exports = {
  createDbClient,
};
