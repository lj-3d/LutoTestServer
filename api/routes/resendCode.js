const express = require("express");
const resendCodeRouter = express.Router();
const authController = require("../controller/authController");

resendCodeRouter.post("/", authController);

module.exports = resendCodeRouter;