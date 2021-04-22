const express = require("express");
const refreshTokenRouter = express.Router();
const checkRefreshToken = require("../middleware/check-refreshToken");
const refreshToken = require("../controller/refreshTokenController").refreshToken;

refreshTokenRouter.post("/", checkRefreshToken, refreshToken);

module.exports = refreshTokenRouter;
