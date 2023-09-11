const express = require("express");
const { sendBulkEmails } = require("../Controllers/bulkEmail.controllers");
const { isAuth } = require("../utils/authentication");

const router = express.Router();

//to send bulk emails
router.post("/bulk-email-sending", isAuth, sendBulkEmails);

module.exports = router;
