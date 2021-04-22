const jwt = require("jsonwebtoken");
const httpCodes = require("../http_codes");
require("dotenv").config();
const ErrorResponse = require("../response/models/default").ErrorResponse;

module.exports = (req, res, next) => {
    try {
        const hasToken = req.headers.hasOwnProperty('authorization');
        if (!hasToken) {
            res.status(httpCodes.BadRequest).json(new ErrorResponse('Token is missing!!!'));
        } else {
            const token = req.headers.authorization;
            req.userData = jwt.verify(token, process.env.JWT_KEY);
            next();
        }
    } catch (error) {
        res.status(httpCodes.Unauthorized).json(new ErrorResponse('Token invalid or expired!!!'));
    }
}