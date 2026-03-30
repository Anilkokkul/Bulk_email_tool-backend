const History = require("../models/history.model");
const mongoose = require("mongoose");
const Mailing_Lists = require("../models/mailingList.model");

exports.getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).send(history);
  } catch (error) {
    res.status(500).send({ message: "Internal server error", Error: error });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalCampaigns = await Mailing_Lists.countDocuments();

    const stats = await History.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: null,
          totalEmailsSent: { $sum: "$recipientsCount" },
          totalAccepted: { $sum: "$acceptedCount" },
          totalRejected: { $sum: "$rejectedCount" }
        }
      }
    ]);
    
    if (stats.length > 0) {
      const responseData = stats[0];
      responseData.totalCampaigns = totalCampaigns;
      res.status(200).send(responseData);
    } else {
      res.status(200).send({
        totalCampaigns,
        totalEmailsSent: 0,
        totalAccepted: 0,
        totalRejected: 0
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error", Error: error });
  }
};
