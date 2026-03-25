const nodemailer = require("nodemailer");

const sendBulk = async (emails, subject, content) => {
  try {
    let transporter = await nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "anilkokkul8076@gmail.com",
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: '"MailMegaPro"<anilkokkul8076@gmail.com>',
      to: emails,
      subject: subject,
      html: content,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.log("Error while sending mail. Internal server error", error);
    return { success: false, error };
  }
};

module.exports = sendBulk;
