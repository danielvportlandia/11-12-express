'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import User from '../model/user';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const userRouter = new Router();

userRouter.post('/api/users', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.name || !request.body.location) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return response.sendStatus(400);
  }
  return new User(request.body).save()
    .then((user) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(user);
    })
    .catch((error) => {
      logger.log(logger.ERROR, '__POST_ERROR__');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});


userRouter.get('/api/users/:id', (request, response) => {
  logger.log(logger.INFO, 'GET - processing a request');

  return User.findById(request.params.id)
    .then((user) => { // Vinicio - user found OR user not found, but the id looks good
      if (!user) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!user)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(user);
    })
    .catch((error) => { // Vinicio - mongodb error or parsing id error
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__GET_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

userRouter.get('/api/users', (request, response) => {
  logger.log(logger.INFO, 'GET - processing a request');

  return User.find()
    .then((userList) => { // Vinicio - userList found OR userList not found, but the id looks good
      if (!userList) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!userList)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(userList);
    })
    .catch((error) => { // Vinicio - mongodb error or parsing id error
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object name ${request.params.name}`);
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__GET_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

userRouter.delete('/api/users/:id', (request, response) => {
  logger.log(logger.INFO, 'DELETE - processing a request');

  return User.findByIdAndRemove(request.params.id)
    .then((user) => { // Vinicio - user found OR user not found, but the id looks good
      if (!user) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code - (!user)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'DELETE - responding with a 204 status code');
      logger.log(logger.INFO, 'DELETE - user successfully removed');
      return response.sendStatus(204);
    })
    .catch((error) => { // Vinicio - mongodb error or parsing id error
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__DELETE_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

export default userRouter;
