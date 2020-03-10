import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  try {
    const user = await User.create({
      name: 'Gabriel Fresatto',
      email: 'gabrielfresatto@gmail.com',
      password_hash: '12345678',
    });

    return res.json(user);
  } catch (error) {
    return res.json({
      error,
    });
  }
});

export default routes;
