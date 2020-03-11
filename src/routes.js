import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Users
routes.post('/users', UserController.store);
// Session
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// Auth Users
routes.put('/users', UserController.update);

export default routes;
