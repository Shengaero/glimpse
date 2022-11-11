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
}, {
  methods: {
    addMessage: function (messageId) {
      return this.updateOne({ $push: { messages: messageId } });
    },
    deleteMessage: function (messageId) {
      return this.updateOne({ $pull: { messages: messageId } });
    }
  },
  query: {
    withUserId(userId) {
      return this.where({ users: userId });
    }
  }
});

export const Chat = model('Chat', chatSchema);

export default Chat;
