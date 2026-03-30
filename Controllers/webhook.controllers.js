const History = require("../models/history.model");
const BouncedEmail = require("../models/bouncedEmail.model");

exports.handleResendWebhook = async (req, res) => {
  try {
    const payload = req.body;
    // Resend fires these events payload.type
    if (payload.type === "email.bounced" || payload.type === "email.suppressed" || payload.type === "email.complained") {
      const emailData = payload.data;
      const bouncedAddress = emailData.to[0] || emailData.to;
      const tags = emailData.tags || {};
      
      // Extract the history document ID injected securely during the send call
      const campaignId = tags.historyid;
      
      if (campaignId) {
        // The email hard bounced later: decrement accepted, increment rejected
        await History.findByIdAndUpdate(campaignId, {
          $inc: { acceptedCount: -1, rejectedCount: 1 }
        });
      }
      
      // Extract precise error reason so the UI can show exactly why it failed
      let errorRemark = payload.type;
      if (emailData.bounce && emailData.bounce.error) {
        errorRemark = `Delivery Failed: The email address ${bouncedAddress} could not be reached. Reason: ${emailData.bounce.error}`;
      } else if (emailData.suppressed && emailData.suppressed.message) {
        errorRemark = `Delivery Skipped: The email address ${bouncedAddress} is unable to receive emails because it had previously bounced or complained.`;
      }
      
      // Keep a precise ledger of which email failed
      await BouncedEmail.create({
        email: bouncedAddress,
        reason: errorRemark,
        campaignId: campaignId
      });
      
      console.log(`[Webhook] Logged bounce for ${bouncedAddress}`);
    }
    
    // Resend requires a 2xx response immediately or it will retry
    res.status(200).send({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
