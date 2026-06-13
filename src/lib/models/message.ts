import mongoose, { Schema } from 'mongoose';

const ContactMessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
