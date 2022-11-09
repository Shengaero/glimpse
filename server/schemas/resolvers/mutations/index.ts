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

const createToken = (user: any) => {
  return signToken({
    _id: user._id,
    email: user.email,
    username: user.name
  });
};

export async function createUser(_: any, args: CreateUserArgs) {
  const user = await User.create(args);

  return {
    token: createToken(user),
    user: user.toJSON()
  };
}

export async function login(_: any, args: LoginArgs) {
  const user = await User.findOne({ email: args.email }).populate('chats');
  if(!(await user.isCorrectPassword(args.password)))
    throw new AuthenticationError('Invalid login!');

  return {
    token: createToken(user),
    user: user.toJSON()
  };
}

export async function createChat(_: any, args: CreateChatArgs) {
  const chat = await Chat.create({ ...args });
  return chat.toJSON();
}
