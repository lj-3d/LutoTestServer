const express = require("express");
const vacationsRouter = express.Router();
const mongoose = require("mongoose");
const tools = require("../utils/tools");
const httpCodes = require("../http_codes");
const checkAuth = require("../middleware/check-auth");

const VacationsDBModel = require("../db/models/vacations").vacationsDBModel;
const ErrorResponse = require("../response/models/default").ErrorResponse;

vacationsRouter.get("/", checkAuth, (req, res, next) => {
    const phoneNumber = req.userData.phoneNumber
    VacationsDBModel.findOne()
        .where("phoneNumber")
        .equals(phoneNumber)
        .exec()
        .then((doc) => {
            if (doc === null) {
                const vacationsModel = new VacationsDBModel({
                    _id: new mongoose.Types.ObjectId(),
                    phoneNumber: phoneNumber,
                    vacation: {
                        available: 20,
                        used: 0
                    },
                    remotes: {
                        available: 10,
                        used: 0
                    },
                    sickLeave: {
                        available: 10,
                        used: 0
                    }
                });
                vacationsModel
                    .save()
                    .then((result) => {
                        const response = tools.transformObjects(result._doc, ['phoneNumber', '_id', '__v']);
                        res.status(httpCodes.OK).json(response);
                    })
                    .catch((error) => {
                        const response = new ErrorResponse(error);
                        res.status(httpCodes.InternalServerError).json(response);
                    });
            } else {
                const response = tools.transformObjects(doc._doc, ['phoneNumber', '_id', '__v']);
                res.status(httpCodes.OK).json(response);
            }
        })
        .catch((error) => {
            console.log(error);
        });
});

module.exports = vacationsRouter;
