const Templates = require("../models/templates.model");

exports.getAllTemplates = async (req, res) => {
  try {
    await Templates.find()
      .then((data) => {
        res.status(200).send({
          message: "Templates Retrieved Successfully",
          Templates: data,
        });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Error while getting templates",
          Error: error,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      Error: error.message,
    });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const payload = req.body;

    const newTemplate = new Templates(payload);
    await newTemplate
      .save()
      .then((data) => {
        res.status(201).send({
          message: "New template added Successfully",
          Template: data,
        });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Error while adding template",
          Error: error,
        });
      });
  } catch (error) {
    res.status(400).send({
      message: "Error while getting templates",
      Error: error,
    });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTemplate = await Templates.findByIdAndDelete(id);
    if (deletedTemplate) {
      res.status(200).send({
        message: "Template deleted Successfully",
        Deleted_template: deletedTemplate,
      });
    } else {
      res.status(404).send({
        message: "Template not found",
      });
    }
  } catch (error) {
    res.status(400).send({
      message: "Error while deleting templates",
      Error: error,
    });
  }
};
