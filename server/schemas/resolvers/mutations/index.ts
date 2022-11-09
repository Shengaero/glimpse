import { AuthenticationError } from 'apollo-server-express';
import { Chat, User } from '../../../models';
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
  if(!authenticated || await authenticated)
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
    owner: context.user._id,
    users: [context.user._id]
  });
  chat = await chat.populate('users');
  return chat.toJSON();
}
