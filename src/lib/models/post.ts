import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  content: { type: String, required: true }, // HTML rich content from Tiptap
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  tags: [{ type: String }],
  image: { type: String, required: true }, // Cloudinary URL
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  views: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
  scheduledAt: { type: Date }, // Optional: date for automated scheduling
  metaTitle: { type: String },
  metaDescription: { type: String },
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
