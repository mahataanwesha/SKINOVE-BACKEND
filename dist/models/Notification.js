"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['lead', 'appointment', 'system'],
        default: 'system',
    },
    read: {
        type: Boolean,
        default: false,
    },
    link: {
        type: String,
    },
}, {
    timestamps: true,
});
const Notification = mongoose_1.default.model('Notification', notificationSchema);
exports.default = Notification;
