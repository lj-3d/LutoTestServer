const express = require("express");
const workersRouter = express.Router();
const httpCodes = require("../http_codes");
const checkAuth = require("../middleware/check-auth");
const responseMapper = require("../mapper/workersMapper").transformList;

const UserDBModel = require("../db/models/user").userDBModel;
const ErrorResponse = require("../response/models/default").ErrorResponse;

workersRouter.get("/", checkAuth, (req, res, next) => {
    const filterQuery = {
        card: {
            $ne: null
        },
        name: {
            $ne: null
        },
        lastName: {
            $ne: null
        },
        position: {
            $ne: null
        }
    }
    UserDBModel.find(filterQuery, (error, docs) => {
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

module.exports = workersRouter;
