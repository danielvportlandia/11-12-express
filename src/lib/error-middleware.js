'use strict';

import logger from './logger';

export default (error, request, response, next) => { // eslint-disable-line no-unused-vars
  logger.log(logger.ERROR, '__ERROR_MIDDLEWARE__');
  logger.log(logger.ERROR, error);
  // I know I might have the property error.status
  if (error.status) {
    logger.log(logger.INFO, `Responding with a ${error.status} code and message ${error.message}.`);
    return response.sendStatus(error.status);
  }
  // ----------------------------------------------------
  // I know that if we are here, it's another type or error 
  // (e.g. internal express or node errors etc)
  const errorMessage = error.message.toLowerCase();
  if (errorMessage.includes('objectid failed')) {
    logger.log(logger.INFO, 'Responding with a 404 status code.');
    return response.sendStatus(404);
  }
  if (errorMessage.includes('validation failed')) {
    logger.log(logger.INFO, 'Responding with a 400 status code.');
    return response.sendStatus(400);
  }
  if (errorMessage.includes('duplicate key')) {
    logger.log(logger.INFO, 'Responding with a 409 status code.');
    return response.sendStatus(409);
  }
  if (errorMessage.includes('unauthorized')) {
    logger.log(logger.INFO, 'Responding with a 401 status code.');
    return response.sendStatus(401);
  }
  // ---------------------------------------------------------------------------------------------
  logger.log(logger.ERROR, 'Responding with a 500 error code.');
  logger.log(logger.ERROR, error.message);
  return response.sendStatus(500);
};
