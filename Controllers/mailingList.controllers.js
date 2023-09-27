const Mailing_Lists = require("../models/mailingList.model");

exports.createMailList = async (req, res) => {
  try {
    const payload = req.body;

    const newMailingList = new Mailing_Lists(payload);

    if (!payload.name || !payload.emails) {
      return res.status(500).send({
        message: "Name or email missing, please enter campaign details",
      });
    }

    await newMailingList
      .save()
      .then((data) => {
        res.status(201).send({
          message: "Mailing List added successfully",
          Mailing_List: data,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: "Error while adding mailing list please try again",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "internal server error",
      Error: error.message,
    });
  }
};

exports.getAllMailingList = (req, res) => {
  try {
    Mailing_Lists.find()
      .then((data) => {
        res.status(201).send({
          message: "Mailing List Retrieved successfully",
          Mailing_List: data,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: "Error while getting mailing list please try again",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "internal server error",
      Error: error.message,
    });
  }
};

exports.updateMailingList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, emails } = req.body;

    const updatedMailingList = await Mailing_Lists.findByIdAndUpdate(id, {
      name,
      emails,
    })
      .then((data) => {
        res.status(201).send({
          message: "Mailing List Updated successfully",
          Mailing_List: data,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: "Error while updating mailing list please try again",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "internal server error",
      Error: error.message,
    });
  }
};

exports.deleteMailingList = (req, res) => {
  try {
    const { id } = req.params;

    const deletedList = Mailing_Lists.findByIdAndDelete(id)
      .then((data) => {
        res.status(201).send({
          message: "Mailing List Deleted successfully",
          Mailing_List: data,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: "Error while deleting mailing list please try again",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "internal server error",
      Error: error.message,
    });
  }
};
