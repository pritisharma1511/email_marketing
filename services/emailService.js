import nodemailer from 'nodemailer';

// You would typically use process.env.SMTP_HOST etc.
// For the MVP, we assume these environment variables exist or we fallback to console testing
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendEmail({ to, from, subject, html }) {
    try {
        const info = await transporter.sendMail({
            from,
            to,
            subject,
            html,
        });

        console.log(`Email sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}
