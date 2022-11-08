import { Schema, model } from 'mongoose';

export const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
  chats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'chat'
    }
  ]
});

export const User = model('user', userSchema);

export default User;
