const express = require("express");
const {
  createMailList,
  getAllMailingList,
  updateMailingList,
  deleteMailingList,
} = require("../Controllers/mailingList.controllers");
const { isAuth } = require("../utils/authentication");

const router = express.Router();

//to create mailing list
router.post("/mailing-list", isAuth, createMailList);

//API to get all mailing lists
router.get("/mailing-list", isAuth, getAllMailingList);

//To update the  existing mailing list
router.put("/mailing-list/:id", isAuth, updateMailingList);

router.delete("/mailing-list/:id", isAuth, deleteMailingList);

module.exports = router;
