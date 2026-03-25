const sendBulk = require("../utils/sending_bulk_emails");
const History = require("../models/history.model");

exports.sendBulkEmails = async (req, res) => {
  try {
    const { recipients, subject, template } = req.body;

    if (recipients.length == 0) {
      return res.status(422).send({
        message: "Please provide at least one recipient",
      });
    }

    const result = await sendBulk(recipients, subject, template);
    
    if (result.success) {
      const acceptedCount = result.info.accepted ? result.info.accepted.length : 0;
      const rejectedCount = result.info.rejected ? result.info.rejected.length : 0;
      const recipientsCount = recipients.length;
      
      let status = "Success";
      if (rejectedCount === recipientsCount) status = "Failed";
      else if (rejectedCount > 0) status = "Partial";

      await History.create({
        user: req.user._id,
        subject,
        recipientsCount,
        acceptedCount,
        rejectedCount,
        status
      });

      res.status(201).send({ message: "Email sent successfully" });
    } else {
      await History.create({
        user: req.user._id,
        subject,
        recipientsCount: recipients.length,
        acceptedCount: 0,
        rejectedCount: recipients.length,
        status: "Failed"
      });

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
