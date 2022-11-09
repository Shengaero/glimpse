import { gql } from 'apollo-server-express';

const typeDefs = gql`
"""A user of the application."""
type User {
  """The unique [ID](ID) of the [User](User)."""
  _id: ID!

  """The [User](User)'s name, displayed for other users."""
  name: String!

  """
  The [User](User)'s email address.

  Possibly null depending on the way the [User](User) is accessed.
  """
  email: String

  """
  The [User](User)'s password, stored as a hash.

  Possibly null depending on the way the [User](User) is accessed.

  It may be specified in certain mutations like [createUser](Mutation#createUser)
  or [login](Mutation#login), but never returned via [Queries](Query).
  """
  password: String

  """The [Chat](Chat)'s that a [User](User) belongs to, possibly empty."""
  chats: [Chat!]!
}

"""A chat room with users and messages."""
type Chat {
  """The unique [ID](ID) of the [Chat](Chat)."""
  _id: ID!

  """The [Chat](Chat)'s name, displayed for users."""
  name: String!

  """The [User](User) that owns the [Chat](Chat)."""
  owner: User!

  """The [User](User)s that are part of the [Chat](Chat), never empty."""
  users: [User!]!

  """The [Message](Message)s in the [Chat](Chat), possibly empty."""
  messages: [Message!]!
}

"""A message sent by a user in a chat room."""
type Message {
  """The unique [ID](ID) of the [Message](Message)."""
  _id: ID!

  """The content of the [Message](Message)."""
  content: String!

  """The [User](User) who authored the [Message](Message)."""
  author: User!

  """The time this [Message](Message) was created."""
  createdAt: String!
}

"""Authentication credentials."""
type Auth {
  """The token [ID](ID) for authentication."""
  token: ID!

  """The [User](User) authenticated."""
  user: User!
}

"""Queries performable on the graphql server."""
type Query {
  """Gets the currently logged in [User](User)"""
  me: User

  """
  Gets a [User](User) with the specified unique [ID](ID).

  @param id - The unique [User ID](User#id).

  @returns A [User](User) or null if one was not found.
  """
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
