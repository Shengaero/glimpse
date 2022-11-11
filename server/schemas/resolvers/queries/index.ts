import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { Chat, User } from '../../../models';
import { AuthContext } from '../types';

type ByID = { id: String; };

export async function me(_: any, _0: any, context: AuthContext) {
  if(!context.user)
    throw new AuthenticationError('You need to be logged in!');
  const user = await User.findById(context.user._id)
    .populate({
      path: 'chats',
      populate: {
        path: 'users'
      }
    });
  return user.toJSON();
}

export async function user(_: any, { id }: ByID) {
  const user = await User.findById(id);
  if(!user)
    throw new ApolloError(`User with ID '${id}' not found!`, 'NOT_FOUND');
  return user.toJSON();
};

export async function chat(_: any, { id }: ByID, context: AuthContext) {
  if(!context.user)
    throw new AuthenticationError('You need to be logged in!');

  const chat = await Chat.findById(id)
    .withUserId(context.user._id)
    .populate('users')
    .populate({
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
    throw new ApolloError(`Chat with ID '${id}' not found!`, 'NOT_FOUND');

  return chat.toJSON();
};

//get messages by chat id only if user is a member of the chat
// async function messagesByChat(_: any, { chatId }, context: AuthContext) {

//   if(!context.user)
//     throw new ApolloError('You need to be logged in!');
//   const userInChat = await Chat.findOne({ _id: chatId, users: { $in: context.user._id } });

//   if(!userInChat)
//     throw new ApolloError('Not a member of this chat');
//   return await Chat.findById(chatId)
//     .populate('messages')
//     .populate({
//       path: 'messages',
//       populate: 'author'
//     })
//     .sort({ 'messages.createdAt': -1 });
// }
