const History = require("../models/history.model");

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
    const stats = await History.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalCampaigns: { $sum: 1 },
          totalEmailsSent: { $sum: "$recipientsCount" },
          totalAccepted: { $sum: "$acceptedCount" },
          totalRejected: { $sum: "$rejectedCount" }
        }
      }
    ]);
    
    if (stats.length > 0) {
      res.status(200).send(stats[0]);
    } else {
      res.status(200).send({
        totalCampaigns: 0,
        totalEmailsSent: 0,
        totalAccepted: 0,
        totalRejected: 0
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error", Error: error });
  }
};
