'use strict';

/**
 * Note domain model factory.
 * Creates a normalized Note object without binding to a specific database ID type.
 * Fields:
 *  - id: string | undefined (not set by factory unless provided)
 *  - title: string (required)
 *  - content: string (required)
 *  - createdAt: ISO string
 *  - updatedAt: ISO string
 */

/**
 * Normalize a value to a trimmed string.
 * When value is null/undefined, returns empty string.
 * @param {any} v
 * @returns {string}
 */
function toTrimmedString(v) {
  if (typeof v !== 'string') return '';
  return v.trim();
}

/**
 * PUBLIC_INTERFACE
 * createNote
 * Create a Note domain entity. This is a simple factory that normalizes fields
 * and sets createdAt/updatedAt timestamps when not provided.
 * @param {Object} params
 * @param {string=} params.id - Optional id as string; not enforced to any DB type.
 * @param {string} params.title - Note title (will be trimmed).
 * @param {string} params.content - Note content (will be trimmed).
 * @param {string=} params.createdAt - ISO timestamp string.
 * @param {string=} params.updatedAt - ISO timestamp string.
 * @returns {Object} Note object
 */
function createNote(params) {
  const nowIso = new Date().toISOString();

  const title = toTrimmedString(params && params.title);
  const content = toTrimmedString(params && params.content);

  // Allow id to be optional and remain a string if provided
  const id = params && typeof params.id === 'string' ? params.id : undefined;

  const createdAt =
    params && typeof params.createdAt === 'string' && params.createdAt.trim()
      ? params.createdAt
      : nowIso;

  const updatedAt =
    params && typeof params.updatedAt === 'string' && params.updatedAt.trim()
      ? params.updatedAt
      : nowIso;

  return {
    id,
    title,
    content,
    createdAt,
    updatedAt,
  };
}

module.exports = {
  // PUBLIC_INTERFACE
  /**
   * Factory function to create a new Note domain object.
   * Returns a plain object with normalized fields and timestamps.
   */
  createNote,
};
