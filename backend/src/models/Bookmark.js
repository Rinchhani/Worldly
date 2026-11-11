import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    countryId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index so a user cannot duplicate a bookmark for the same country
bookmarkSchema.index({ user: 1, countryId: 1 }, { unique: true });

export default mongoose.model('Bookmark', bookmarkSchema);

