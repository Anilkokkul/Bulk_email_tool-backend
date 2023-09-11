const express = require("express");
const { isAuth } = require("../utils/authentication");
const {
  getAllTemplates,
  createTemplate,
  deleteTemplate,
} = require("../Controllers/template.controllers");

const router = express.Router();

//get all templates
router.get("/templates", isAuth, getAllTemplates);

//to create a template
router.post("/templates", isAuth, createTemplate);

//to delete template
router.delete("/deleteTemplate/:id", isAuth, deleteTemplate);

module.exports = router;
