"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const leadSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    concern: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Qualified', 'Converted'],
        default: 'New',
    },
    aiScore: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
const Lead = mongoose_1.default.model('Lead', leadSchema);
exports.default = Lead;
