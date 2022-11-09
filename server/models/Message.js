import { Schema, model } from 'mongoose';

export const messageSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now()
  }
});

export const Message = model('Message', messageSchema);

export default Message;
