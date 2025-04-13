// src/models/Message.ts
import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  text: String,
  userId: String,
  roomId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
