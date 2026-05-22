import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import Lead from '../models/Lead';
import Notification from '../models/Notification';
import { io } from '../index';

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public (or Private depending on flow)
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { leadId, date, time, notes } = req.body;

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const appointment = await Appointment.create({
      lead: leadId,
      date,
      time,
      notes,
    });

    const populatedAppointment = await Appointment.findById(appointment._id).populate('lead');

    // Create notification
    const notification = await Notification.create({
      message: `New appointment scheduled with ${lead.fullName}`,
      type: 'appointment',
      link: `/admin/appointments`,
    });

    io.to('admin_room').emit('new_appointment', populatedAppointment);
    io.to('admin_room').emit('new_notification', notification);

    res.status(201).json({
      success: true,
      data: populatedAppointment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find()
      .populate('lead')
      .sort({ date: 1, time: 1 });
      
    res.json({
      success: true,
      data: appointments,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin
export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id).populate('lead');

    if (appointment) {
      appointment.status = status;
      const updatedAppointment = await appointment.save();

      io.to('admin_room').emit('appointment_updated', updatedAppointment);

      res.json({
        success: true,
        data: updatedAppointment,
      });
    } else {
      res.status(404).json({ success: false, message: 'Appointment not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      await appointment.deleteOne();
      
      io.to('admin_room').emit('appointment_deleted', req.params.id);

      res.json({ success: true, message: 'Appointment removed' });
    } else {
      res.status(404).json({ success: false, message: 'Appointment not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
