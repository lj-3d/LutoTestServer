const express = require("express");
const eventsRouter = express.Router();
const tools = require("../utils/tools");
const httpCodes = require("../http_codes");
const checkAuth = require("../middleware/check-auth");
const responseMapper = require("../mapper/eventsMapper").transformList;

const EventDBModel = require("../db/models/event").eventDBModel;
const ErrorResponse = require("../response/models/default").ErrorResponse;

eventsRouter.get("/", checkAuth, (req, res, next) => {
    EventDBModel.find(null, null, tools.getPaginationOptions(req), (error, docs) => {
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

module.exports = eventsRouter;
