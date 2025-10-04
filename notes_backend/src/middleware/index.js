'use strict';

const { validate } = require('./validation');
const { errorHandler } = require('./error');

// This file exports middleware as the application grows
module.exports = {
  validate,
  errorHandler,
};
