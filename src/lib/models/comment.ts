import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }, // Parent comment reference for replies
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
