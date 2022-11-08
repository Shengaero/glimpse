import { AuthenticationError } from 'apollo-server-express';
import { Chat, User } from '../../../models';

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

const createToken = (user: any) => {
  return ''; // TODO: Auth
};

export async function createUser(parent: any, args: CreateUserArgs) {
  const user = await User.create(args);
  const token = createToken(user);
  return {
    token: token,
    user: user.toJSON()
  };
}

export async function login(parent: any, args: LoginArgs) {
  const user = await User.findOne({ email: args.email }).populate('chats');
  if(!(await user.isCorrectPassword(args))) {
    throw new AuthenticationError('Invalid login!');
  }
  const token = createToken(user);
  return {
    token: token,
    user: user.toJSON()
  };
}

export async function createChat(parent: any, args: CreateChatArgs) {
  const user = await Chat.create({ ...args });
}
