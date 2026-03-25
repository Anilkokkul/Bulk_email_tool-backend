const express = require("express");
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUser
} = require("../Controllers/auth.controllers");
const { isAuth } = require("../utils/authentication");

const router = express.Router();

//register user
router.post("/register", register);

//login user
router.post("/login", login);

//get User
router.get("/user",isAuth, getUser);

//logout user
router.get("/logout", logout);

//forgot Password link share to change the password change
router.post("/forgot-password", forgotPassword);

//reset user password
router.post("/reset-password", resetPassword);

module.exports = router;
