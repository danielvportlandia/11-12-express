'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import User from '../model/user';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const userRouter = new Router();
/*-----------------------------------------------------------------------------------------
--------------------------------POST ROUTE--------------------------------------------------
------------------------------------------------------------------------------------------*/
// needs data from the request (jsonParser).
userRouter.post('/api/users', jsonParser, (request, response, next) => {
  if (!request.body.name || !request.body.location) {
    return next(new HttpErrors(400, 'Name and location are required.'));
  }
  return new User(request.body).save()
    .then((user) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(user);
    })
    .catch(next);
});
/*----------------------------------------------------------------------------------------
--------------------------------PUT ROUTE------------------------------------------------
-----------------------------------------------------------------------------------------*/
// Needs data from the jsonParser.
userRouter.put('/api/users/:id', jsonParser, (request, response, next) => {
  // new means that mongoose will return the updated object after updating.
  const options = { runValidators: true, new: true };
  // findByIdAndUpdate() returns a Promise.
  return User.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updateUser) => {
      if (!updateUser) {
        return next(new HttpErrors(404, 'User not found, invalid or missing id.'));
      }
      logger.log(logger.INFO, 'PUT - responding with a 200 status code.');
      return response.json(updateUser);
    })
    .catch(next);
});
  
userRouter.get('/api/users/:id', (request, response, next) => {
  return User.findById(request.params.id)
    .then((user) => {
      if (!user) {
        return next(new HttpErrors(404, 'User not found, invalid id.'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(user);
    })
    .catch(next);
});
  
userRouter.get('/api/users', (request, response, next) => {
  return User.find()
    .then((userList) => {
      if (!userList) {
        return next(new HttpErrors(404, 'Collection not found.'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(userList);
    })
    .catch(next);
});
  
userRouter.delete('/api/users/:id', (request, response, next) => {
  return User.findByIdAndRemove(request.params.id)
    .then((user) => { // Vinicio - user found OR user not found, but the id looks good
      if (!user) {
        return next(new HttpErrors(404, 'User not found, invalid id.'));
      }
      logger.log(logger.INFO, 'DELETE - responding with a 204 status code');
      logger.log(logger.INFO, 'DELETE - user successfully removed');
      return response.sendStatus(204);
    })
    .catch(next);
});
  
export default userRouter;
