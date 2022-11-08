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
    ref: 'user'
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'message'
    }
  ]
});

export const Chat = model('Chat', chatSchema);

export default Chat;
