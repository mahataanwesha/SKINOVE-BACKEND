"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail', // Assuming gmail based on EMAIL_USER=your_email@gmail.com
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: `Skinova AI <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4a5568;">Skinova AI Clinic</h2>
            <p>${options.message.replace(/\n/g, '<br>')}</p>
            <br/>
            <p>Best regards,<br/>The Skinova Team</p>
           </div>`,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
