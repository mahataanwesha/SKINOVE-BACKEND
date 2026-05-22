"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointment = exports.updateAppointmentStatus = exports.getAppointments = exports.createAppointment = void 0;
const Appointment_1 = __importDefault(require("../models/Appointment"));
const Lead_1 = __importDefault(require("../models/Lead"));
const Notification_1 = __importDefault(require("../models/Notification"));
const index_1 = require("../index");
// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public (or Private depending on flow)
const createAppointment = async (req, res) => {
    try {
        const { leadId, date, time, notes } = req.body;
        const lead = await Lead_1.default.findById(leadId);
        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }
        const appointment = await Appointment_1.default.create({
            lead: leadId,
            date,
            time,
            notes,
        });
        const populatedAppointment = await Appointment_1.default.findById(appointment._id).populate('lead');
        // Create notification
        const notification = await Notification_1.default.create({
            message: `New appointment scheduled with ${lead.fullName}`,
            type: 'appointment',
            link: `/admin/appointments`,
        });
        index_1.io.to('admin_room').emit('new_appointment', populatedAppointment);
        index_1.io.to('admin_room').emit('new_notification', notification);
        res.status(201).json({
            success: true,
            data: populatedAppointment,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createAppointment = createAppointment;
// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment_1.default.find()
            .populate('lead')
            .sort({ date: 1, time: 1 });
        res.json({
            success: true,
            data: appointments,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAppointments = getAppointments;
// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin
const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment_1.default.findById(req.params.id).populate('lead');
        if (appointment) {
            appointment.status = status;
            const updatedAppointment = await appointment.save();
            index_1.io.to('admin_room').emit('appointment_updated', updatedAppointment);
            res.json({
                success: true,
                data: updatedAppointment,
            });
        }
        else {
            res.status(404).json({ success: false, message: 'Appointment not found' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateAppointmentStatus = updateAppointmentStatus;
// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment_1.default.findById(req.params.id);
        if (appointment) {
            await appointment.deleteOne();
            index_1.io.to('admin_room').emit('appointment_deleted', req.params.id);
            res.json({ success: true, message: 'Appointment removed' });
        }
        else {
            res.status(404).json({ success: false, message: 'Appointment not found' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteAppointment = deleteAppointment;
