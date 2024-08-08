const nodemailer = require('nodemailer');
const env = require("../../.env");

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            // host: 'smtp.gmail.com',
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: env.MAIL_SENDER_EMAIL,
                pass: env.MAIL_SENDER_PASSWORD,
            },
            tls: {
                // Do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        console.log("Mail Credentials obtained Successfully")

        let info = await transporter.sendMail({
            from: '"Mayank" <lbmuser04@hotmail.com>',
            // to: "lbmuser04@gmail.com",
            to: "hellolbm@yopmail.com",
            subject: title,
            html: body,
        });
        console.log("Info: ", info);
        return info;
    } catch (error) {
        console.log(error.message);
    }
};

let sendVerificationEmail = async (email, otp) => {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            `<h1>Here is Your OTP</h1>
        <p>Enter this otp <strong>${otp}</strong></p>`
        );
        console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
        console.log("Error while sending email: ", error);
        throw error;
    }
}

module.exports = sendVerificationEmail;