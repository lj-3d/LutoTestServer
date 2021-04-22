const mongoose = require("mongoose");
const httpCodes = require("../http_codes");
const tools = require("../utils/tools");
const phoneUtils = require("../utils/phoneFormatterUtil");
const updateRefreshToken = require("./refreshTokenController").updateRefreshToken;


const AuthDBModel = require("../db/models/auth").authDBModel;
const UserDBModel = require("../db/models/user").userDBModel;
const TokenResponse = require("../response/models/auth").TokenResponse;
const ErrorResponse = require("../response/models/default").ErrorResponse;

const verify = (req, res, next) => {
    console.log(tools.generateSmsCode())
    const phoneNumber = phoneUtils.validateAndGetFormattedPhoneNumber(req, res);
    console.log(phoneNumber);
    AuthDBModel.findOne()
        .where("phoneNumber")
        .equals(phoneNumber)
        .exec()
        .then((doc) => {
            if (doc === null) {
                const response = new ErrorResponse(
                    `Invalid phoneNumber. No codes found for number ${phoneNumber}`
                );
                res.status(httpCodes.BadRequest).json(response);
            } else {
                const smsCode = req.body.code.toString();
                if (doc.smsCodes[doc.smsCodes.length - 1] === smsCode) {
                    const token = tools.generateToken(phoneNumber);
                    const refreshToken = tools.generateRefreshToken(phoneNumber);
                    checkAndCreateUser(res, phoneNumber, token, refreshToken);
                } else {
                    const response = new ErrorResponse(
                        `Invalid code. Use your last code you've receiver to number ${doc.phoneNumber}`
                    );
                    res.status(httpCodes.BadRequest).json(response);
                }
            }
        })
        .catch((error) => {
            const response = new ErrorResponse(error);
            res.status(httpCodes.InternalServerError).json(response);
            console.log(error);
        });
};

function checkAndCreateUser(res, phoneNumber, token, refreshToken) {
    const response = new TokenResponse(token, refreshToken);
    console.log(`checkAndCreateUser phone --> ${phoneNumber}`)
    UserDBModel.findOne({phoneNumber: phoneNumber}, null, null, (error, userInDB) => {
        if (error) {
            const errorResponse = new ErrorResponse(error);
            res.status(httpCodes.BadRequest).json(errorResponse);
        } else {
            if (userInDB === null) {
                let user = new UserDBModel({
                    _id: new mongoose.Types.ObjectId(),
                    phoneNumber: phoneNumber,
                    refreshToken: refreshToken
                });
                user.save()
                    .then((savedUser) => {
                        res.status(httpCodes.Created).json(response);
                    })
                    .catch((error) => {
                        const errorResponse = new ErrorResponse(error);
                        res.status(httpCodes.InternalServerError).json(errorResponse);
                    });
            } else {
                updateRefreshToken(phoneNumber, refreshToken, res, () => {
                    if (!tools.hasObjectAllRequiredFields(userInDB,
                        ['name', 'lastName', 'position'])) {
                        res.status(httpCodes.Created).json(response);
                    } else {
                        res.status(httpCodes.OK).json(response);
                    }
                });
            }
        }
    });
}


module.exports = {
    verify: verify
}