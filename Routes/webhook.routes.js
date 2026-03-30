const express = require("express");
const router = express.Router();
const { handleResendWebhook } = require("../Controllers/webhook.controllers");

router.post("/resend", handleResendWebhook);

module.exports = router;
