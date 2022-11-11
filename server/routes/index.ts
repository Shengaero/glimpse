import { Router } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ChatWebSocketServer from '../ws/ChatWebSocketServer';

const router = Router();

export default function routes(production: boolean, cwss: ChatWebSocketServer) {
  if(production) {
    router.get('/', (_, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
    router.get('/*', (_, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
  }

  router.ws('/chat', (ws) => {
    console.log('test')
    // don't await this
    cwss.addWebSocket(ws, uuidv4());
  });
  return router;
};
