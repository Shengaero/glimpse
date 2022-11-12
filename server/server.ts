import path from 'path';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { Server as WSServer } from 'ws';

import db from './config/connection';
import routes from './routes';
import { resolvers, typeDefs } from './schemas';
import ChatWebSocketServer from './ws/ChatWebSocketServer';
import { apolloMiddleware } from './utils/auth';

const app = express();
const apollo = new ApolloServer({ resolvers, typeDefs, context: apolloMiddleware });
const port = process.env.PORT || 3001;
const production =
  !!process.env.MIMIC_HEROKU ||
  process.env.NODE_ENV == 'production';

async function start() {
  await apollo.start();
  await middleware();
  db.once('open', () => {
    const server = app.listen(port, () => {
      console.log(`Server open on port: ${port}`);
      console.log(`graphql on http://localhost:${port}${apollo.graphqlPath}`);
    });

    const wss = new WSServer({ server: server, path: '/chat' });
    ChatWebSocketServer.create(wss);
    console.log(`WSS open at ${wss.address()}`);
  });
}

async function middleware() {
  // integrate apollo server
  apollo.applyMiddleware({ app });

  // standard request middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // how do we handle static resources?
  if(production) {
    // We are in production, so we use the public folder
    app.use(express.static(path.join(__dirname, 'public')));
  } else {
    // In development, we use CORS so we can interact with the frontend webpack server
    // Generally it might be considered strange to have such a resource for dev only but
    //still include it as a production dependency, but CORS is something that may be useful
    //for future development anyways
    app.use(cors());
  }

  // apply our REST routes
  app.use(routes(production));
}

start();
