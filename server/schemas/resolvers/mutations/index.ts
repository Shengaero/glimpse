import { AuthenticationError } from 'apollo-server-express';
import { Chat, User } from '../../../models';
import { signToken } from '../../../utils/auth';

type Auth = {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    chats: any[]
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
  owner: String;
};

const createUserToken = ({ email, name, _id }) => signToken({
  _id: _id,
  email: email,
  username: name
});

export async function createUser(_: any, args: CreateUserArgs): Promise<Auth> {
  const user = await User.create(args);

  return {
    token: createUserToken(user),
    user: user.toJSON()
  };
}

export async function login(_: any, args: LoginArgs): Promise<Auth> {
  const user = await User.findOne({ email: args.email }).populate('chats');
  if(!(await user.isCorrectPassword(args.password)))
    throw new AuthenticationError('Invalid login!');

  return {
    token: createUserToken(user),
    user: user.toJSON()
  };
}

export async function createChat(_: any, args: CreateChatArgs) {
  const chat = await Chat.create({ ...args });
  return chat.toJSON();
}
