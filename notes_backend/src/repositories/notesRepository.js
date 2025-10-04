'use strict';

const { getConfig } = require('../config');
const { createDbClient } = require('../db/client');
const { createNote } = require('../models/note');

/**
 * Notes Repository
 * Exposes CRUD operations for Note entities with storage-agnostic interface.
 * Storage selection is config-driven (env). Defaults to in-memory.
 *
 * Methods:
 *  - listNotes()
 *  - getNoteById(id)
 *  - createNote(data)
 *  - updateNote(id, changes)
 *  - deleteNote(id)
 */

/**
 * Map a raw record into the Note domain shape. Since we operate on plain objects,
 * we ensure required fields are present and normalized via the domain factory.
 */
function toDomainNote(raw) {
  if (!raw) return null;
  return createNote({
    id: raw.id,
    title: raw.title,
    content: raw.content,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  });
}

/**
 * PUBLIC_INTERFACE
 * createNotesRepository
 * Factory that creates a repository instance bound to the selected storage.
 * @returns {Object} repository with async methods
 */
function createNotesRepository() {
  const cfg = getConfig();
  const storage = createDbClient(cfg.storage);

  return {
    /**
     * PUBLIC_INTERFACE
     * listNotes
     * Returns an array of Note objects.
     */
    async listNotes() {
      const items = await storage.list();
      return items.map(toDomainNote);
    },

    /**
     * PUBLIC_INTERFACE
     * getNoteById
     * @param {string} id
     * @returns {Object|null} Note or null if not found
     */
    async getNoteById(id) {
      const item = await storage.getById(id);
      return toDomainNote(item);
    },

    /**
     * PUBLIC_INTERFACE
     * createNote
     * @param {{ title: string, content: string }} data
     * @returns {Object} Created Note
     */
    async createNote(data) {
      // Use domain factory to normalize fields and timestamps
      const note = createNote({
        title: data.title,
        content: data.content,
      });
      const saved = await storage.insert(note);
      return toDomainNote(saved);
    },

    /**
     * PUBLIC_INTERFACE
     * updateNote
     * @param {string} id
     * @param {{ title?: string, content?: string }} changes
     * @returns {Object|null} Updated Note or null if not found
     */
    async updateNote(id, changes) {
      const updatePayload = {};
      if (Object.prototype.hasOwnProperty.call(changes, 'title')) {
        updatePayload.title = typeof changes.title === 'string' ? changes.title.trim() : changes.title;
      }
      if (Object.prototype.hasOwnProperty.call(changes, 'content')) {
        updatePayload.content = typeof changes.content === 'string' ? changes.content.trim() : changes.content;
      }

      const updated = await storage.update(id, updatePayload);
      return toDomainNote(updated);
    },

    /**
     * PUBLIC_INTERFACE
     * deleteNote
     * @param {string} id
     * @returns {boolean} true if deleted, false otherwise
     */
    async deleteNote(id) {
      return storage.remove(id);
    },
  };
}

module.exports = {
  createNotesRepository,
};
