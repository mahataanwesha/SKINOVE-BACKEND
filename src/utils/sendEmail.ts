import nodemailer from 'nodemailer';

export const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
}) => {
  const transporter = nodemailer.createTransport({
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
