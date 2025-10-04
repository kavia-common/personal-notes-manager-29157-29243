'use strict';

const notesService = require('../services/notes');

/**
 * PUBLIC_INTERFACE
 * listNotes
 * Express handler to list notes.
 * Success: 200 { status: 'success', data: [...] }
 * Errors: delegated to next(err)
 */
async function listNotes(req, res, next) {
  try {
    const data = await notesService.list();
    return res.status(200).json({ status: 'success', data });
  } catch (err) {
    return next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * getNote
 * Express handler to get a note by id.
 * - 200 on success
 * - 400 for validation (bad id)
 * - 404 if not found
 */
async function getNote(req, res, next) {
  try {
    const note = await notesService.getById(req.params.id);
    return res.status(200).json({ status: 'success', data: note });
  } catch (err) {
    return next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * createNote
 * Express handler to create a note.
 * - 201 on success
 * - 400 for validation errors
 */
async function createNote(req, res, next) {
  try {
    const created = await notesService.create(req.body);
    return res.status(201).json({ status: 'success', data: created });
  } catch (err) {
    return next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * updateNote
 * Express handler to update a note.
 * - 200 on success
 * - 400 for validation errors (id or body)
 * - 404 if not found
 */
async function updateNote(req, res, next) {
  try {
    const updated = await notesService.update(req.params.id, req.body);
    return res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    return next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * deleteNote
 * Express handler to delete a note.
 * - 204 on success (no content)
 * - 400 for invalid id
 * - 404 if not found
 */
async function deleteNote(req, res, next) {
  try {
    await notesService.remove(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  // PUBLIC_INTERFACE
  /** List all notes. */
  listNotes,
  // PUBLIC_INTERFACE
  /** Get a single note by id. */
  getNote,
  // PUBLIC_INTERFACE
  /** Create a new note. */
  createNote,
  // PUBLIC_INTERFACE
  /** Update an existing note by id. */
  updateNote,
  // PUBLIC_INTERFACE
  /** Delete a note by id. */
  deleteNote,
};
