const Users = require("../models/user.model");
const Tokens = require("../models/token.model");
const crypto = require("crypto");
const sendResetLink = require("../utils/Sending_emails");
// const { sendResetLink } = require("../utils/Sending_emails");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const payload = req.body;

    const user = await Users.findOne({ email: payload.email });

    if (user) {
      return res.status(409).send({
        message: "An account is already registered with your email",
      });
    }
    const userWithMobile = await Users.findOne({
      mobileNumber: payload.mobileNumber,
    });

    if (userWithMobile) {
      return res.status(409).send({
        message: "An account is already registered with your mobile number",
      });
    }

    const hashedvalue = await bcrypt.hash(payload.password, 10);

    payload.hashedPassword = hashedvalue;
    delete payload.password;

    const newUser = new Users(payload);

    newUser
      .save()
      .then((data) => {
        return res
          .status(201)
          .send({ message: `New user created successfully`, data: data });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Error occured while creating the user",
          error: error.message,
        });
      });

    //
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await Users.findOne({ email: email });

    if (existingUser) {
      if (bcrypt.compareSync(password, existingUser.hashedPassword)) {
        const token = jwt.sign(
          { _id: existingUser._id },
          process.env.SECRET_KEY
        );
        res.cookie("accessToken", token, {
          // httpOnly: false,
          // secure: true,
          expires: new Date(Date.now() + 86400000),
        });
        return res.status(200).send({
          message: "User Logged-in Successfully",
        });
      }
      return res.status(400).send({
        message: "Incorrect Password!!",
        password: password,
      });
    }
    res.status(400).send({
      message: "Entered email is not a existing email id",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    await res.clearCookie("accessToken");
    res.status(200).send({
      message: "User Logged-Out Successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        message: "Please enter email !!!",
      });
    }

    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(400).send({
        message: "This email is does not exist",
      });
    }

    let token = await Tokens.findOne({ userId: user._id });

    if (token) {
      await token.deleteOne();
    }

    const newToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = await bcrypt.hash(newToken, 10);
    const tokenPayload = new Tokens({ userId: user._id, token: hashedToken });

    await tokenPayload.save();

    const link = `http://localhost:3000/reset-password/?token=${newToken}&userId=${user._id}`;

    const isResetLinkSent = await sendResetLink(
      user.email,
      "Password reset Request",
      link
    );

    if (isResetLinkSent) {
      res
        .status(200)
        .send({ message: "Reset Password link Email Sent Successfully" });
    } else {
      res.status(550).send({
        message: "Error while sending email",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { userId, token, newPassword } = req.body;

    const resetToken = await Tokens.findOne({ userId: userId });

    if (!resetToken) {
      return res.status(404).send({ message: "Token not found" });
    }

    const isValidToken = bcrypt.compareSync(token, resetToken.token);

    if (!isValidToken) {
      return res.status(401).send({ message: "Invalid Token" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    Users.findByIdAndUpdate(
      { _id: userId },
      { $set: { hashedPassword: hashedPassword } }
    )
      .then((data) => {
        res.status(201).send({
          message: "Password reset successfully",
          User: data,
        });
      })
      .catch((error) => {
        res.status(500).send({ message: "Server Error" });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
};
