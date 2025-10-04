'use strict';

const { validateCreateNote, validateUpdateNote } = require('../validation/noteSchemas');
const { createNotesRepository } = require('../repositories/notesRepository');

const repo = createNotesRepository();

/**
 * Build a standard error object used across service and controller
 * @param {number} statusCode
 * @param {string} message
 * @param {any=} details
 * @returns {{ statusCode: number, message: string, details?: any }}
 */
function buildError(statusCode, message, details) {
  const err = new Error(message);
  err.statusCode = statusCode;
  if (details !== undefined) err.details = details;
  return err;
}

/**
 * PUBLIC_INTERFACE
 * list
 * Returns all notes.
 */
async function list() {
  const notes = await repo.listNotes();
  return notes;
}

/**
 * PUBLIC_INTERFACE
 * getById
 * Get a note by id.
 * @param {string} id
 */
async function getById(id) {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw buildError(400, 'Invalid id parameter', [{ path: 'id', message: 'id must be a non-empty string' }]);
  }
  const note = await repo.getNoteById(id);
  if (!note) {
    throw buildError(404, 'Note not found', [{ path: 'id', message: `No note found with id ${id}` }]);
  }
  return note;
}

/**
 * PUBLIC_INTERFACE
 * create
 * Create a new note after validating payload.
 * @param {{ title: string, content: string }} payload
 */
async function create(payload) {
  const { value, error } = validateCreateNote(payload);
  if (error) {
    throw buildError(400, error.message, error.details);
  }
  const created = await repo.createNote(value);
  return created;
}

/**
 * PUBLIC_INTERFACE
 * update
 * Update a note by id after validating payload.
 * @param {string} id
 * @param {{ title?: string, content?: string }} payload
 */
async function update(id, payload) {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw buildError(400, 'Invalid id parameter', [{ path: 'id', message: 'id must be a non-empty string' }]);
  }

  const { value, error } = validateUpdateNote(payload);
  if (error) {
    throw buildError(400, error.message, error.details);
  }

  const updated = await repo.updateNote(id, value);
  if (!updated) {
    throw buildError(404, 'Note not found', [{ path: 'id', message: `No note found with id ${id}` }]);
  }
  return updated;
}

/**
 * PUBLIC_INTERFACE
 * remove
 * Delete a note by id.
 * @param {string} id
 */
async function remove(id) {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw buildError(400, 'Invalid id parameter', [{ path: 'id', message: 'id must be a non-empty string' }]);
  }
  const deleted = await repo.deleteNote(id);
  if (!deleted) {
    throw buildError(404, 'Note not found', [{ path: 'id', message: `No note found with id ${id}` }]);
  }
  return true;
}

module.exports = {
  // PUBLIC_INTERFACE
  /** Return all notes. */
  list,
  // PUBLIC_INTERFACE
  /** Return a note by id or throw 404. */
  getById,
  // PUBLIC_INTERFACE
  /** Create a note from validated payload. */
  create,
  // PUBLIC_INTERFACE
  /** Update a note by id from validated payload. */
  update,
  // PUBLIC_INTERFACE
  /** Remove a note by id. */
  remove,
};
