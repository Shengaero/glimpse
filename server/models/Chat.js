import { Schema, model } from 'mongoose';

export const chatSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }
  ]
});

export const Chat = model('Chat', chatSchema);

export default Chat;
