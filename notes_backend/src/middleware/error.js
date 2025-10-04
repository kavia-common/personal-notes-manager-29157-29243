'use strict';

/**
 * Centralized error handler middleware.
 * Produces a JSON response:
 *  { status: 'error', message, details? }
 * - Respects error.statusCode if provided; defaults to 500.
 * - Hides stack for 500 but leaves message and optional details when provided.
 */

// PUBLIC_INTERFACE
function errorHandler(err, req, res, next) {
  // If headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  const status = (err && typeof err.statusCode === 'number') ? err.statusCode : 500;

  // Build response envelope
  const response = {
    status: 'error',
    message: (err && err.message) ? err.message : 'Internal Server Error',
  };

  // Only include details if explicitly provided on error
  if (err && err.details !== undefined) {
    response.details = err.details;
  }

  // Log error for diagnostics (avoid leaking stack in response)
  // Prefer concise logs in production; include stack for local debugging
  const isProd = (process.env.NODE_ENV || 'development') === 'production';
  if (!isProd) {
    console.error(err && err.stack ? err.stack : err);
  } else {
    console.error(err && err.message ? err.message : 'Unhandled error');
  }

  return res.status(status).json(response);
}

module.exports = {
  errorHandler,
};
