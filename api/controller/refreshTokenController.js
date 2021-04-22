const httpCodes = require("../http_codes");
const tools = require("../utils/tools");

const UserDBModel = require("../db/models/user").userDBModel;
const ErrorResponse = require("../response/models/default").ErrorResponse;
const TokenResponse = require("../response/models/auth").TokenResponse;

const refreshToken = (req, res, next) => {
    const phoneNumber = req.userData.phoneNumber;
    const refreshToken = req.body.refreshToken;
    UserDBModel.findOne()
        .where('phoneNumber').equals(phoneNumber)
        .exec()
        .then(userInDB => {
            const userRefreshToken = userInDB.refreshToken;
            console.log(`user token -> ${userRefreshToken}`);
            console.log(`token to check -> ${refreshToken}`);
            if (userRefreshToken !== null
                && userRefreshToken !== undefined
                && userRefreshToken === refreshToken) {
                const newToken = tools.generateToken(phoneNumber);
                const newRefreshToken = tools.generateRefreshToken(phoneNumber);
                updateRefreshToken(phoneNumber, newRefreshToken, res, () => {
                    if (userInDB === null) {
                        res.status(httpCodes.NotFound).json(new ErrorResponse('User does not exist!!'));
                    } else {
                        const response = new TokenResponse(newToken, newRefreshToken);
                        res.status(httpCodes.OK).json(response);
                    }
                });
            } else {
                res.status(httpCodes.SessionEnd).json(new ErrorResponse('RefreshToken is invalid!!!'));
            }
        }).catch(error => {
        const errorResponse = new ErrorResponse(error);
        res.status(httpCodes.BadRequest).json(errorResponse);
    });
};

function updateRefreshToken(phoneNumber, newRefreshToken, res, doOnSuccess) {
    UserDBModel.updateOne({phoneNumber: phoneNumber}, {
        $set: {
            refreshToken: newRefreshToken,
        }
    }, null, (error, doc) => {
        if (error) {
            res.status(httpCodes.InternalServerError).json(new ErrorResponse(error));
        } else {
            doOnSuccess();
        }
    });
};

module.exports = {
    refreshToken: refreshToken,
    updateRefreshToken: updateRefreshToken
}