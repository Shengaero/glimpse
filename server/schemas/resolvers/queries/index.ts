import { User } from '../../../models';

export async function getUser(parent: any, args: { id?: String; }, context: any) {
  return await User.findById(args.id);
};

export async function getChat(parent: any, args: { id: String; }) {

};
