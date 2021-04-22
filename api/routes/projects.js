const express = require("express");
const projectRouter = express.Router();
const tools = require("../utils/tools");
const httpCodes = require("../http_codes");
const checkAuth = require("../middleware/check-auth");
const responseMapper = require("../mapper/projectsMapper").transformList;

const ProjectDBModel = require("../db/models/project").projectDBModel;
const ErrorResponse = require("../response/models/default").ErrorResponse;
const UserDBModel = require("../db/models/user").userDBModel;

projectRouter.get("/", checkAuth, (req, res, next) => {
    getProjects(req, res, null)
});

projectRouter.get("/my", checkAuth, (req, res, next) => {
    const phoneNumber = req.userData.phoneNumber;
    UserDBModel.findOne()
        .where('phoneNumber')
        .equals(phoneNumber)
        .exec()
        .then((result) => {
            getProjects(req, res, {members: {"$in": [result._id]}})
        })
        .catch((error) => {
            const response = new ErrorResponse(error);
            res.status(httpCodes.InternalServerError).json(response);
        });
});

function getProjects(req, res, filterQuery) {
    ProjectDBModel.find(filterQuery, null, tools.getPaginationOptions(req), (error, docs) => {
        if (error) {
            res.status(httpCodes.InternalServerError).json(new ErrorResponse(error));
        } else {
            res.status(httpCodes.OK).json(responseMapper(docs));
        }
    });
}

module.exports = projectRouter;
