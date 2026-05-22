import { Request, Response } from 'express';
import Testimonial from '../models/Testimonial';

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { clientName, clientTitle, content, rating, image } = req.body;

    const testimonial = await Testimonial.create({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
      await testimonial.deleteOne();
      res.json({ success: true, message: 'Testimonial removed' });
    } else {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
