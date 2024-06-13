const nodeMailer = require('nodemailer');

exports.sendEmail = async (options) => {
    var transporter = nodeMailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "87539d0784c089",
            pass: "fbfaf8aeb6430e"
        }
    });
    const mailOptions = {
        from: "Nodemailer Contact",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    await transporter.sendMail(mailOptions);
};
