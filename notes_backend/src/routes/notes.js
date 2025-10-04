'use strict';

const express = require('express');
const {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/notes');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       description: A note item
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the note
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         title:
 *           type: string
 *           description: Title of the note
 *           example: "Meeting Notes"
 *         content:
 *           type: string
 *           description: Content/body of the note
 *           example: "Discuss Q3 roadmap and milestones."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *           example: "2024-01-01T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last updated timestamp
 *           example: "2024-01-01T12:30:00.000Z"
 *   responses:
 *     ErrorResponse:
 *       description: Error response envelope
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "error"
 *               message:
 *                 type: string
 *                 example: "Invalid request body for creating note"
 *               details:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     path:
 *                       type: string
 *                       example: "title"
 *                     message:
 *                       type: string
 *                       example: "title is required"
 */

/**
 * @swagger
 * tags:
 *   - name: Notes
 *     description: Endpoints for managing notes
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: List notes
 *     description: Retrieve all notes.
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: List of notes returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 */
router.get('/', async (req, res, next) => {
  return listNotes(req, res, next);
});

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get note by ID
 *     description: Retrieve a single note by its ID.
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The note ID
 *     responses:
 *       200:
 *         description: Note found and returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         $ref: '#/components/responses/ErrorResponse'
 *       404:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get('/:id', async (req, res, next) => {
  return getNote(req, res, next);
});

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a note
 *     description: Create a new note with title and content.
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Idea"
 *               content:
 *                 type: string
 *                 example: "Explore integrations with service X."
 *     responses:
 *       201:
 *         description: Note created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.post('/', async (req, res, next) => {
  return createNote(req, res, next);
});

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note
 *     description: Update an existing note by ID (title and/or content).
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Title"
 *               content:
 *                 type: string
 *                 example: "Updated note content."
 *     responses:
 *       200:
 *         description: Note updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         $ref: '#/components/responses/ErrorResponse'
 *       404:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.put('/:id', async (req, res, next) => {
  return updateNote(req, res, next);
});

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     description: Delete a note by its ID.
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The note ID
 *     responses:
 *       204:
 *         description: Note deleted successfully (no content).
 *       400:
 *         $ref: '#/components/responses/ErrorResponse'
 *       404:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.delete('/:id', async (req, res, next) => {
  return deleteNote(req, res, next);
});

module.exports = router;
