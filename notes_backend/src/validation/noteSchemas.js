'use strict';

/**
 * Lightweight validation helpers for Note create/update payloads.
 * No external dependencies; designed to produce { value, error } similar to Joi.
 * Error object shape:
 *   { message: string, details: Array<{ path: string, message: string }> }
 */

// Helper: check if a value is a string
function isString(v) {
  return typeof v === 'string' || v instanceof String;
}

// Helper: safe trim (only trim strings)
function trimIfString(v) {
  return isString(v) ? v.trim() : v;
}

// Helper: build error response
function buildError(message, details) {
  return { message, details };
}

// Helper: common string validations
function validateStringField({ key, value, required, max }) {
  const details = [];
  const hasValue = value !== undefined && value !== null;

  if (required && !hasValue) {
    details.push({ path: key, message: `${key} is required` });
    return details;
  }

  if (!hasValue) {
    return details; // optional and not provided
  }

  if (!isString(value)) {
    details.push({ path: key, message: `${key} must be a string` });
    return details;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    details.push({ path: key, message: `${key} cannot be empty` });
    return details;
  }

  if (typeof max === 'number' && trimmed.length > max) {
    details.push({ path: key, message: `${key} must be at most ${max} characters` });
  }

  return details;
}

/**
 * PUBLIC_INTERFACE
 * validateCreateNote
 * Validate incoming payload for creating a note.
 * Rules:
 *  - title: required, non-empty string, max 200
 *  - content: required, non-empty string, max 10000
 *  - Strip id/createdAt/updatedAt if provided
 *  - Normalize whitespace via trim()
 * Returns: { value, error }
 */
function validateCreateNote(payload) {
  const p = payload && typeof payload === 'object' ? payload : {};

  const errors = [
    ...validateStringField({ key: 'title', value: p.title, required: true, max: 200 }),
    ...validateStringField({ key: 'content', value: p.content, required: true, max: 10000 }),
  ];

  if (errors.length > 0) {
    return {
      value: null,
      error: buildError('Invalid request body for creating note', errors),
    };
  }

  const value = {
    title: trimIfString(p.title),
    content: trimIfString(p.content),
    // immutable/ignored fields are stripped
  };

  return { value, error: null };
}

/**
 * PUBLIC_INTERFACE
 * validateUpdateNote
 * Validate incoming payload for updating a note.
 * Rules:
 *  - title/content are optional with same constraints as create
 *  - At least one of title or content must be provided
 *  - Strip immutable fields (id, createdAt, updatedAt)
 *  - Do not supply defaults; only pass through provided valid fields
 * Returns: { value, error }
 */
function validateUpdateNote(payload) {
  const p = payload && typeof payload === 'object' ? payload : {};

  const hasTitle = Object.prototype.hasOwnProperty.call(p, 'title');
  const hasContent = Object.prototype.hasOwnProperty.call(p, 'content');

  if (!hasTitle && !hasContent) {
    return {
      value: null,
      error: buildError('At least one of title or content must be provided', [
        { path: 'title', message: 'title is optional but required if content is missing' },
        { path: 'content', message: 'content is optional but required if title is missing' },
      ]),
    };
  }

  const errors = [];
  if (hasTitle) {
    errors.push(...validateStringField({ key: 'title', value: p.title, required: false, max: 200 }));
  }
  if (hasContent) {
    errors.push(
      ...validateStringField({ key: 'content', value: p.content, required: false, max: 10000 })
    );
  }

  if (errors.length > 0) {
    return {
      value: null,
      error: buildError('Invalid request body for updating note', errors),
    };
  }

  const value = {};
  if (hasTitle) value.title = trimIfString(p.title);
  if (hasContent) value.content = trimIfString(p.content);

  // immutable/ignored fields are stripped by omission

  return { value, error: null };
}

module.exports = {
  validateCreateNote,
  validateUpdateNote,
};
