const express = require("express");
const workerRouter = express.Router();
const httpCodes = require("../http_codes");
const checkAuth = require("../middleware/check-auth");
const responseMapper = require("../mapper/workersMapper").transformObject;

const UserDBModel = require("../db/models/user").userDBModel;
const ErrorResponse = require("../response/models/default").ErrorResponse;

workerRouter.get("/:id", checkAuth, (req, res, next) => {
    if (typeof req.params.id === 'undefined') {
        const response = new ErrorResponse(`<id>' is missing!!!`);
        res.status(httpCodes.BadRequest).json(response);
    } else {
        UserDBModel.findOne({_id: req.params.id}, (error, doc) => {
            if (error) {
                res.status(httpCodes.InternalServerError).json(new ErrorResponse(error));
            } else {
                if (doc === null) {
                    res.status(httpCodes.NotFound).json(new ErrorResponse('Worker does not exist!!'));
                } else {
                    res.status(httpCodes.OK).json(responseMapper(doc._doc));
                }
            }
        });
    }
});

module.exports = workerRouter;
