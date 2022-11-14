import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { Chat, Message, User } from '../../../models';
import { signToken } from '../../../utils/auth';
import { AuthContext } from '../types';

type Auth = {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    chats: any[];
  };
};

type CreateUserArgs = {
  name: String;
  email: String;
  password: String;
};

type LoginArgs = {
  email: String;
  password: String;
};

type CreateChatArgs = {
  name: String;
};

type CreateMessageArgs = {
  content: String;
  chatId: String;
};

type DeleteChatArgs = {
  chatId: String;
};

type DeleteMessageArgs = DeleteChatArgs & {
  messageId: String;
};

type JoinChatArgs = {
  chatId: String;
};

export async function createUser(_: any, args: CreateUserArgs): Promise<Auth> {
  const user = await User.create(args);

  return {
    token: signToken(user.email, user.name, user._id),
    user: user.toJSON()
  };
}

export async function login(_: any, { email, password }: LoginArgs): Promise<Auth> {
  const user = await User.findOne({ email }).populate('chats');
  const authenticated = user?.isCorrectPassword(password);

  // if the user was not found or the password is incorrect, the login is invalid
  if(!authenticated || !(await authenticated))
    throw new AuthenticationError('Invalid login!');

  return {
    token: signToken(user.email, user.name, user._id),
    user: user.toJSON()
  };
}

export async function createChat(_: any, args: CreateChatArgs, context: AuthContext) {
  if(!context.user)
    throw new AuthenticationError('You need to be logged in!');
  let chat = await Chat.create({
    name: args.name,
    owner: context.user._id, // creating user is owner
    users: [context.user._id] // also a user in the channel of course
  });

  // We need to try catch here in case we encounter an error so we can "rollback"
  try {
    // add the chat to the user
    await User.updateOne(
      { _id: context.user._id },
      { $push: { chats: chat._id } }
    );
  } catch(err) {
    console.log(err);
  }
  chat = await chat.populate('users');
  return chat.toJSON();
};

//create new message and update chat
export async function createMessage(_: any, args: CreateMessageArgs, context: AuthContext) {
  if(!context.user)
    throw new AuthenticationError('You need to be logged in!');

  // we need to grab this so that we can verify the chat even exists to begin with.
  const chat = await Chat.findById(args.chatId)
    .withUserId(context.user._id);

  if(!chat)
    throw new ApolloError(`Chat with ID '${args.chatId}' not found!`, 'NOT_FOUND');

  // create new message.
  // NOTE: we do not need to populate the author because the author should know who they are.
  const newMessage = await Message.create({ content: args.content, author: context.user._id });

  // we need to explicitly try catch here because if this particular
  //update fails, we need to "rollback" and delete the message.
  try {
    // update this chat adding the message
    await chat.addMessage(newMessage._id);
  } catch(err) {
    await newMessage.deleteOne();
    throw err;
  }

  return newMessage.toJSON();
}

export async function deleteChat(_: any, args: DeleteChatArgs, context: AuthContext) {
  if(!context.user)
    throw new AuthenticationError('You need to be logged in!');

  // first delete the chat
  const chat = await Chat.findOneAndDelete({
    _id: args.chatId,
    owner: context.user._id
  });

  // if no chat was deleted, throw error
  if(!chat) {
    throw new ApolloError(
      `Chat with ID '${args.chatId}' owned by User with ID '${context.user._id}' not found!`,
      'NOT_FOUND'
    );
  }

  // cleanup users
  // await User.updateMany(
  //   { _id: { $in: chat.users } },
  //   { chats: { $pull: chat._id } }
  // );

  await User.updateMany({
    chats: {
      $in: chat._id
    }
  }, {
    $pull: {
      chats: chat._id
    }
  }, {
    new: true
  });


  // then cleanup the messages
  await Message.deleteMany({ _id: { $in: chat.messages } });

  return chat.toJSON();
}

export async function deleteMessage(_: any, { chatId, messageId }: DeleteMessageArgs, context: AuthContext) {
  if(!context.user)
    throw new AuthenticationError('You need to be logged in!');

  // find a chat by ID
  const chat = await Chat.findById(chatId)
    .withUserId(context.user._id)
    .populate('messages');

  if(!chat)
    throw new ApolloError(`Chat with ID '${chatId}' not found!`, 'NOT_FOUND');

  const message = await Message.findById(messageId);

  if(!message)
    throw new ApolloError(`Message with ID '${messageId}' not found!`, 'NOT_FOUND');

  const updateResults = await chat.updateOne({ $pull: { messages: message._id } });

  if(updateResults.n) {
    throw new ApolloError(
      `Message with ID '${messageId}' not found in Chat with ID '${chatId}'!`,
      'NOT_FOUND'
    );
  }

  // we need to explicitly try catch here because if this particular
  //update fails, we need to "rollback" and readd the message.
  try {
    // delete the message
    await message.deleteOne();
  } catch(err) {
    await chat.updateOne({ $push: { messages: message._id } });
    throw err;
  }

  return message.toJSON();
}

export async function joinChat(_: any, { chatId }: JoinChatArgs, context: AuthContext) {
  if(!context.user)
    throw new AuthenticationError('You need to be logged in!');

  // find and update the chat, we need this data back
  //so we can render it on the client's end
  const chat = await Chat.findOneAndUpdate(
    { _id: chatId },
    { $addToSet: { users: context.user._id } },
    { new: true }
  ).populate('users').populate({
    path: 'messages',
    options: {
      limit: 100, // limit 100 messages per request TODO: paginate this (?)
      sort: { createdAt: -1 }
    },
    populate: {
      path: 'author'
    }
  });

  if(!chat)
    throw new ApolloError(`Chat with ID '${chatId}' not found!`, 'NOT_FOUND');

  // update user in try catch incase we need to "rollback"
  try {
    await User.updateOne(
      { _id: context.user._id },
      { $addToSet: { chats: chat._id } }
    );
  } catch(err) {
    await chat.updateOne({ $pull: { users: context.user._id } });
    throw err;
  }

  return chat.toJSON();
}

export async function leaveChat(_: any, { chatId }: JoinChatArgs, context: AuthContext) {
  if(!context.user)
    throw new AuthenticationError('You need to be logged in!');

  const chat = await Chat.findOneAndUpdate(
    { _id: chatId, users: context.user._id },
    { $pull: { users: context.user._id } },
    { new: true }
  );

  if(!chat)
    throw new ApolloError(`Chat with ID '${chatId}' not found!`, 'NOT_FOUND');

  // update user in try catch incase we need to "rollback"
  try {
    await User.updateOne(
      { _id: context.user._id },
      { $pull: { chats: chat._id } }
    );
  } catch(err) {
    await chat.updateOne({ $addToSet: { users: context.user._id } });
    throw err;
  }

  return chat.toJSON();
}
