const sendBulk = require("../utils/sending_bulk_emails");

exports.sendBulkEmails = async (req, res) => {
  try {
    const { recipients, subject, template } = req.body;

    if (recipients.length == 0) {
      return res.status(422).send({
        message: "Please provide at least one recipient",
      });
    }

    const isEmailsSent = await sendBulk(recipients, subject, template);
    if (isEmailsSent) {
      res.status(201).send({ message: "Email sent successfully" });
    } else {
      res
        .status(403)
        .send({ message: "Error sending email: internal server error" });
    }
  } catch (error) {
    res.status(500).send({
      message: "internal server error",
      Error: error,
    });
  }
};
