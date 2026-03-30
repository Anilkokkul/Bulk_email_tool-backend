const History = require("../models/history.model");
const mongoose = require("mongoose");
const Mailing_Lists = require("../models/mailingList.model");

const BouncedEmail = require("../models/bouncedEmail.model");

exports.getHistory = async (req, res) => {
  try {
    const histories = await History.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    
    // Find all bounces related to these histories
    const historyIds = histories.map(h => h._id);
    const allBounces = await BouncedEmail.find({ campaignId: { $in: historyIds } }).lean();
    
    // Group bounces by campaign ID
    const bouncesByCampaign = {};
    allBounces.forEach(bounce => {
      const cid = bounce.campaignId.toString();
      if (!bouncesByCampaign[cid]) bouncesByCampaign[cid] = [];
      bouncesByCampaign[cid].push(bounce);
    });
    
    // Attach bounced emails to each history record
    const result = histories.map(h => ({
      ...h,
      bouncedDetails: bouncesByCampaign[h._id.toString()] || []
    }));

    res.status(200).send(result);
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
