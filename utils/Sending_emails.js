const nodemailer = require("nodemailer");

const sendResetLink = async (email, subject, content) => {
  try {
    let transporter = await nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "anilkokkul8076@gmail.com",
        pass: process.env.PASS,
      },
    });

    let mailoptions = {
      from: "anilkokkul8076@gmail.com",
      to: email,
      subject: subject,
      text: JSON.stringify(content),
    };

    await transporter.sendMail(mailoptions);
    return true;
  } catch (error) {
    console.log("Error while sending email: Internal Server Error", error);
    return false;
  }
};

module.exports = sendResetLink;
