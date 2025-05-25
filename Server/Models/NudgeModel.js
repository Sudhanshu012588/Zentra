import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
},{
  timestamps:true,
  collection:'comment'
});

const nudgeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String },
  body: { type: String, required: true, trim: true },
  likes: { type: Number, default: 0 },
  likedBy: {
    type: [String],
    default: [],
  },
  comments: { type: [commentSchema], default: [] },
  creatorId: { type: String },
  profilephoto: { type: String }, // ✅ Correctly added here
}, {
  timestamps: true,
  collection: 'Nudge',
});

const Nudge = mongoose.model('Nudge', nudgeSchema);

export default Nudge;
