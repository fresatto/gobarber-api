import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';

import authMiddleware from './app/middlewares/auth';
import AppointmentController from './app/controllers/AppointmentController';

const routes = new Router();
const upload = multer(multerConfig);

// Users
routes.post('/users', UserController.store);
// Session
routes.post('/sessions', SessionController.store);

// MIDDLEWARE
routes.use(authMiddleware);

// Users
routes.put('/users', UserController.update);

// Providers
routes.get('/providers', ProviderController.index);

// Files
routes.post('/files', upload.single('file'), FileController.store);

// Appointment
routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);

export default routes;
