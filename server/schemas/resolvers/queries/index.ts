import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { Chat, User } from '../../../models';
import { AuthContext } from '../types';

type ByID = { id: String; };

export async function me(_: any, _0: any, context: AuthContext) {
  if(!context.user)
    throw new AuthenticationError('You need to be logged in!');
  const user = await User.findById(context.user._id).populate('chats');
  return user.toJSON();
}

export async function user(_: any, { id }: ByID) {
  const user = await User.findById(id);
  if(!user)
    throw new ApolloError(`User with ID '${id}' not found!`, 'NOT_FOUND');
  return user.toJSON();
};

export async function chat(_: any, { id }: ByID) {
  const chat = await Chat.findById(id)
    .populate('messages')
    .populate('users');
  if(!chat)
    throw new ApolloError(`Chat with ID '${id}' not found!`, 'NOT FOUND');
  return chat.toJSON();
};
