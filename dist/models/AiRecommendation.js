"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const aiRecommendationSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
const AiRecommendation = mongoose_1.default.model('AiRecommendation', aiRecommendationSchema);
exports.default = AiRecommendation;
