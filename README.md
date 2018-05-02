**Author**: Daniel Shelton
**Version**: 1.0.2

## Overview
This is an application which performs CRUD operations via the Express framework to retreive, edit, add, and/or delete data from a MongoDB database consisting of user's names, city locations, and upperbody RPM stats.

## Architecture
The main point of entry of this application is the index.js file which transpiles the app by utilizing the babel library. This application also utilizes multiple NPM libraries and .travis.yml for its CI. The 'lib' directory contains all the helper modules such as the Node and LinkedList class constructors. The '__test__' directory contains the testing suite.

## Paths
GET ROUTE: retreive an user by their unique id.

userRouter.get('/api/users/:id', (request, response, next) => {
  return User.findById(request.params.id)
    .then((user) => { // Vinicio - user found OR user not found, but the id looks good
      if (!user) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!user)');
        return next(new HttpErrors(404, 'User not found, invalid id.'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(user);
    })
    .catch(next);
});

GET ROUTE: return all users in an array.

userRouter.get('/api/users', (request, response, next) => {
  return User.find()
    .then((userList) => { // Vinicio - userList found OR userList not found, but the id looks good
      if (!userList) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!userList)');
        return next(new HttpErrors(404, 'Collection not found.'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(userList);
    })
    .catch(next);
});

POST ROUTE: Adds a new user to the database if that user doesn't already exist.

userRouter.post('/api/users', jsonParser, (request, response, next) => {
  if (!request.body.name || !request.body.location) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return next(new HttpErrors(400, 'Name and location are required.'));
  }
  return new User(request.body).save()
    .then((user) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(user);
    })
    .catch(next);
});

DELETE ROUTE: Removes a user from the database by their unique id.

userRouter.delete('/api/users/:id', (request, response, next) => {
  return User.findByIdAndRemove(request.params.id)
    .then((user) => { // Vinicio - user found OR user not found, but the id looks good
      if (!user) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code - (!user)');
        return next(new HttpErrors(404, 'User not found, invalid id.'));
      }
      logger.log(logger.INFO, 'DELETE - responding with a 204 status code');
      logger.log(logger.INFO, 'DELETE - user successfully removed');
      return response.sendStatus(204);
    })
    .catch(next);
});

PUT ROUTE: updates a specified property of an existing user in the database.

userRouter.put('/api/users/:id', jsonParser, (request, response, next) => {
  // new means that mongoose will return the updated object after updating.
  const options = { runValidators: true, new: true };
  // findByIdAndUpdate() returns a Promise.
  return User.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updateUser) => {
      if (!updateUser) {
        logger.log(logger.INFO, 'PUT - responding with a 404 status code - (!user)');
        return next(new HttpErrors(404, 'User not found, invalid or missing id.'));
      }
      logger.log(logger.INFO, 'PUT - responding with a 200 status code.');
      return response.json(updateUser);
    })
    .catch(next);
});

## Change Log

05-01-2018 8:56am - GET, POST, DELETE routes established and tested.
05-01-2018 9:30pm - PUT route established and tested, implemented new middleware and refactored.
