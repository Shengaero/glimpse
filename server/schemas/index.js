import * as Query from './resolvers/queries';
import * as Mutation from './resolvers/mutations';
import typeDefs from './typeDefs';

const resolvers = {
  Query,
  Mutation
};

export {
  resolvers, typeDefs
};
