import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const nudgeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true, trim: true },
  likes: { type: Number, default: 0 },
  comments: { type: [commentSchema], default: [] },
  creatorId:{ type:String}
 
},
{
    timestamps:true,
    collection:'Nudge'
});

const Nudge = mongoose.model('Nudge', nudgeSchema);

export default Nudge;
