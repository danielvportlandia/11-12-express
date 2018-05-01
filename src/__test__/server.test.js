'use strict';

import faker from 'faker';
import superagent from 'superagent';
import User from '../model/user';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/users`;

// Vinicio - the main reason to use mocks is the fact that we don't want to
// write a test that relies on both a POST and a GET request
const createUserMock = () => {
  return new User({
    name: faker.name.findName(),
    location: faker.address.city(),
    bicepsRPM: faker.random.number(300),
    tricepsRPM: faker.random.number(300),
  }).save();
};

describe('/api/users', () => {
  // I know that I'll give a POST ROUTE
  // The post route will be able to insert a new user to my application
  beforeAll(startServer); // Vinicio - we don't use startServer() because we need a function
  afterAll(stopServer);
  // afterEach(() => User.remove({}));
  test('POST - It should respond with a 200 status ', () => {
    const userToPost = {
      name: faker.name.findName(),
      location: faker.address.city(),
      bicepsRPM: faker.random.number(300),
      tricepsRPM: faker.random.number(300),
    };
    return superagent.post(apiURL)
      .send(userToPost)
      .then((response) => {
        // Vinicio - testing status code
        expect(response.status).toEqual(200);
        // Vinicio - Testing for specific values
        expect(response.body.name).toEqual(userToPost.name);
        expect(response.body.location).toEqual(userToPost.location);
        expect(response.body.bicepsRPM).toEqual(userToPost.bicepsRPM);
        expect(response.body.tricepsRPM).toEqual(userToPost.tricepsRPM);
        // Vinicio - Testing that properties are present
        expect(response.body._id).toBeTruthy();
      });
  });
  test('POST - It should respond with a 400 status ', () => {
    const UserToPost = {
      location: faker.address.city(),
      bicepsRPM: faker.random.number(300),
      tricepsRPM: faker.random.number(300),
    };
    return superagent.post(apiURL)
      .send(UserToPost)
      .then(Promise.reject) // Vinicio - this is needed because we are testing for failures
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  describe('GET /api/users', () => {
    test('should respond with 200 if there are no errors', () => {
      let userToTest = null;
      return createUserMock()
        .then((user) => {
          userToTest = user;
          return superagent.get(`${apiURL}/${user._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(userToTest.name);
          expect(response.body.location).toEqual(userToTest.location);
          expect(response.body.bicepsRPM).toEqual(userToTest.bicepsRPM);
          expect(response.body.tricepsRPM).toEqual(userToTest.tricepsRPM);
        });
    });
    test('should respond with 404 if there is no user to be found', () => {
      return superagent.get(`${apiURL}/THisIsAnInvalidId`)
        .then(Promise.reject) // Vinicio - testing for a failure
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  test('should respond with an array.', () => {
    return superagent.get(apiURL)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
      });
  });

  describe('DELETE /api/users', () => {
    test('should respond with 204 if item was successfully removed.', () => {
      return createUserMock()
        .then((user) => {
          return superagent.delete(`${apiURL}/${user._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with 404 if there is no user to be found', () => {
      return superagent.delete(`${apiURL}/THisIsAnInvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
