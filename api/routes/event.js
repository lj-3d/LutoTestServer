const express = require("express");
const eventRouter = express.Router();
const httpCodes = require("../http_codes");
const checkAuth = require("../middleware/check-auth");
const eventsMapper = require("../mapper/eventsMapper").transformObject;

const EventDBModel = require("../db/models/event").eventDBModel;
const ErrorResponse = require("../response/models/default").ErrorResponse;

eventRouter.get("/:id", checkAuth, (req, res, next) => {
    console.log(req);
    if (typeof req.params.id === 'undefined') {
        const response = new ErrorResponse(`<id>' is missing!!!`);
        res.status(httpCodes.Unauthorized).json(response);
    } else {
        EventDBModel.findOne({_id: req.params.id}, (error, doc) => {
            if (error) {
                res.status(httpCodes.InternalServerError).json(new ErrorResponse(error));
            } else {
                if (doc === null) {
                    res.status(httpCodes.NotFound).json(new ErrorResponse('Event does not exist!!'));
                } else {
                    res.status(httpCodes.OK).json(eventsMapper(doc._doc));
                }
            }
        });
    }
});

module.exports = eventRouter;
