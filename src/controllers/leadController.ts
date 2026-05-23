import { Request, Response } from 'express';
import Lead from '../models/Lead';
import Notification from '../models/Notification';
import { io } from '../index';
import Appointment from '../models/Appointment';
import { sendEmail } from '../utils/sendEmail';

// @desc    Create new lead
// @route   POST /api/leads
// @access  Public
export const createLead = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, concern } = req.body;

    const lead = await Lead.create({
      fullName,
      email,
      phone,
      concern,
    });

    // Create a notification
    const notification = await Notification.create({
      message: `New consultation request from ${fullName}`,
      type: 'lead',
      link: `/admin/leads`,
    });

    // Emit socket event to admins
    io.to('admin_room').emit('new_lead', lead);
    io.to('admin_room').emit('new_notification', notification);

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private/Admin
export const getLeads = async (req: Request, res: Response) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: leads,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update lead status
// @route   PUT /api/leads/:id/status
// @access  Private/Admin
export const updateLeadStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      lead.status = status;
      const updatedLead = await lead.save();

      // Send email and create Appointment if accepted/contacted
      if (status === 'Contacted' || status === 'Converted') {
        // Send email in background so it doesn't block the API
        sendEmail({
          email: lead.email,
          subject: 'Your Consultation Request with Skinova AI',
          message: `Hello ${lead.fullName},\n\nYour consultation request has been accepted. One of our specialists will be reaching out to you shortly at ${lead.phone} to finalize your appointment details.\n\nThank you for choosing Skinova AI!`,
        }).catch(emailErr => {
          console.error('Failed to send confirmation email:', emailErr);
        });

        if (status === 'Contacted') {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          await Appointment.create({
            lead: lead._id,
            date: tomorrow,
            time: '10:00 AM', // Default time
            status: 'pending',
            notes: 'Auto-generated appointment after accepting lead.',
          });
        }
      }

      // Emit event
      io.to('admin_room').emit('lead_updated', updatedLead);

      res.json({
        success: true,
        data: updatedLead,
      });
    } else {
      res.status(404).json({ success: false, message: 'Lead not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private/Admin
export const deleteLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      await Appointment.deleteMany({ lead: lead._id });
      await lead.deleteOne();
      
      io.to('admin_room').emit('lead_deleted', req.params.id);

      res.json({ success: true, message: 'Lead removed' });
    } else {
      res.status(404).json({ success: false, message: 'Lead not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
