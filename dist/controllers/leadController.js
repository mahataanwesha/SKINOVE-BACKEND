"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLead = exports.updateLeadStatus = exports.getLeads = exports.createLead = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const Notification_1 = __importDefault(require("../models/Notification"));
const index_1 = require("../index");
const Appointment_1 = __importDefault(require("../models/Appointment"));
const sendEmail_1 = require("../utils/sendEmail");
// @desc    Create new lead
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
    try {
        const { fullName, email, phone, concern } = req.body;
        const lead = await Lead_1.default.create({
            fullName,
            email,
            phone,
            concern,
        });
        // Create a notification
        const notification = await Notification_1.default.create({
            message: `New consultation request from ${fullName}`,
            type: 'lead',
            link: `/admin/leads`,
        });
        // Emit socket event to admins
        index_1.io.to('admin_room').emit('new_lead', lead);
        index_1.io.to('admin_room').emit('new_notification', notification);
        res.status(201).json({
            success: true,
            data: lead,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createLead = createLead;
// @desc    Get all leads
// @route   GET /api/leads
// @access  Private/Admin
const getLeads = async (req, res) => {
    try {
        const leads = await Lead_1.default.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: leads,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getLeads = getLeads;
// @desc    Update lead status
// @route   PUT /api/leads/:id/status
// @access  Private/Admin
const updateLeadStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const lead = await Lead_1.default.findById(req.params.id);
        if (lead) {
            lead.status = status;
            const updatedLead = await lead.save();
            // Send email and create Appointment if accepted/contacted
            if (status === 'Contacted' || status === 'Converted') {
                try {
                    await (0, sendEmail_1.sendEmail)({
                        email: lead.email,
                        subject: 'Your Consultation Request with Skinova AI',
                        message: `Hello ${lead.fullName},\n\nYour consultation request has been accepted. One of our specialists will be reaching out to you shortly at ${lead.phone} to finalize your appointment details.\n\nThank you for choosing Skinova AI!`,
                    });
                }
                catch (emailErr) {
                    console.error('Failed to send confirmation email:', emailErr);
                }
                if (status === 'Contacted') {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    await Appointment_1.default.create({
                        lead: lead._id,
                        date: tomorrow,
                        time: '10:00 AM', // Default time
                        status: 'pending',
                        notes: 'Auto-generated appointment after accepting lead.',
                    });
                }
            }
            // Emit event
            index_1.io.to('admin_room').emit('lead_updated', updatedLead);
            res.json({
                success: true,
                data: updatedLead,
            });
        }
        else {
            res.status(404).json({ success: false, message: 'Lead not found' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateLeadStatus = updateLeadStatus;
// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private/Admin
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead_1.default.findById(req.params.id);
        if (lead) {
            await Appointment_1.default.deleteMany({ lead: lead._id });
            await lead.deleteOne();
            index_1.io.to('admin_room').emit('lead_deleted', req.params.id);
            res.json({ success: true, message: 'Lead removed' });
        }
        else {
            res.status(404).json({ success: false, message: 'Lead not found' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteLead = deleteLead;
