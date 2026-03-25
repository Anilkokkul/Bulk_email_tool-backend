const express = require("express");
const { getHistory, getStats } = require("../Controllers/history.controllers");
const { isAuth } = require("../utils/authentication");

const router = express.Router();

router.get("/history", isAuth, getHistory);
router.get("/history/stats", isAuth, getStats);

module.exports = router;
