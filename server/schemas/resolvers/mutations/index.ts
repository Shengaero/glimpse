import { AuthenticationError } from 'apollo-server-express';
import { Chat, User } from '../../../models';
import { signToken } from '../../../utils/auth';

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
  owner: String;
};

export async function createUser(_: any, args: CreateUserArgs) {
  const user = await User.create(args);

  return {
    token: signToken(user.toJSON()), user
  };
}

export async function login(_: any, args: LoginArgs) {
  const user = await User.findOne({ email: args.email }).populate('chats');
  if(!(await user.isCorrectPassword(args.password)))
    throw new AuthenticationError('Invalid login!');

  return {
    token: signToken(user.toJSON()), user
  };
}

export async function createChat(_: any, args: CreateChatArgs) {
  const chat = await Chat.create({ ...args });
  return chat.toJSON();
}
