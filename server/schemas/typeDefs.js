import { gql } from 'apollo-server-express';

const typeDefs = gql`

"A user of the application."
type User {
  "The unique [ID](ID) of the [User](User)."
  _id: ID!

  "The [User](User)'s name, displayed for other users."
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

  "The [Chat](Chat)'s that a [User](User) belongs to, possibly empty."
  chats: [Chat]
}

"A chat room with users and messages."
type Chat {
  "The unique [ID](ID) of the [Chat](Chat)."
  _id: ID!

  "The [Chat](Chat)'s name, displayed for users."
  name: String!

  "The [User](User) that owns the [Chat](Chat)."
  owner: User!

  "The [User](User)s that are part of the [Chat](Chat), never empty."
  users: [User]

  "The [Message](Message)s in the [Chat](Chat), possibly empty."
  messages: [Message]
}

"A message sent by a user in a chat room."
type Message {
  "The unique [ID](ID) of the [Message](Message)."
  _id: ID!

  "The content of the [Message](Message)."
  content: String!

  "The [User](User) who authored the [Message](Message)."
  author: User!

  "The time this [Message](Message) was created."
  createdAt: String!
}

"""
Authentication credentials provided when logging in or creating an account.

To recieve Auth, you must use either the [createUser](Mutations#createUser)
or [login](Mutations#login) mutations.
"""
type Auth {
  "The token [ID](ID) for authentication."
  token: ID!

  "The [User](User) authenticated."
  user: User!
}

"Queries performable on the graphql server."
type Query {
  """
  Gets the currently logged in [User](User).

  This is only available when the request maker is [authenticated](Auth).

  **Possible Errors**

  - UNAUTHENTICATED: The request maker was not [authenticated](Auth).
  """
  me: User

  """
  Gets a [User](User) with the specified unique [ID](ID).

  **Possible Errors**

  - NOT_FOUND: A [User](User) was not found.
  """
  user(
    "The unique [User ID](User#id)."
    id: ID!
  ): User

  """
  Gets a [Chat](Chat) with the specified unique [ID](ID).

  **Possible Errors**

  - UNAUTHENTICATED: The request maker was not [authenticated](Auth).
  - NOT_FOUND: A [Chat](Chat) was not found.
  """
  chat(
    "The unique [Chat ID](Chat#id)."
    id: ID!
  ): Chat
}

"Mutations performable on the graphql server."
type Mutation {
  "Creates a new [User](User), returning an [Auth](Auth)."
  createUser(
    "The new [User](User)'s name."
    name: String!,
    "The new [User](User)'s email."
    email: String!,
    "The new [User](User)'s password."
    password: String!
  ): Auth

  """
  Logs in under an existing [User](User), returning an [Auth](Auth).

  **Possible Errors**

  - UNAUTHENTICATED: The email or password is incorrect.
  """
  login(
    "The [User](User)'s email."
    email: String!,
    "The [User](User)'s password."
    password: String!
  ): Auth

  """
  Creates a new [Chat](Chat).

  This is only available when the request maker is [authenticated](Auth).

  **Possible Errors**

  - UNAUTHENTICATED: The request maker was not [authenticated](Auth).
  """
  createChat(
    "The name of the [Chat](Chat)."
    name: String!
  ): Chat

  """
  Create a new [Message](Message) and add it to the [Chat](Chat)
  matching the provided chatId.

  This is only available when the request maker is [authenticated](Auth).

  **Possible Errors**

  - UNAUTHENTICATED: The request maker was not [authenticated](Auth).
  - NOT_FOUND: The chat to post the message to was not found.
  """
  createMessage(
    "The ID of the [Chat](Chat) to create a [Message](Message) in."
    chatId: ID!,
    "The content of the [Message] to send."
    content: String!
  ): Message

  """
  Deletes an existing [Chat](Chat) matching the provided chatId.

  This is only available when the request maker is [authenticated](Auth), and
  the chatId matches a [Chat](Chat) where the authenticated [User](Auth#user)
  is also the [owner of the Chat](Chat#owner).

  Also note this will delete [related messages](Chat#messages).

  **Possible Errors**

  - UNAUTHENTICATED: The request maker was not [authenticated](Auth).
  - NOT_FOUND: The [Chat](Chat) to delete was not found, and/or the
    authenticated [User](User) was not the owner of the [Chat](Chat).
  """
  deleteChat(
    "The ID of the [Chat](Chat) to delete."
    chatId: ID!
  ): Chat

  """
  Deletes an existing [Message](Message) with a matching [message ID](Message#_id)
  from a given [Chat](Chat) with a matching [chat ID](Chat#_id).

  **Possible Errors**

  - UNAUTHENTICATED: The request maker was not [authenticated](Auth).
  - NOT_FOUND: The [Message](Message) to delete and/or [Chat](Chat)
    to delete it from were not found.
  """
  deleteMessage(
    "The ID of the [Chat](Chat) to delete the [Message](Message) from."
    chatId: ID!,
    "The ID of the [Message](Message) to delete."
    messageId: ID
  ): Message

  """
  Joins the currently [authenticated](Auth) [User](User) to a [Chat](Chat)
  matching the provided chatId.

  **Possible Errors**

  - UNAUTHENTICATED: The request maker was not [authenticated](Auth).
  - NOT_FOUND: The [Chat](Chat) to join was not found.
  """
  joinChat(
    "The ID of the [Chat](Chat) to join."
    chatId: ID!
  ): Chat

  """
  Removes the currently [authenticated](Auth) [User](User) from a [Chat](Chat)
  matching the provided chatId.

  **Possible Errors**

  - UNAUTHENTICATED: The request maker was not [authenticated](Auth).
  - NOT_FOUND: The [Chat](Chat) to leave was not found.
  """
  leaveChat(
    "The ID of the [Chat](Chat) to leave."
    chatId: ID!
  ): Chat
}
`;

export default typeDefs;
