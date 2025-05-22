import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    photo: {
      type: String, // URL to profile picture (optional)
    },
    profilephoto:{
      type:String
    },
    coverimage:{
      type:String
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // don't return password in queries by default
    },
    RefreshToken:{
      type:String
    }
  },
  {
    collection: 'users',
    timestamps: true  // ✅ Combined correctly
  }
);

export const User = mongoose.model('User', userSchema);
