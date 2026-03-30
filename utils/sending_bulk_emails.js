const { Resend } = require("resend");

// They can supply this through their .env, fallback prevents server crash on startup
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_prevent_crash");

const sendBulk = async (emails, subject, content, historyId) => {
  try {
    const senderEmail = process.env.SENDER_EMAIL || "onboarding@resend.dev";

    // Create an array of individual email payloads for batch sending
    const bulkPayloads = emails.map((email) => ({
      from: `MailMegaPro <${senderEmail}>`,
      to: [email],
      subject: subject,
      html: content,
      tags: historyId ? [{ name: "historyid", value: historyId.toString() }] : [],
    }));

    const response = await resend.batch.send(bulkPayloads);
    if (response.error) {
      console.log("Resend API returned an error:", response.error);
      return { success: false, ...response.error };
    }

    // Webhooks handle async failures. Synchronous result assumes immediate acceptance.
    return { 
      success: true, 
      info: {
        accepted: emails,
        rejected: []
      } 
    };
  } catch (error) {
    console.log("Error while sending mail. Internal server error", error);
    return { success: false, error };
  }
};

module.exports = sendBulk;
