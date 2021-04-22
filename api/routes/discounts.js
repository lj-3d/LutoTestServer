const express = require("express");
const discountsRouter = express.Router();
const httpCodes = require("../http_codes");
const checkAuth = require("../middleware/check-auth");
const responseMapper = require("../mapper/discountMapper").transformList;

const DiscountDBModel = require("../db/models/discount").discountDBModel;
const ErrorResponse = require("../response/models/default").ErrorResponse;

discountsRouter.get("/", checkAuth, (req, res, next) => {
    DiscountDBModel.find((error, docs) => {
        if (error) {
            res.status(httpCodes.InternalServerError).json(new ErrorResponse(error));
        } else {
            res.status(httpCodes.OK).json(responseMapper(docs));
        }
    });
});

module.exports = discountsRouter;
