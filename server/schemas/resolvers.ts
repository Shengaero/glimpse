const resolvers = {
  Query: {
    getUser: async (parent: any, args: { id: String }) => {
      throw new Error('not implemented');
    }
  }
};

export default resolvers;
