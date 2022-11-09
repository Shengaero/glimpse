import {
  ApolloClient,
  InMemoryCache,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import * as Auth from './auth';

const httpLink = createHttpLink({
  // Normally in production we would simply specify the uri property here as '/graphql'
  //since everything would be happening on the same host. However, in development we're
  //running 2 servers on different ports, and thus we need to target port 3001
  uri: process.env.NODE_ENV === 'development' ? 'http://localhost:3001/graphql' : '/graphql'
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: Auth.loggedIn() ? `Bearer ${Auth.getToken()}` : ''
    }
  };
});

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
