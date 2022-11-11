import { Router } from 'express';
import path from 'path';

const router = Router();

export default function routes(production: boolean) {
  if(production) {
    router.get('/', (_, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
    router.get('/*', (_, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
  }

  return router;
};
