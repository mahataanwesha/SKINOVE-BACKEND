import mongoose from 'mongoose';

const aiRecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Can be user ID or a session/anonymous ID
    },
    imageUrl: {
      type: String,
    },
    condition: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      required: true,
    },
    recommendations: {
      type: [String],
      default: [],
    },
    treatments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const AiRecommendation = mongoose.model('AiRecommendation', aiRecommendationSchema);

export default AiRecommendation;
