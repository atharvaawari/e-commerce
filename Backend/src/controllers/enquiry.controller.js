import nodemailer from 'nodemailer';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const sendEnquiry = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        throw new ApiError(400, "All fields are required");
    }

    // Configure Nodemailer transporter
    // NOTE: In a real application, use environment variables for credentials
    // For testing, we can use Ethereal or a dummy logger if env vars are missing
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail', // e.g., 'gmail'
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS // Your password or app password
        }
    });

    try {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail({
                from: `"${name}" <${email}>`, // sender address
                to: process.env.EMAIL_USER, // list of receivers (admin)
                subject: `Enquiry: ${subject}`, // Subject line
                text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, // plain text body
                html: `<p><strong>Name:</strong> ${name}</p>
                       <p><strong>Email:</strong> ${email}</p>
                       <p><strong>Message:</strong><br/>${message}</p>` // html body
            });
            console.log(`Email sent from ${email}`);
        } else {
            console.log("Email credentials not found in environment variables. Logging enquiry:");
            console.log({ name, email, subject, message });
        }

        return res.status(200).json(
            new ApiResponse(200, {}, "Enquiry sent successfully")
        );
    } catch (error) {
        console.error("Error sending email:", error);
        throw new ApiError(500, "Failed to send enquiry email");
    }
});

export { sendEnquiry };
