import nodemailer from "nodemailer";

const sendMail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", 
            auth: {
                user: process.env.SMTP_EMAIL,  
                pass: process.env.SMTP_PASS,        
            },
        });

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            from: "prakhargarg0514@gmail.com",
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (err) {
        console.error("Error sending email:", err);
    }
};