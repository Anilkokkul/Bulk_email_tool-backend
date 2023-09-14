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
      text: content,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log("Error while sending mail. Internal server error", error);
    return false;
  }
};

module.exports = sendBulk;
