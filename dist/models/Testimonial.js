"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const testimonialSchema = new mongoose_1.default.Schema({
    clientName: {
        type: String,
        required: true,
    },
    clientTitle: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    image: {
        type: String,
    },
}, {
    timestamps: true,
});
const Testimonial = mongoose_1.default.model('Testimonial', testimonialSchema);
exports.default = Testimonial;
