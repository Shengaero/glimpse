import { Schema, model } from 'mongoose';
import dateDisplay from '../utils/dateDisplay';

export const messageSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
    get: dateDisplay
  }
});

export const Message = model('Message', messageSchema);

export default Message;
