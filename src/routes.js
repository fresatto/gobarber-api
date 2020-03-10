import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => res.json({ msg: 'UIAHDIUHAIUSD world' }));

export default routes;
