/**
 * Async handler middleware
 * Wraps async route handlers to catch exceptions and pass them to next()
 * Eliminates the need for try/catch blocks in controllers
 */
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler; 