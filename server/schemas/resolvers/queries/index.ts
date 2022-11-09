import { AuthenticationError } from 'apollo-server-express';
import { Chat, User } from '../../../models';

type ByID = { id: String; };
type Authenticated = {
  user?: {
    _id: string;
  };
};

export async function me(_: any, _0: any, context: Authenticated) {
  if(!context.user)
    throw new AuthenticationError('You need to be logged in!');
  return User.findById(context.user._id)
    .populate('chats');
}

export async function user(_: any, args: ByID) {
  return User.findById(args.id);
};

export async function chat(_: any, args: ByID) {
  return Chat.findById(args.id)
    .populate('messages')
    .populate('users');
};
