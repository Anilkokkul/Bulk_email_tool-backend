const express = require("express");
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../Controllers/auth.controllers");

const router = express.Router();

//register user
router.post("/register", register);

//login user
router.post("/login", login);

//logout user
router.get("/logout", logout);

//forgot Password link share to change the password change
router.post("/forgot-password", forgotPassword);

//reset user password
router.post("/reset-password", resetPassword);

module.exports = router;
