const express = require("express");
const positionsRouter = express.Router();
const httpCodes = require("../http_codes");
const responseMapper = require("../mapper/positionsMapper").transformList;

const PositionDBModel = require("../db/models/positions").positionDBModel;
const ErrorResponse = require("../response/models/default").ErrorResponse;

positionsRouter.get("/", (req, res, next) => {
    PositionDBModel.find((error, docs) => {
        if (error) {
            res.status(httpCodes.InternalServerError).json(new ErrorResponse(error));
        } else {
            if (docs === null || docs.length === 0) {
                res.status(httpCodes.OK).json([]);
            } else {
                res.status(httpCodes.OK).json(responseMapper(docs));
            }
        }
    })
});

module.exports = positionsRouter;
