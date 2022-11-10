import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { Chat, User, Message } from '../../../models';
import { AuthContext } from '../types';

type ByID = { id: String; };

export async function me(_: any, _0: any, context: AuthContext) {
  if (!context.user)
    throw new AuthenticationError('You need to be logged in!');
  const user = await User.findById(context.user._id).populate('chats');
  return user.toJSON();
}

export async function user(_: any, { id }: ByID) {
  const user = await User.findById(id);
  if (!user)
    throw new ApolloError(`User with ID '${id}' not found!`, 'NOT_FOUND');
  return user.toJSON();
};

export async function chat(_: any, { id }: ByID) {
  const chat = await Chat.findById(id)
    .populate('messages')
    .populate({
      path: 'messages',
      populate: 'author'
    })
    .populate('users')
    .populate('owner');
  if (!chat)
    throw new ApolloError(`Chat with ID '${id}' not found!`, 'NOT FOUND');

  return chat.toJSON();
};

export async function messagesByChat(_: any, { chatId }, context: AuthContext) {

  if (!context.user)
    throw new ApolloError('You need to be logged in!');
  const userInChat = await Chat.findOne({_id: chatId, users: {$in: context.user._id}});

  if (!userInChat)
    throw new ApolloError('Not a member of this chat');
  return await Chat.findById(chatId)
    .populate('messages')
    .populate({
      path: 'messages',
      populate: 'author'
    })
    .sort({ createdAt: -1 });
}
