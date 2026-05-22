"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = exports.createTestimonial = exports.getTestimonials = void 0;
const Testimonial_1 = __importDefault(require("../models/Testimonial"));
// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial_1.default.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: testimonials,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTestimonials = getTestimonials;
// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
const createTestimonial = async (req, res) => {
    try {
        const { clientName, clientTitle, content, rating, image } = req.body;
        const testimonial = await Testimonial_1.default.create({
            clientName,
            clientTitle,
            content,
            rating,
            image,
        });
        res.status(201).json({
            success: true,
            data: testimonial,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createTestimonial = createTestimonial;
// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial_1.default.findById(req.params.id);
        if (testimonial) {
            await testimonial.deleteOne();
            res.json({ success: true, message: 'Testimonial removed' });
        }
        else {
            res.status(404).json({ success: false, message: 'Testimonial not found' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteTestimonial = deleteTestimonial;
