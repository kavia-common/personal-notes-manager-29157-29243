'use strict';

/**
 * Validation middleware factory.
 * Accepts a schema-like object with a validate(payload) -> { value, error } function.
 * On success: attaches sanitized value to req.body and calls next().
 * On failure: throws a 400 error with details, respecting our error handler shape.
 *
 * Example schema interface (already used in this project):
 *  const { value, error } = validateCreateNote(payload);
 */

// PUBLIC_INTERFACE
function validate(schema) {
  /** Middleware that validates req.body using the provided schema. */
  return (req, res, next) => {
    try {
      if (!schema || typeof schema !== 'function') {
        const err = new Error('Validation schema is not a function');
        err.statusCode = 500;
        return next(err);
      }

      const { value, error } = schema(req.body);

      if (error) {
        const err = new Error(error.message || 'Invalid request body');
        err.statusCode = 400;
        if (error.details !== undefined) err.details = error.details;
        return next(err);
      }

      // Attach sanitized value for downstream handlers
      req.body = value;
      return next();
    } catch (e) {
      return next(e);
    }
  };
}

module.exports = {
  validate,
};
