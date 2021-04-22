const express = require("express");
const verify = require("../controller/verifyController").verify;
const verifyRouter = express.Router();

verifyRouter.post("/", verify);



module.exports = verifyRouter;
