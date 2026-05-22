"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = exports.getUserProfile = exports.authUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: (0, generateToken_1.default)(user._id.toString()),
                },
            });
        }
        else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.authUser = authUser;
const getUserProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user._id);
        if (user) {
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        }
        else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getUserProfile = getUserProfile;
// Seed initial admin
const seedAdmin = async (req, res) => {
    try {
        const adminExists = await User_1.default.findOne({ email: 'admin@skinova.ai' });
        if (adminExists) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }
        const admin = await User_1.default.create({
            name: 'Admin User',
            email: 'admin@skinova.ai',
            password: 'password123',
            role: 'admin',
        });
        res.status(201).json({
            success: true,
            message: 'Admin seeded successfully',
            data: { email: admin.email, password: 'password123' }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.seedAdmin = seedAdmin;
