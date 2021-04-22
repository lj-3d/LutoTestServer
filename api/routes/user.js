const express = require("express");
const multer = require("multer");
const userRouter = express.Router();
const checkAuth = require("../middleware/check-auth");
const httpCodes = require("../http_codes");
const tools = require("../utils/tools");
const uploadImageToStorage = require("../storage/firebase").uploadImageToStorage;

const upload = multer({
    storage: multer.memoryStorage(), limits: {fileSize: 5 * 1024 * 1024}
});

const UserDBModel = require("../db/models/user").userDBModel;
const responseMapper = require("../mapper/userMapper").transformObject;
const ErrorResponse = require("../response/models/default").ErrorResponse;


//Get profile
userRouter.get('/', checkAuth, (req, res, next) => {
    const phoneNumber = req.userData.phoneNumber;
    UserDBModel.findOne()
        .where('phoneNumber')
        .equals(phoneNumber)
        .exec()
        .then((result) => {
            const response = responseMapper(result._doc);
            res.status(httpCodes.OK).json(response);
        })
        .catch((error) => {
            const response = new ErrorResponse(error);
            res.status(httpCodes.InternalServerError).json(response);
        });
});

//Register user
userRouter.post('/fill_info', checkAuth, (req, res, next) => {
    const doBeforeUpdate = (mappedObject) => {
        mappedObject.set('card', tools.generateUserCode());
        mappedObject.set('dateOfStart', Date.now());
        return mappedObject;
    }
    const doAfterUpdate = (_) => {
        res.status(httpCodes.OK).json({});
    }
    updateUser(req, res, doBeforeUpdate, doAfterUpdate)
});

// Update user profile
userRouter.post('/', checkAuth, (req, res, next) => {
    const doAfterUpdate = (updateUser) => {
        const response = responseMapper(updateUser);
        res.status(httpCodes.OK).json(response);
    }
    updateUser(req, res, null, doAfterUpdate)
});

//Register user
userRouter.post('/subscribe', checkAuth, (req, res, next) => {
    const doAfterUpdate = (_) => {
        res.status(httpCodes.OK).json({});
    }
    updateUser(req, res, null, doAfterUpdate)
});

//Avatar
userRouter.post('/avatar', checkAuth, upload.single('avatar'), (req, res, next) => {
        uploadImageToStorage(req).then((url) => {
            res.status(httpCodes.OK).json({url});
        }).catch((error) => {
            const response = new ErrorResponse(error);
            res.status(httpCodes.InternalServerError).json(response);
        });
    }
);

//Logout user
userRouter.post('/logout', checkAuth, (req, res, next) => {
    UserDBModel.updateOne(
        {'phoneNumber': phoneNumber},
        {
            $set: {
                fcmToken: null
            }
        }, {new: true}, (error, _) => {
            if (error) {
                const response = new ErrorResponse(error);
                res.status(httpCodes.InternalServerError).json(response);
            } else {
                UserDBModel.findOne({'phoneNumber': phoneNumber})
                    .exec((error, result) => {
                        if (error) {
                            const response = new ErrorResponse(error);
                            res.status(httpCodes.InternalServerError).json(response);
                        } else {
                            res.status(httpCodes.OK).json({});
                        }
                    })
            }
        })
        .catch(error => {
            const response = new ErrorResponse(error);
            res.status(httpCodes.InternalServerError).json(response);
        });
});


function updateUser(req, res, doBeforeUpdate, doAfterUpdate) {
    const phoneNumber = req.userData.phoneNumber;
    UserDBModel.updateOne(
        {'phoneNumber': phoneNumber},
        {
            $set: tools.transformToDBModel(req, doBeforeUpdate)
        }, {new: true}, (error, _) => {
            if (error) {
                const response = new ErrorResponse(error);
                res.status(httpCodes.InternalServerError).json(response);
            } else {
                UserDBModel.findOne({'phoneNumber': phoneNumber})
                    .exec((error, result) => {
                        if (error) {
                            const response = new ErrorResponse(error);
                            res.status(httpCodes.InternalServerError).json(response);
                        } else {
                            if (result === null) {
                                const response = new ErrorResponse("User does not exist!!!");
                                return res.status(httpCodes.NotFound).json(response);
                            }
                            doAfterUpdate(result._doc);
                        }
                    })
            }
        })
        .catch(error => {
            const response = new ErrorResponse(error);
            res.status(httpCodes.InternalServerError).json(response);
        });
}

module.exports = userRouter;
