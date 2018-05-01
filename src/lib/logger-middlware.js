'use strict';

import logger from './logger';

export default (request, response, next) => {
  logger.log(logger.INFO, `Processing a ${request.method} on ${request.url}`);
  return next(); // make sure to call next() as this is another link in the chain.
};
