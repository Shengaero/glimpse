import path from 'path';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';

import db from './config/connection';
import routes from './routes';
import resolvers from './schemas/resolvers';
import typeDefs from './schemas/typeDefs';

const app = express();
const apollo = new ApolloServer({ resolvers, typeDefs });
const port = process.env.PORT || 3001;
const production =
  !!process.env.MIMIC_HEROKU ||
  process.env.NODE_ENV == 'production';

async function start() {
  await apollo.start();
  await middleware();
  db.once('open', onMongoOpen);
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

async function onMongoOpen() {
  const server = app.listen(port, () => {
    console.log(`Server open on port: ${port}`);
  });

  // process closing hook will shut down stuff as gracefully as it can
  process.on('exit', async () => {
    server.close();
    await apollo.stop();
    await db.close();
  });
}

start();
