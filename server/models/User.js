import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Invalid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    unique: true
  },
  chats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Chat'
    }
  ]
}, {
  methods: {
    isCorrectPassword: async function (password) {
      return bcrypt.compare(password, this.password);
    }
  }
});

userSchema.pre('save', async function (next) {
  if(this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});


export const User = model('User', userSchema);

export default User;
