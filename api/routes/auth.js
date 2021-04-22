const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/authController");

authRouter.post("/", authController);

module.exports = authRouter;
