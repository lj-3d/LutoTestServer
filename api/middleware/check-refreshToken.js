const jwt = require("jsonwebtoken");
const httpCodes = require("../http_codes");
require("dotenv").config();
const ErrorResponse = require("../response/models/default").ErrorResponse;

module.exports = (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (typeof refreshToken === 'undefined') {
            const response = new ErrorResponse('RefreshToken is missing!!!');
            return res.status(httpCodes.BadRequest).json(response);
        } else {
            req.userData = jwt.verify(refreshToken, process.env.JWRT_KEY);
            next();
        }
    } catch (error) {
        res.status(httpCodes.Unauthorized).json(new ErrorResponse('RefreshToken invalid or expired!!!'));
    }
}