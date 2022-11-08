import { Schema, model } from 'mongoose';

export const messageSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  createdAt: {
    type: Date,
    required: true
  }
});

export const Message = model('message', messageSchema);

export default Message;
