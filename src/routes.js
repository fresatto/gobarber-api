import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
const routes = new Router();

// Users
routes.post('/users', UserController.store);

// Session
routes.post('/sessions', SessionController.store);

export default routes;
