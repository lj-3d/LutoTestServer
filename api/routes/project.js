const express = require("express");
const projectRouter = express.Router();
const httpCodes = require("../http_codes");
const checkAuth = require("../middleware/check-auth");
const responseMapper = require("../mapper/projectsMapper").transformObject;

const ProjectDBModel = require("../db/models/project").projectDBModel;
const UserDBModel = require("../db/models/user").userDBModel;
const ErrorResponse = require("../response/models/default").ErrorResponse;

projectRouter.get("/:id", checkAuth, (req, res, next) => {
    if (typeof req.params.id === 'undefined') {
        const response = new ErrorResponse(`<id>' is missing!!!`);
        res.status(httpCodes.BadRequest).json(response);
    } else {
        ProjectDBModel.findOne({_id: req.params.id}, (error, doc) => {
            if (error) {
                res.status(httpCodes.InternalServerError).json(new ErrorResponse(error));
            } else {
                if (doc === null) {
                    res.status(httpCodes.NotFound).json(new ErrorResponse('Project does not exist!!'));
                } else {
                    res.status(httpCodes.OK).json(responseMapper(doc._doc));
                }
            }
        });
    }
});

projectRouter.post("/member/", checkAuth, (req, res, next) => {
    updateProjectMemberShip(req, res, (doc) => {
        return {
            $addToSet: {
                members: doc._id,
            }
        }
    });
});

projectRouter.delete("/member/", checkAuth, (req, res, next) => {
    updateProjectMemberShip(req, res, (doc) => {
        return {
            $pull: {
                members: doc._id,
            }
        }
    });
});

function updateProjectMemberShip(req, res, updateQuery) {
    const projectId = req.body.projectId;
    if (typeof projectId === 'undefined') {
        const response = new ErrorResponse(`<projectId>' is missing!!!`);
        res.status(httpCodes.BadRequest).json(response);
    } else {
        getProfile(req, res, updateQuery);
    }
}

function getProfile(req, res, updateQuery) {
    const phoneNumber = req.userData.phoneNumber;
    const projectId = req.body.projectId;
    if (typeof projectId === 'undefined') {
        const response = new ErrorResponse(`<projectId>' is missing!!!`);
        res.status(httpCodes.BadRequest).json(response);
    } else {
        UserDBModel.findOne()
            .where('phoneNumber')
            .equals(phoneNumber)
            .exec()
            .then((doc) => {
                ProjectDBModel.updateOne(
                    {_id: projectId},
                    updateQuery(doc))
                    .then((result) => {
                        res.status(httpCodes.OK).json({});
                    })
                    .catch((error) => {
                        res.status(httpCodes.InternalServerError).json(new ErrorResponse(error));
                    });
            })
            .catch((error) => {
                const response = new ErrorResponse(error);
                res.status(httpCodes.InternalServerError).json(response);
            });
    }
}

module.exports = projectRouter;
