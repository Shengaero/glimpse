import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    _id: ID
    name: String
    email: String
    password: String
    chats: [Chat]!
  }

  type Chat {
    _id: ID
    name: String
    owner: User
    users: [User]!
    messages: [Message]!
  }

  type Message {
    _id: ID
    content: String
    author: User
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    user(id: ID!): User
    chat(id: ID!): Chat
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    createChat(name: String!, owner: String!): Chat
  }
`;

export default typeDefs;
